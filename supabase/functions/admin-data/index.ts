import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-DATA] ${step}${detailsStr}`);
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

    const body = req.method === "POST" ? await req.json() : {};
    const url = new URL(req.url);
    const action = url.searchParams.get("action") || body.action;
    const table = url.searchParams.get("table") || body.table;

    logStep("Request details", { action, table, method: req.method });

    if (req.method === "GET") {
      if (table === "teams") {
        const { data: teams, error } = await supabaseClient
          .from("teams")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        logStep("Teams fetched", { count: teams.length });
        return new Response(JSON.stringify({ teams }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      if (table === "rsvps") {
        const { data: rsvps, error } = await supabaseClient
          .from("rsvps")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        logStep("RSVPs fetched", { count: rsvps.length });
        return new Response(JSON.stringify({ rsvps }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      if (table === "settings") {
        const { data: settings, error } = await supabaseClient
          .from("admin_settings")
          .select("*")
          .single();

        if (error) throw error;
        
        logStep("Settings fetched");
        return new Response(JSON.stringify({ settings }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }
    }

    if (req.method === "POST" && action === "update-team-status") {
      const { teamId, paymentStatus } = body;
      
      const { data, error } = await supabaseClient
        .from("teams")
        .update({ payment_status: paymentStatus })
        .eq("id", teamId)
        .select()
        .single();

      if (error) throw error;

      logStep("Team status updated", { teamId, paymentStatus });
      return new Response(JSON.stringify({ team: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (req.method === "POST" && action === "update-settings") {
      const settings = body;
      
      const { data, error } = await supabaseClient
        .from("admin_settings")
        .update(settings)
        .eq("id", settings.id)
        .select()
        .single();

      if (error) throw error;

      logStep("Settings updated");
      return new Response(JSON.stringify({ settings: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ error: "Invalid request" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
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