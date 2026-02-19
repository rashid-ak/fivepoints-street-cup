import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Clock, Users, ArrowLeft } from "lucide-react";
import NavigationBar from "@/components/NavigationBar";
import defaultHero from "@/assets/default-event-hero.jpg";

interface EventData {
  id: string;
  title: string;
  description: string | null;
  hero_image: string | null;
  date: string;
  start_time: string;
  end_time: string | null;
  location: string | null;
  price: number;
  capacity: number | null;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventData | null>(null);
  const [registrantCount, setRegistrantCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await supabase.from("events").select("*").eq("id", id).single();
      if (data) {
        setEvent(data as any);
        const { count } = await supabase
          .from("registrants")
          .select("*", { count: "exact", head: true })
          .eq("event_id", id)
          .eq("payment_status", "paid");
        setRegistrantCount(count || 0);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationBar />
        <div className="pt-24 container mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-muted rounded-lg" />
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Event not found</h1>
          <Link to="/events"><Button>Browse Events</Button></Link>
        </div>
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    return `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${m} ${hour >= 12 ? "PM" : "AM"}`;
  };

  const spotsLeft = event.capacity ? event.capacity - registrantCount : null;
  const soldOut = spotsLeft !== null && spotsLeft <= 0;
  const price = Number(event.price);

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      
      {/* Hero */}
      <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img src={event.hero_image || defaultHero} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <Link to="/events" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary mb-4 text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Events
            </Link>
            <h1 className="text-3xl md:text-5xl font-black text-foreground">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Info bar */}
            <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 text-foreground">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="font-medium">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <Clock className="w-5 h-5 text-accent" />
                <span>{formatTime(event.start_time)}{event.end_time ? ` – ${formatTime(event.end_time)}` : ""}</span>
              </div>
              <div className="flex items-center gap-2 text-foreground">
                <MapPin className="w-5 h-5 text-energy" />
                <span>{event.location || "TBD"}</span>
              </div>
              {spotsLeft !== null && (
                <div className="flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{soldOut ? "Sold out" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="prose prose-invert max-w-none">
                <h2 className="text-2xl font-bold text-foreground mb-4">About This Event</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
              </div>
            )}
          </div>

          {/* Registration box - sticky on desktop */}
          <div className="hidden lg:block">
            <div className="sticky top-24 bg-card rounded-lg border border-border p-6 space-y-4">
              <div className="text-center">
                {price === 0 ? (
                  <Badge className="bg-green-600 text-foreground text-lg px-4 py-1">Free</Badge>
                ) : (
                  <p className="text-3xl font-black text-primary">${price}</p>
                )}
              </div>
              <Button
                variant="cta"
                className="w-full"
                disabled={soldOut}
                onClick={() => navigate(`/events/${event.id}/register`)}
              >
                {soldOut ? "Sold Out" : "Register Now"}
              </Button>
              {spotsLeft !== null && !soldOut && (
                <p className="text-center text-sm text-muted-foreground">{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 z-50">
        <div className="flex items-center justify-between gap-4">
          <div>
            {price === 0 ? (
              <span className="font-bold text-green-500">Free</span>
            ) : (
              <span className="text-2xl font-black text-primary">${price}</span>
            )}
          </div>
          <Button
            variant="cta"
            disabled={soldOut}
            onClick={() => navigate(`/events/${event.id}/register`)}
          >
            {soldOut ? "Sold Out" : "Register Now"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
