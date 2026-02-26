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
        // Insert/update registrant
        const { data: regData, error: insertError } = await supabase.from("registrants").upsert({
          event_id: meta.event_id,
          full_name: meta.full_name,
          email: meta.email,
          phone: meta.phone || null,
          team_name: meta.team_name || null,
          payment_status: "paid",
          stripe_payment_id: session.payment_intent as string,
        }, { onConflict: "event_id,email" }).select().single();

        if (insertError) console.error("Insert error:", insertError);

        // Create/update payment record
        await supabase.from("payments").upsert({
          registration_id: regData?.id || null,
          event_id: meta.event_id,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_customer_id: session.customer as string || null,
          amount_cents: session.amount_total || 0,
          currency: session.currency || "usd",
          status: "paid",
        }, { onConflict: "stripe_checkout_session_id" });

        // Audit log
        await supabase.from("audit_logs").insert({
          action: "payment_confirmed",
          entity_type: "registration",
          entity_id: regData?.id || null,
          details: { event_id: meta.event_id, amount: session.amount_total, stripe_pi: session.payment_intent },
        });

        // Schedule reminder emails
        try {
          const { data: eventData } = await supabase
            .from("events")
            .select("*")
            .eq("id", meta.event_id)
            .single();

          if (eventData) {
            // Send immediate confirmation
            await supabase.functions.invoke("send-event-confirmation", {
              body: {
                recipientEmail: meta.email,
                recipientName: meta.full_name,
                event: eventData,
                amountPaid: session.amount_total ? session.amount_total / 100 : null,
              },
            });

            // Schedule 24h reminder
            const eventStart = new Date(`${eventData.date}T${eventData.start_time}`);
            const reminder24h = new Date(eventStart.getTime() - 24 * 60 * 60 * 1000);
            const reminder2h = new Date(eventStart.getTime() - 2 * 60 * 60 * 1000);
            const now = new Date();

            if (reminder24h > now) {
              await supabase.from("scheduled_jobs").insert({
                job_type: "send_email",
                run_at: reminder24h.toISOString(),
                payload: { template_key: "reminder_24h", to_email: meta.email, event_id: meta.event_id, registration_id: regData?.id, data: { eventTitle: eventData.title, eventDate: eventData.date, eventTime: eventData.start_time, location: eventData.location } },
              });
            }
            if (reminder2h > now) {
              await supabase.from("scheduled_jobs").insert({
                job_type: "send_email",
                run_at: reminder2h.toISOString(),
                payload: { template_key: "reminder_2h", to_email: meta.email, event_id: meta.event_id, registration_id: regData?.id, data: { eventTitle: eventData.title, eventDate: eventData.date, eventTime: eventData.start_time, location: eventData.location } },
              });
            }
          }
        } catch (emailErr) {
          console.error("Email/scheduling error:", emailErr);
        }
      }
    }

    // Handle payment failures
    if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;
      await supabase.from("payments").update({ status: "failed" })
        .eq("stripe_payment_intent_id", pi.id);
      await supabase.from("audit_logs").insert({
        action: "payment_failed",
        entity_type: "payment",
        details: { stripe_pi: pi.id, error: pi.last_payment_error?.message },
      });
    }

    // Handle refunds from Stripe
    if (event.type === "charge.refunded") {
      const charge = event.data.object as any;
      const piId = charge.payment_intent;
      if (piId) {
        const refundedCents = charge.amount_refunded || 0;
        const fullRefund = refundedCents >= charge.amount;
        await supabase.from("payments").update({
          refunded_cents: refundedCents,
          status: fullRefund ? "refunded" : "partially_refunded",
        }).eq("stripe_payment_intent_id", piId);

        if (fullRefund) {
          const { data: payment } = await supabase.from("payments")
            .select("registration_id").eq("stripe_payment_intent_id", piId).single();
          if (payment?.registration_id) {
            await supabase.from("registrants").update({ payment_status: "refunded" })
              .eq("id", payment.registration_id);
          }
        }
        await supabase.from("audit_logs").insert({
          action: "refund_recorded",
          entity_type: "payment",
          details: { stripe_pi: piId, refunded_cents: refundedCents },
        });
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
