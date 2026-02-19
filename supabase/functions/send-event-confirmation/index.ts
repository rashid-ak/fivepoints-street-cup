import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) throw new Error("RESEND_API_KEY not set");

    const { recipientEmail, recipientName, event, amountPaid } = await req.json();

    const eventDate = new Date(event.date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formatTime = (t: string) => {
      const [h, m] = t.split(":");
      const hour = parseInt(h);
      const ampm = hour >= 12 ? "PM" : "AM";
      return `${hour > 12 ? hour - 12 : hour}:${m} ${ampm}`;
    };

    const paymentNote = amountPaid
      ? `<p style="color:#16a34a;font-weight:bold;">✅ Payment confirmed — $${amountPaid.toFixed(2)} paid</p>`
      : `<p style="color:#16a34a;font-weight:bold;">✅ No payment required — you're all set!</p>`;

    const customMessage = event.email_template || "";

    const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#111;color:#f5f5f5;border-radius:12px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#f97316,#eab308);padding:32px;text-align:center;">
        <h1 style="margin:0;font-size:24px;color:#111;">You're Registered! 🎉</h1>
      </div>
      <div style="padding:32px;">
        <p>Hey ${recipientName},</p>
        <p>You're officially registered for <strong>${event.title}</strong>!</p>
        ${customMessage ? `<p>${customMessage}</p>` : ""}
        <div style="background:#1a1a2e;border-radius:8px;padding:20px;margin:20px 0;">
          <p style="margin:4px 0;"><strong>📅 Date:</strong> ${eventDate}</p>
          <p style="margin:4px 0;"><strong>⏰ Time:</strong> ${formatTime(event.start_time)}${event.end_time ? ` – ${formatTime(event.end_time)}` : ""}</p>
          <p style="margin:4px 0;"><strong>📍 Location:</strong> ${event.location}</p>
        </div>
        ${paymentNote}
        <p><strong>Next steps:</strong> You'll receive any additional event details 24 hours before the event.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="https://fivepoints-street-cup.lovable.app/events/${event.id}" style="background:#f97316;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;">View Event</a>
        </div>
        <p style="color:#888;font-size:12px;margin-top:32px;text-align:center;">5 Points Cup • Atlanta, GA</p>
      </div>
    </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "5 Points Cup <noreply@5pointscup.com>",
        to: [recipientEmail],
        subject: `You're registered for ${event.title}!`,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Resend error: ${errText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[SEND-EVENT-CONFIRMATION] ERROR:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
