import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import NavigationBar from "@/components/NavigationBar";

const EventRegister = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", teamName: "" });

  useEffect(() => {
    if (!id) return;
    supabase.from("events").select("*").eq("id", id).single().then(({ data }) => {
      setEvent(data);
      setLoading(false);
    });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event || !id) return;
    setSubmitting(true);

    // Check duplicate
    const { data: existing } = await supabase
      .from("registrants")
      .select("id")
      .eq("event_id", id)
      .eq("email", form.email)
      .eq("payment_status", "paid")
      .maybeSingle();

    if (existing) {
      toast({ title: "Already registered", description: "This email is already registered for this event.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const price = Number(event.price);

    if (price === 0) {
      // Free event — insert directly
      const { error } = await supabase.from("registrants").upsert({
        event_id: id,
        full_name: form.fullName,
        email: form.email,
        phone: form.phone || null,
        team_name: form.teamName || null,
        payment_status: "paid",
      }, { onConflict: "event_id,email" });

      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        setSubmitting(false);
        return;
      }

      // Send confirmation email for free event
      try {
        await supabase.functions.invoke("send-event-confirmation", {
          body: {
            recipientEmail: form.email,
            recipientName: form.fullName,
            event,
            amountPaid: null,
          },
        });
      } catch {}

      navigate(`/events/${id}/confirmation?name=${encodeURIComponent(form.fullName)}&email=${encodeURIComponent(form.email)}`);
    } else {
      // Paid — store in session and go to checkout
      sessionStorage.setItem("registration", JSON.stringify({ ...form, eventId: id }));
      navigate(`/events/${id}/checkout`);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="pt-24 container mx-auto px-4">
          <div className="animate-pulse h-64 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-lg">
        <Link to={`/events/${id}`} className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to event
        </Link>

        <h1 className="text-3xl font-black text-foreground mb-2">Register</h1>
        <p className="text-muted-foreground mb-8">{event.title}</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-card p-8 rounded-lg border border-border">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Full Name *</label>
            <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
            <Input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Team Name</label>
            <Input value={form.teamName} onChange={(e) => setForm({ ...form, teamName: e.target.value })} />
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex justify-between items-center mb-4">
              <span className="text-foreground font-medium">Total</span>
              <span className="text-2xl font-black text-primary">
                {Number(event.price) === 0 ? "Free" : `$${Number(event.price)}`}
              </span>
            </div>
            <Button type="submit" variant="cta" className="w-full" disabled={submitting}>
              {submitting ? "Processing..." : Number(event.price) === 0 ? "Complete Registration" : "Continue to Payment"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegister;
