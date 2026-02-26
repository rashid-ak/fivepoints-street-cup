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
      const meta = session.metadata || {};

      // Step 4a: Read registration_id from metadata, fallback to client_reference_id
      const registrationId = meta.registration_id || session.client_reference_id;
      const eventId = meta.event_id;

      if (!registrationId) {
        console.error("[WEBHOOK] No registration_id found in metadata or client_reference_id", {
          session_id: session.id,
          metadata: meta,
          client_reference_id: session.client_reference_id,
        });
        // Still return 200 to Stripe so it doesn't retry
        return new Response(JSON.stringify({ received: true, warning: "no_registration_id" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Step 5: Idempotency — check if already confirmed
      const { data: existingReg } = await supabase
        .from("registrants")
        .select("id, payment_status")
        .eq("id", registrationId)
        .single();

      if (existingReg?.payment_status === "paid") {
        console.log("[WEBHOOK] Registration already confirmed, skipping:", registrationId);
        return new Response(JSON.stringify({ received: true, skipped: "already_confirmed" }), {
          headers: { "Content-Type": "application/json" },
        });
      }

      // Step 4b: Update payments row
      const { error: paymentUpdateError } = await supabase
        .from("payments")
        .update({
          status: "paid",
          stripe_payment_intent_id: session.payment_intent as string,
          stripe_customer_id: (session.customer as string) || null,
          registration_id: registrationId,
        })
        .eq("stripe_checkout_session_id", session.id);

      if (paymentUpdateError) {
        console.error("[WEBHOOK] Payment update error:", paymentUpdateError);
      }

      // Step 4c: Update registrant status to confirmed (paid)
      const { error: regUpdateError } = await supabase
        .from("registrants")
        .update({
          payment_status: "paid",
          stripe_payment_id: session.payment_intent as string,
        })
        .eq("id", registrationId);

      if (regUpdateError) {
        console.error("[WEBHOOK] Registration update error:", regUpdateError);
      }

      // Step 4d: Audit log
      await supabase.from("audit_logs").insert({
        action: "payment_confirmed",
        entity_type: "registration",
        entity_id: registrationId,
        details: {
          event_id: eventId,
          amount: session.amount_total,
          stripe_pi: session.payment_intent,
          stripe_session: session.id,
        },
      });

      // Step 4e: Confirmation email + reminders
      try {
        if (eventId) {
          const { data: eventData } = await supabase
            .from("events")
            .select("*")
            .eq("id", eventId)
            .single();

          if (eventData) {
            await supabase.functions.invoke("send-event-confirmation", {
              body: {
                recipientEmail: meta.email || existingReg?.payment_status, // fallback
                recipientName: meta.full_name || "",
                event: eventData,
                amountPaid: session.amount_total ? session.amount_total / 100 : null,
              },
            });

            // Schedule reminders
            const eventStart = new Date(`${eventData.date}T${eventData.start_time}`);
            const reminder24h = new Date(eventStart.getTime() - 24 * 60 * 60 * 1000);
            const reminder2h = new Date(eventStart.getTime() - 2 * 60 * 60 * 1000);
            const now = new Date();

            const reminderPayload = (templateKey: string) => ({
              template_key: templateKey,
              to_email: meta.email,
              event_id: eventId,
              registration_id: registrationId,
              data: {
                eventTitle: eventData.title,
                eventDate: eventData.date,
                eventTime: eventData.start_time,
                location: eventData.location,
              },
            });

            if (reminder24h > now) {
              await supabase.from("scheduled_jobs").insert({
                job_type: "send_email",
                run_at: reminder24h.toISOString(),
                payload: reminderPayload("reminder_24h"),
              });
            }
            if (reminder2h > now) {
              await supabase.from("scheduled_jobs").insert({
                job_type: "send_email",
                run_at: reminder2h.toISOString(),
                payload: reminderPayload("reminder_2h"),
              });
            }
          }
        }
      } catch (emailErr) {
        console.error("[WEBHOOK] Email/scheduling error:", emailErr);
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

    // Handle refunds
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
