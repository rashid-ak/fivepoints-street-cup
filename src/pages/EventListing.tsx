import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import NavigationBar from "@/components/NavigationBar";
import FooterSection from "@/components/FooterSection";
import defaultHero from "@/assets/default-event-hero.jpg";

interface Event {
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
  registrant_count?: number;
}

const EventListing = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("events")
        .select("*")
        .gte("date", today)
        .order("date", { ascending: true });

      if (data) {
        // Get registrant counts
        const eventsWithCounts = await Promise.all(
          data.map(async (event: any) => {
            const { count } = await supabase
              .from("registrants")
              .select("*", { count: "exact", head: true })
              .eq("event_id", event.id)
              .eq("payment_status", "paid");
            return { ...event, registrant_count: count || 0 };
          })
        );
        setEvents(eventsWithCounts);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
              Upcoming <span className="text-primary">Events</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Find your next competition and register today.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground text-lg">No upcoming events. Check back soon!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const spotsLeft = event.capacity ? event.capacity - (event.registrant_count || 0) : null;
                const soldOut = spotsLeft !== null && spotsLeft <= 0;

                return (
                  <Link key={event.id} to={`/events/${event.id}`} className="group">
                    <div className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img src={event.hero_image || defaultHero} alt={event.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                        {soldOut && (
                          <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                            <Badge variant="destructive" className="text-lg px-4 py-1">Sold Out</Badge>
                          </div>
                        )}
                      </div>
                      <div className="p-6 space-y-3">
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
                        <div className="space-y-1.5 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent" />
                            <span>{event.location || "TBD"}</span>
                          </div>
                          {spotsLeft !== null && !soldOut && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-energy" />
                              <span>{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  );
};

export default EventListing;
