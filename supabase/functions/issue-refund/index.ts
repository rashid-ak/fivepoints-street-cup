import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify admin auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Unauthorized");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) throw new Error("Unauthorized");

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "finance"]);
    
    if (!roleData || roleData.length === 0) throw new Error("Insufficient permissions");

    const { paymentId, amountCents, reason } = await req.json();
    if (!paymentId) throw new Error("paymentId required");

    // Get payment record
    const { data: payment, error: payErr } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single();

    if (payErr || !payment) throw new Error("Payment not found");
    if (!payment.stripe_payment_intent_id) throw new Error("No Stripe payment intent found");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const refundAmount = amountCents || (payment.amount_cents - payment.refunded_cents);

    // Create Stripe refund
    const refund = await stripe.refunds.create({
      payment_intent: payment.stripe_payment_intent_id,
      amount: refundAmount,
      reason: "requested_by_customer",
    });

    // Record refund
    await supabase.from("refunds").insert({
      payment_id: paymentId,
      stripe_refund_id: refund.id,
      amount_cents: refundAmount,
      reason: reason || null,
      created_by: user.id,
    });

    // Update payment
    const newRefunded = payment.refunded_cents + refundAmount;
    const newStatus = newRefunded >= payment.amount_cents ? "refunded" : "partially_refunded";
    await supabase.from("payments").update({
      refunded_cents: newRefunded,
      status: newStatus,
    }).eq("id", paymentId);

    // Update registration status if fully refunded
    if (newStatus === "refunded" && payment.registration_id) {
      await supabase.from("registrants").update({
        payment_status: "refunded",
      }).eq("id", payment.registration_id);
    }

    // Audit log
    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "refund_issued",
      entity_type: "payment",
      entity_id: paymentId,
      details: { amount_cents: refundAmount, stripe_refund_id: refund.id, reason },
    });

    return new Response(JSON.stringify({ success: true, refundId: refund.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[ISSUE-REFUND] ERROR:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: error instanceof Error && error.message === "Unauthorized" ? 401 : 500,
    });
  }
});
