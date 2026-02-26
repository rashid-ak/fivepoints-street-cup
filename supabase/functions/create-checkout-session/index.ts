import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const { eventId, fullName, email, phone, teamName } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("id", eventId)
      .single();

    if (eventError || !event) throw new Error("Event not found");

    // Check capacity
    if (event.capacity) {
      const { count } = await supabase
        .from("registrants")
        .select("*", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("payment_status", "paid");
      if (count !== null && count >= event.capacity) {
        throw new Error("Event is sold out");
      }
    }

    // Check duplicate (only paid registrations block)
    const { data: existing } = await supabase
      .from("registrants")
      .select("id")
      .eq("event_id", eventId)
      .eq("email", email)
      .eq("payment_status", "paid")
      .maybeSingle();

    if (existing) throw new Error("You are already registered for this event");

    // Step 1: Create pending registrant BEFORE Stripe session
    // Clean up any prior pending record for this email+event
    await supabase
      .from("registrants")
      .delete()
      .eq("event_id", eventId)
      .eq("email", email)
      .eq("payment_status", "pending");

    const { data: registrant, error: regError } = await supabase
      .from("registrants")
      .insert({
        event_id: eventId,
        full_name: fullName,
        email,
        phone: phone || null,
        team_name: teamName || null,
        payment_status: "pending",
        source: "public",
      })
      .select()
      .single();

    if (regError || !registrant) {
      console.error("Failed to create pending registrant:", regError);
      throw new Error("Failed to create registration record");
    }

    const registrationId = registrant.id;

    // Step 2: Create Stripe Checkout Session with registration_id in metadata
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const customers = await stripe.customers.list({ email, limit: 1 });
    const customerId = customers.data.length > 0 ? customers.data[0].id : undefined;

    const origin = req.headers.get("origin") || "https://fivepoints-street-cup.lovable.app";
    const amountCents = Math.round(Number(event.price) * 100);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      client_reference_id: registrationId,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: event.title,
            description: `Registration for ${event.title}`,
          },
          unit_amount: amountCents,
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${origin}/events/${eventId}/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/events/${eventId}/register`,
      metadata: {
        registration_id: registrationId,
        event_id: eventId,
        registration_type: event.event_type || "individual",
        environment: "live",
        full_name: fullName,
        email,
        phone: phone || "",
        team_name: teamName || "",
      },
    });

    // Step 3: Create payments row linked to registration
    await supabase.from("payments").insert({
      registration_id: registrationId,
      event_id: eventId,
      stripe_checkout_session_id: session.id,
      amount_cents: amountCents,
      currency: "usd",
      status: "requires_payment",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[CREATE-CHECKOUT-SESSION] ERROR:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
