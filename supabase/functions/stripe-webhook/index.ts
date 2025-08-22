import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      throw new Error("No Stripe signature found");
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    // For now, we'll process without signature verification in development
    // In production, you should set STRIPE_WEBHOOK_SECRET and verify the signature
    let event;
    try {
      const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
      if (webhookSecret) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        // Parse without verification for development
        event = JSON.parse(body);
        logStep("Processing webhook without signature verification (development mode)");
      }
    } catch (err) {
      logStep("Webhook signature verification failed", err);
      return new Response("Webhook signature verification failed", { status: 400 });
    }

    logStep("Processing event", { type: event.type, id: event.id });

    // Log the webhook attempt
    await supabaseClient
      .from("webhook_logs")
      .insert({
        stripe_event_id: event.id,
        event_type: event.type,
        payload: event,
        processed: false
      });

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Processing checkout session completed", { sessionId: session.id });

      if (session.metadata?.team_id) {
        // Update team payment status
        const { data: updatedTeam, error: updateError } = await supabaseClient
          .from("teams")
          .update({ 
            payment_status: 'paid',
            stripe_payment_intent_id: session.payment_intent as string
          })
          .eq("id", session.metadata.team_id)
          .select()
          .single();

        if (updateError) {
          logStep("Failed to update team payment status", updateError);
          throw updateError;
        }

        logStep("Team payment status updated", { teamId: session.metadata.team_id });

        // Send confirmation email
        try {
          await supabaseClient.functions.invoke('send-confirmation-email', {
            body: {
              emailType: "team_confirmation",
              recipientEmail: updatedTeam.captain_email,
              data: {
                teamName: updatedTeam.team_name,
                captainName: updatedTeam.captain_name,
                skillLevel: updatedTeam.skill_level,
                players: updatedTeam.players
              }
            }
          });
          logStep("Confirmation email sent");
        } catch (emailError) {
          logStep("Failed to send confirmation email", emailError);
          // Don't fail the webhook for email errors
        }

        // Mark webhook as processed
        await supabaseClient
          .from("webhook_logs")
          .update({ processed: true })
          .eq("stripe_event_id", event.id);
      }
    }

    // Handle payment_intent.succeeded event
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logStep("Processing payment intent succeeded", { paymentIntentId: paymentIntent.id });

      // Find team by payment intent ID and update status
      const { data: team, error: findError } = await supabaseClient
        .from("teams")
        .select()
        .eq("stripe_payment_intent_id", paymentIntent.id)
        .single();

      if (findError && findError.code !== 'PGRST116') {
        logStep("Error finding team by payment intent", findError);
      } else if (team) {
        const { error: updateError } = await supabaseClient
          .from("teams")
          .update({ payment_status: 'paid' })
          .eq("id", team.id);

        if (updateError) {
          logStep("Failed to update team payment status", updateError);
        } else {
          logStep("Team payment status updated via payment intent", { teamId: team.id });
        }
      }

      // Mark webhook as processed
      await supabaseClient
        .from("webhook_logs")
        .update({ processed: true })
        .eq("stripe_event_id", event.id);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });

    // Try to log the error
    try {
      const supabaseClient = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
        { auth: { persistSession: false } }
      );

      await supabaseClient
        .from("webhook_logs")
        .update({ 
          processed: false, 
          error_message: errorMessage 
        })
        .eq("stripe_event_id", "unknown");
    } catch (logError) {
      // Ignore logging errors
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});