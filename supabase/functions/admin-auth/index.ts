import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { compare } from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-AUTH] ${step}${detailsStr}`);
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

    const { password } = await req.json();
    logStep("Received login attempt");

    // Get admin settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from("admin_settings")
      .select("admin_password_hash")
      .single();

    if (settingsError) {
      logStep("Settings error", settingsError);
      throw new Error("Failed to get admin settings");
    }

    // Verify password
    const isValidPassword = await compare(password, settings.admin_password_hash);

    if (!isValidPassword) {
      logStep("Invalid password attempt");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid password" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    logStep("Admin authenticated successfully");

    // Generate a simple session token (in production, use proper JWT)
    const sessionToken = crypto.randomUUID();

    return new Response(JSON.stringify({ 
      success: true,
      sessionToken
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