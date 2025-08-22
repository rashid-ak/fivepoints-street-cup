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

    // Create RSVP record in database
    const { data: rsvp, error: rsvpError } = await supabaseClient
      .from("rsvps")
      .insert({
        name: rsvpData.name,
        email: rsvpData.email,
        zip_code: rsvpData.zipCode,
        party_size: parseInt(rsvpData.partySize)
      })
      .select()
      .single();

    if (rsvpError) {
      logStep("RSVP creation error", rsvpError);
      throw new Error(`Failed to create RSVP: ${rsvpError.message}`);
    }

    logStep("RSVP created successfully", { rsvpId: rsvp.id });

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