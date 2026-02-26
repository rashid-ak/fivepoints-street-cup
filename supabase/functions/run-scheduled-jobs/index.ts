import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Fetch scheduled jobs that are due
    const now = new Date().toISOString();
    const { data: jobs, error } = await supabase
      .from("scheduled_jobs")
      .select("*")
      .eq("status", "scheduled")
      .lte("run_at", now)
      .order("run_at")
      .limit(50);

    if (error) throw error;
    if (!jobs || jobs.length === 0) {
      return new Response(JSON.stringify({ processed: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let processed = 0;
    let failed = 0;

    for (const job of jobs) {
      // Mark as running
      await supabase.from("scheduled_jobs").update({
        status: "running",
        attempts: job.attempts + 1,
      }).eq("id", job.id);

      try {
        if (job.job_type === "send_email") {
          const payload = job.payload as any;
          
          // Invoke the send-confirmation-email function
          const { error: invokeError } = await supabase.functions.invoke("send-confirmation-email", {
            body: {
              emailType: payload.template_key,
              recipientEmail: payload.to_email,
              data: payload.data || {},
            },
          });

          if (invokeError) throw invokeError;

          // Log the email
          await supabase.from("email_logs").insert({
            registration_id: payload.registration_id || null,
            event_id: payload.event_id || null,
            recipient_email: payload.to_email,
            email_type: payload.template_key,
            status: "sent",
            sent_at: new Date().toISOString(),
          });
        }

        await supabase.from("scheduled_jobs").update({ status: "completed" }).eq("id", job.id);
        processed++;
      } catch (jobErr) {
        const errMsg = jobErr instanceof Error ? jobErr.message : String(jobErr);
        console.error(`[JOB ${job.id}] Failed:`, errMsg);
        
        const newStatus = job.attempts + 1 >= 3 ? "failed" : "scheduled";
        await supabase.from("scheduled_jobs").update({
          status: newStatus,
          last_error: errMsg,
        }).eq("id", job.id);
        failed++;
      }
    }

    return new Response(JSON.stringify({ processed, failed, total: jobs.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[RUN-SCHEDULED-JOBS] ERROR:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
