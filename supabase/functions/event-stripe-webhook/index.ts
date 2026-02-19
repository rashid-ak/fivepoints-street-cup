import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not set");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    let event;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (webhookSecret && signature) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      event = JSON.parse(body);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata;

      if (meta?.event_id) {
        // Insert registrant
        const { error: insertError } = await supabase.from("registrants").upsert({
          event_id: meta.event_id,
          full_name: meta.full_name,
          email: meta.email,
          phone: meta.phone || null,
          team_name: meta.team_name || null,
          payment_status: "paid",
          stripe_payment_id: session.payment_intent as string,
        }, { onConflict: "event_id,email" });

        if (insertError) console.error("Insert error:", insertError);

        // Send confirmation email
        try {
          const { data: eventData } = await supabase
            .from("events")
            .select("*")
            .eq("id", meta.event_id)
            .single();

          if (eventData) {
            await supabase.functions.invoke("send-event-confirmation", {
              body: {
                recipientEmail: meta.email,
                recipientName: meta.full_name,
                event: eventData,
                amountPaid: session.amount_total ? session.amount_total / 100 : null,
              },
            });
          }
        } catch (emailErr) {
          console.error("Email error:", emailErr);
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[EVENT-STRIPE-WEBHOOK] ERROR:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
