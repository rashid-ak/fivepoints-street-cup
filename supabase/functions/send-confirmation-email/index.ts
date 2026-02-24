import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SEND-EMAIL] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const { emailType, recipientEmail, data } = await req.json();
    logStep("Received email request", { emailType, recipientEmail });

    const resend = new Resend(resendApiKey);

    let emailContent;
    let subject;

    if (emailType === "team_confirmation") {
      subject = "🏆 Your Team is Confirmed - 5 Points Cup Tournament";
      emailContent = generateTeamConfirmationEmail(data);
    } else if (emailType === "rsvp_confirmation") {
      subject = "✅ RSVP Confirmed - 5 Points Cup Event";
      emailContent = generateRSVPConfirmationEmail(data);
    } else if (emailType === "manual_blast") {
      subject = data.subject || "5 Points Cup Update";
      emailContent = generateManualBlastEmail(data);
    } else {
      throw new Error("Invalid email type");
    }

    // Log email attempt
    const { data: emailLog, error: logError } = await supabaseClient
      .from("email_logs")
      .insert({
        recipient_email: recipientEmail,
        email_type: emailType,
        status: "pending",
        metadata: data
      })
      .select()
      .single();

    if (logError) {
      logStep("Failed to create email log", logError);
    }

    try {
      const { data: emailResult, error: emailError } = await resend.emails.send({
        from: "5 Points Cup <rashid@akanni.marketing>",
        to: [recipientEmail],
        subject: subject,
        html: emailContent,
      });

      if (emailError) {
        throw emailError;
      }

      logStep("Email sent successfully", { messageId: emailResult?.id });

      // Update email log as sent
      if (emailLog) {
        await supabaseClient
          .from("email_logs")
          .update({
            status: "sent",
            sent_at: new Date().toISOString(),
            metadata: { ...data, resend_id: emailResult?.id }
          })
          .eq("id", emailLog.id);
      }

      return new Response(JSON.stringify({ 
        success: true,
        messageId: emailResult?.id
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });

    } catch (emailError) {
      logStep("Email send failed", emailError);

      // Update email log as failed
      if (emailLog) {
        await supabaseClient
          .from("email_logs")
          .update({
            status: "failed",
            error_message: emailError.message,
            retry_count: 1
          })
          .eq("id", emailLog.id);
      }

      throw emailError;
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

function generateTeamConfirmationEmail(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Team Confirmed - 5 Points Cup</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">🏆 Your Team is Confirmed!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">Welcome to the 5 Points Cup Tournament</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #667eea; margin-top: 0;">Team Details</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Team Name:</strong> ${data.teamName}</p>
          <p><strong>Captain:</strong> ${data.captainName}</p>
          <p><strong>Skill Level:</strong> ${data.skillLevel}</p>
          <p><strong>Players:</strong> ${data.players?.join(', ') || 'TBD'}</p>
        </div>

        <h2 style="color: #667eea;">Event Information</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>📅 Date & Time:</strong> Saturday, September 20, 12:00 PM – 4:00 PM</p>
          <p><strong>📍 Location:</strong> Underground Atlanta — Upper Alabama St, across from 5 Points MARTA Station</p>
          <p><strong>⚽ Format:</strong> 3v3 tournament, max 6 players per team, 10-minute games, first to 5 points</p>
        </div>

        <h2 style="color: #667eea;">What's Next?</h2>
        <ul style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <li>Team check-in begins 30 minutes before tournament start (11:30 AM)</li>
          <li>Bring water, cleats, and your competitive spirit!</li>
          <li>Tournament bracket will be posted on game day</li>
          <li>Prize money: $1,000 for the winning team</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://maps.google.com/?q=Underground+Atlanta,+Upper+Alabama+St,+Atlanta,+GA" 
             style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 0 10px;">
            📍 Get Directions
          </a>
          <a href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20250920T160000Z%0ADTEND:20250920T200000Z%0ASUMMARY:5%20Points%20Cup%20Tournament%0ADESCRIPTION:3v3%20soccer%20tournament%20at%20Underground%20Atlanta%0ALOCATION:Underground%20Atlanta%2C%20Upper%20Alabama%20St%2C%20Atlanta%2C%20GA%0AEND:VEVENT%0AEND:VCALENDAR" 
             style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 0 10px;">
            📅 Add to Calendar
          </a>
        </div>

        <div style="background: #e9ecef; padding: 15px; border-radius: 8px; text-align: center; font-size: 14px; color: #6c757d;">
          Questions? Reply to this email or contact us at rashid@akanni.marketing
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateRSVPConfirmationEmail(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>RSVP Confirmed - 5 Points Cup</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">✅ RSVP Confirmed!</h1>
        <p style="margin: 10px 0 0 0; font-size: 18px;">See you at the 5 Points Cup</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #28a745; margin-top: 0;">Your RSVP Details</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Party Size:</strong> ${data.partySize} ${parseInt(data.partySize) === 1 ? 'person' : 'people'}</p>
        </div>

        <h2 style="color: #28a745;">Event Information</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p><strong>📅 Date & Time:</strong> Saturday, September 20, 12:00 PM – 4:00 PM</p>
          <p><strong>📍 Location:</strong> Underground Atlanta — Upper Alabama St, across from 5 Points MARTA Station</p>
        </div>

        <h2 style="color: #28a745;">Day Schedule</h2>
        <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <ul style="margin: 0; padding-left: 20px;">
            <li><strong>10:00 AM - 12:00 PM:</strong> Game 1 - Opening matches and community play</li>
            <li><strong>12:00 PM - 4:00 PM:</strong> Tournament - Main 3v3 competition</li>
            <li><strong>4:30 PM - 6:30 PM:</strong> Game 2 - Finals and celebration</li>
          </ul>
        </div>

        <h2 style="color: #28a745;">What to Expect</h2>
        <ul style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <li>Watch exciting tournament matches throughout the day</li>
          <li>Enjoy food trucks and family-friendly activities</li>
          <li>Big screen viewing areas for the best action</li>
          <li>Free admission and family-friendly atmosphere</li>
        </ul>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://maps.google.com/?q=Underground+Atlanta,+Upper+Alabama+St,+Atlanta,+GA" 
             style="background: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 0 10px;">
            📍 Get Directions
          </a>
          <a href="data:text/calendar;charset=utf8,BEGIN:VCALENDAR%0AVERSION:2.0%0ABEGIN:VEVENT%0ADTSTART:20250920T160000Z%0ADTEND:20250920T200000Z%0ASUMMARY:5%20Points%20Cup%20Event%0ADESCRIPTION:Soccer%20tournament%20spectator%20event%20at%20Underground%20Atlanta%0ALOCATION:Underground%20Atlanta%2C%20Upper%20Alabama%20St%2C%20Atlanta%2C%20GA%0AEND:VEVENT%0AEND:VCALENDAR" 
             style="background: #17a2b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 0 10px;">
            📅 Add to Calendar
          </a>
        </div>

        <div style="background: #e9ecef; padding: 15px; border-radius: 8px; text-align: center; font-size: 14px; color: #6c757d;">
          Questions? Reply to this email or contact us at rashid@akanni.marketing
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateManualBlastEmail(data: any): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.subject || "5 Points Cup"}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #e67e22 0%, #f1c40f 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">5 Points Cup</h1>
      </div>
      <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        ${data.body || ""}
        <div style="background: #e9ecef; padding: 15px; border-radius: 8px; text-align: center; font-size: 14px; color: #6c757d; margin-top: 20px;">
          Questions? Reply to this email or contact us at rashid@akanni.marketing
        </div>
      </div>
    </body>
    </html>
  `;
}