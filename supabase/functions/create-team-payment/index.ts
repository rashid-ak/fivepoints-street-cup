import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-TEAM-PAYMENT] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { teamData } = await req.json();
    logStep("Received team data", { teamName: teamData.teamName });

    // Create team record in database first
    const { data: team, error: teamError } = await supabaseClient
      .from("teams")
      .insert({
        team_name: teamData.teamName,
        captain_name: teamData.captainName,
        captain_email: teamData.captainEmail,
        captain_phone: teamData.captainPhone,
        player2_name: teamData.player2,
        player3_name: teamData.player3,
        player4_name: teamData.player4,
        skill_level: teamData.skillLevel,
        rules_acknowledged: teamData.rulesAcknowledged,
        media_release: teamData.mediaRelease,
        payment_status: 'pending'
      })
      .select()
      .single();

    if (teamError) {
      logStep("Team creation error", teamError);
      throw new Error(`Failed to create team: ${teamError.message}`);
    }

    logStep("Team created successfully", { teamId: team.id });

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    // Check if customer already exists
    const customers = await stripe.customers.list({ 
      email: teamData.captainEmail, 
      limit: 1 
    });
    
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      logStep("Found existing customer", { customerId });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : teamData.captainEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { 
              name: "5 Points Cup Tournament Entry",
              description: `Team: ${teamData.teamName} (${teamData.skillLevel})` 
            },
            unit_amount: 10000, // $100.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin")}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/registration`,
      metadata: {
        team_id: team.id,
        team_name: teamData.teamName
      }
    });

    logStep("Stripe session created", { sessionId: session.id });

    // Update team with Stripe session ID
    await supabaseClient
      .from("teams")
      .update({ stripe_session_id: session.id })
      .eq("id", team.id);

    logStep("Updated team with session ID");

    return new Response(JSON.stringify({ 
      url: session.url,
      teamId: team.id 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});