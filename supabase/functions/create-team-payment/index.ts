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

    // Validate required fields
    if (!teamData.teamName || !teamData.captainName || !teamData.captainEmail || !teamData.captainPhone || !teamData.rulesAcknowledged || !teamData.mediaRelease) {
      throw new Error("All required fields must be filled and rules must be acknowledged");
    }

    // Validate team size (max 6 players including captain)
    const totalPlayers = teamData.players.filter((player: string) => player.trim() !== '').length + 1; // +1 for captain
    if (totalPlayers > 6) {
      throw new Error("Team size cannot exceed 6 players total");
    }

    // Generate submission ID
    const submissionId = `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Check for duplicate submission (anti-spam)
    const { data: existingTeam } = await supabaseClient
      .from("teams")
      .select("id")
      .eq("captain_email", teamData.captainEmail)
      .eq("event_date", "2025-09-20")
      .maybeSingle();

    let team; // Declare team variable
    if (existingTeam) {
      logStep("Duplicate team submission detected", { email: teamData.captainEmail });
      // Update existing team instead of creating new one
      const { data: updatedTeam, error: updateError } = await supabaseClient
        .from("teams")
        .update({
          team_name: teamData.teamName,
          captain_name: teamData.captainName,
          captain_phone: teamData.captainPhone,
          players: teamData.players.filter((player: string) => player.trim() !== ''),
          skill_level: teamData.skillLevel,
          rules_acknowledged: teamData.rulesAcknowledged,
          media_release: teamData.mediaRelease,
          submission_id: submissionId,
          amount: 10000
        })
        .eq("id", existingTeam.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      team = updatedTeam;
    } else {
      // Create team record in database first
      const { data: newTeam, error: teamError } = await supabaseClient
        .from("teams")
        .insert({
          submission_id: submissionId,
          team_name: teamData.teamName,
          captain_name: teamData.captainName,
          captain_email: teamData.captainEmail,
          captain_phone: teamData.captainPhone,
          players: teamData.players.filter((player: string) => player.trim() !== ''),
          skill_level: teamData.skillLevel,
          rules_acknowledged: teamData.rulesAcknowledged,
          media_release: teamData.mediaRelease,
          payment_status: 'unpaid',
          amount: 10000,
          event_date: "2025-09-20"
        })
        .select()
        .single();

      if (teamError) {
        logStep("Team creation error", teamError);
        throw new Error(`Failed to create team: ${teamError.message}`);
      }

      team = newTeam;
    }

    logStep("Team created/updated successfully", { teamId: team.id });

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
      success_url: `${req.headers.get("origin")}/success?type=team`,
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