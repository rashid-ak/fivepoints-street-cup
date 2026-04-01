import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";
import { poshEvents } from "@/config/posh-events";

const EventbriteSection = () => {
  const backgroundConfig = getSectionBackground('about');

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
          {poshEvents.length === 0 ? (
            <p className="text-center text-muted-foreground text-lg mb-12">No upcoming events yet. Check back soon!</p>
          ) : (
            <div className={`grid ${poshEvents.length === 1 ? 'max-w-lg mx-auto' : 'md:grid-cols-2'} gap-6 mb-12`}>
              {poshEvents.map((event) => (
                <a
                  key={event.id}
                  href={event.poshUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-glow">
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img
                        src={event.flyerImage}
                        alt={event.title}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 space-y-3">
                      {event.organizer && (
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{event.organizer}</p>
                      )}
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{event.title}</h3>
                      <div className="space-y-1.5 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{event.date}{event.time ? ` · ${event.time}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-accent" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      <Button variant="cta" className="w-full mt-2 font-semibold">
                        Sign Up
                      </Button>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* View All CTA */}
          <div className="text-center">
            <a href="https://posh.vip/g/5-points-cup" target="_blank" rel="noopener noreferrer">
              <Button variant="cta" size="lg" className="gap-2">
                View All Events <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </BackgroundSection>
  );
};

export default EventbriteSection;
