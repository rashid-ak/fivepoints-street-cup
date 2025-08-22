import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBMIT-RSVP] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { rsvpData } = await req.json();
    logStep("Received RSVP data", { email: rsvpData.email });

    // Validate required fields
    if (!rsvpData.name || !rsvpData.email) {
      throw new Error("Name and email are required");
    }

    // Check for duplicate RSVP within 5 minutes (anti-spam)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: existingRsvp } = await supabaseClient
      .from("rsvps")
      .select("id")
      .eq("email", rsvpData.email)
      .eq("event_date", "2025-09-20")
      .gt("created_at", fiveMinutesAgo)
      .maybeSingle();

    if (existingRsvp) {
      logStep("Duplicate RSVP detected", { email: rsvpData.email });
      return new Response(JSON.stringify({ 
        success: true,
        rsvpId: existingRsvp.id,
        message: "RSVP already exists"
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Create RSVP record in database
    const { data: rsvp, error: rsvpError } = await supabaseClient
      .from("rsvps")
      .insert({
        full_name: rsvpData.name,
        email: rsvpData.email,
        zip_code: rsvpData.zipCode,
        party_size: parseInt(rsvpData.partySize),
        event_date: "2025-09-20"
      })
      .select()
      .single();

    if (rsvpError) {
      logStep("RSVP creation error", rsvpError);
      throw new Error(`Failed to create RSVP: ${rsvpError.message}`);
    }

    logStep("RSVP created successfully", { rsvpId: rsvp.id });

    // Send confirmation email
    try {
      await supabaseClient.functions.invoke('send-confirmation-email', {
        body: {
          emailType: "rsvp_confirmation",
          recipientEmail: rsvp.email,
          data: {
            name: rsvp.full_name,
            partySize: rsvp.party_size
          }
        }
      });
      logStep("Confirmation email sent");
    } catch (emailError) {
      logStep("Failed to send confirmation email", emailError);
      // Don't fail the RSVP for email errors
    }

    return new Response(JSON.stringify({ 
      success: true,
      rsvpId: rsvp.id
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