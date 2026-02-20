import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";
import defaultHero from "@/assets/default-event-hero.jpg";

interface Event {
  id: string;
  title: string;
  hero_image: string | null;
  date: string;
  start_time: string;
  location: string | null;
  price: number;
  capacity: number | null;
  registrant_count?: number;
}

const EventbriteSection = () => {
  const backgroundConfig = getSectionBackground('about');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })
        .limit(2);

      if (data) {
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
    <BackgroundSection 
      {...backgroundConfig}
      className="py-20 bg-background"
      id="events"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-sm font-bold border-primary text-primary bg-background/20 backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2" />
              UPCOMING EVENTS
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                FIND YOUR
              </span>
              <span className="block text-foreground">NEXT MATCH</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse upcoming events and register your team.
            </p>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card rounded-lg border border-border animate-pulse">
                  <div className="h-48 bg-muted rounded-t-lg" />
                  <div className="p-6 space-y-3">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground text-lg mb-12">No upcoming events yet. Check back soon!</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {events.map((event) => {
                const spotsLeft = event.capacity ? event.capacity - (event.registrant_count || 0) : null;
                const soldOut = spotsLeft !== null && spotsLeft <= 0;

                return (
                  <div key={event.id} className="group bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
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
                      <Link to={`/events/${event.id}`}>
                        <Button variant="cta" className="w-full mt-2 font-semibold">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All CTA */}
          <div className="text-center">
            <Link to="/events">
              <Button variant="cta" size="lg" className="gap-2">
                View All Events <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </BackgroundSection>
  );
};

export default EventbriteSection;
