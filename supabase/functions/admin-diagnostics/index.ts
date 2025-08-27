import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ADMIN-DIAGNOSTICS] ${step}${detailsStr}`);
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

    const { action } = await req.json();
    logStep("Processing action", { action });

    if (action === "test_rsvp") {
      // Create test RSVP
      const testEmail = "test-rsvp@example.com";
      const { data: rsvp, error: rsvpError } = await supabaseClient
        .from("rsvps")
        .insert({
          full_name: "Test RSVP User",
          email: testEmail,
          zip_code: "12345",
          party_size: 2,
          event_date: "2025-09-20"
        })
        .select()
        .single();

      if (rsvpError) {
        throw new Error(`Failed to create test RSVP: ${rsvpError.message}`);
      }

      // Send test email
      try {
        await supabaseClient.functions.invoke('send-confirmation-email', {
          body: {
            emailType: "rsvp_confirmation",
            recipientEmail: "rashid@akanni.marketing",
            data: {
              name: "Test RSVP User",
              partySize: 2
            }
          }
        });
        logStep("Test RSVP email sent to rashid@akanni.marketing");
      } catch (emailError) {
        logStep("Failed to send test email", emailError);
        throw new Error(`Email failed: ${emailError.message}`);
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: "Test RSVP created and email sent to rashid@akanni.marketing",
        rsvpId: rsvp.id
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "test_team") {
      // Create test team (mock payment success)
      const testEmail = "test-team@example.com";
      const { data: team, error: teamError } = await supabaseClient
        .from("teams")
        .insert({
          submission_id: `test_${Date.now()}`,
          team_name: "Test Team",
          captain_name: "Test Captain",
          captain_email: testEmail,
          captain_phone: "555-0123",
          players: ["Player 1", "Player 2"],
          skill_level: "Intermediate",
          rules_acknowledged: true,
          media_release: true,
          payment_status: 'paid',
          amount: 10000,
          event_date: "2025-09-20",
          stripe_payment_intent_id: `test_pi_${Date.now()}`
        })
        .select()
        .single();

      if (teamError) {
        throw new Error(`Failed to create test team: ${teamError.message}`);
      }

      // Send test email
      try {
        await supabaseClient.functions.invoke('send-confirmation-email', {
          body: {
            emailType: "team_confirmation",
            recipientEmail: "rashid@akanni.marketing",
            data: {
              teamName: "Test Team",
              captainName: "Test Captain",
              skillLevel: "Intermediate",
              players: ["Player 1", "Player 2"]
            }
          }
        });
        logStep("Test team email sent to rashid@akanni.marketing");
      } catch (emailError) {
        logStep("Failed to send test email", emailError);
        throw new Error(`Email failed: ${emailError.message}`);
      }

      return new Response(JSON.stringify({ 
        success: true,
        message: "Test team created and email sent to rashid@akanni.marketing",
        teamId: team.id
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "get_logs") {
      // Get recent email logs
      const { data: emailLogs } = await supabaseClient
        .from("email_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      // Get recent webhook logs
      const { data: webhookLogs } = await supabaseClient
        .from("webhook_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      return new Response(JSON.stringify({ 
        success: true,
        emailLogs: emailLogs || [],
        webhookLogs: webhookLogs || []
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    if (action === "resend_email") {
      const { emailLogId } = await req.json();
      
      // Get the email log
      const { data: emailLog, error } = await supabaseClient
        .from("email_logs")
        .select("*")
        .eq("id", emailLogId)
        .single();

      if (error || !emailLog) {
        throw new Error("Email log not found");
      }

      // Retry sending the email
      try {
        await supabaseClient.functions.invoke('send-confirmation-email', {
          body: {
            emailType: emailLog.email_type,
            recipientEmail: emailLog.recipient_email,
            data: emailLog.metadata
          }
        });

        // Update retry count
        await supabaseClient
          .from("email_logs")
          .update({ retry_count: (emailLog.retry_count || 0) + 1 })
          .eq("id", emailLogId);

        return new Response(JSON.stringify({ 
          success: true,
          message: "Email resent successfully"
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (emailError) {
        throw new Error(`Failed to resend email: ${emailError.message}`);
      }
    }

    throw new Error("Invalid action");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});