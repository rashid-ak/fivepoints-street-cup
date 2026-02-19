import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import NavigationBar from "@/components/NavigationBar";

const EventCheckout = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [registration, setRegistration] = useState<any>(null);

  useEffect(() => {
    const regData = sessionStorage.getItem("registration");
    if (!regData) {
      navigate(`/events/${id}/register`);
      return;
    }
    setRegistration(JSON.parse(regData));

    supabase.from("events").select("*").eq("id", id).single().then(({ data }) => {
      setEvent(data);
      setLoading(false);
    });
  }, [id, navigate]);

  const handleCheckout = async () => {
    if (!registration || !event) return;
    setLoading(true);

    const { data, error } = await supabase.functions.invoke("create-checkout-session", {
      body: {
        eventId: id,
        fullName: registration.fullName,
        email: registration.email,
        phone: registration.phone,
        teamName: registration.teamName,
      },
    });

    if (error || data?.error) {
      toast({ title: "Error", description: data?.error || error?.message || "Failed to create checkout", variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data?.url) {
      sessionStorage.removeItem("registration");
      window.location.href = data.url;
    }
  };

  if (loading || !event || !registration) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="pt-24 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <div className="pt-24 pb-16 container mx-auto px-4 max-w-lg">
        <h1 className="text-3xl font-black text-foreground mb-8">Checkout</h1>
        <div className="bg-card rounded-lg border border-border p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><span className="text-foreground font-medium">Event:</span> {event.title}</p>
              <p><span className="text-foreground font-medium">Date:</span> {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
              <p><span className="text-foreground font-medium">Time:</span> {formatTime(event.start_time)}</p>
              <p><span className="text-foreground font-medium">Location:</span> {event.location || "TBD"}</p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-medium text-foreground mb-2">Registrant</h3>
            <p className="text-sm text-muted-foreground">{registration.fullName}</p>
            <p className="text-sm text-muted-foreground">{registration.email}</p>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-foreground">Total</span>
              <span className="text-2xl font-black text-primary">${Number(event.price)}</span>
            </div>
          </div>

          <Button variant="cta" className="w-full" onClick={handleCheckout} disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Processing...</> : "Pay with Stripe"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            You'll be redirected to Stripe's secure checkout.
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link to={`/events/${id}/register`} className="text-sm text-muted-foreground hover:text-primary">← Back to registration</Link>
        </div>
      </div>
    </div>
  );
};

export default EventCheckout;
