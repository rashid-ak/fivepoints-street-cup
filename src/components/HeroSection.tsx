import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Instagram } from "lucide-react";
import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";
const HeroSection = () => {
  const backgroundConfig = getSectionBackground('hero');
  
  const handleGetDirections = () => {
    window.open('https://maps.google.com/?q=Underground+Atlanta,+Upper+Alabama+St,+Atlanta,+GA', '_blank');
  };
  return <BackgroundSection {...backgroundConfig} className="min-h-screen flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="container mx-auto px-4 text-center animate-fade-up">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            
            
            
          </div>

          {/* Main Headline */}
          <div className="flex justify-center">
            <img src="/lovable-uploads/a31225d7-44b0-4fa9-8b72-47ced129a51e.png" alt="5 Points Cup Logo" className="h-32 md:h-48 lg:h-56 w-auto object-contain" />
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white max-w-3xl mx-auto">
            3v3 Futsal at Underground Atlanta
          </p>

          {/* Tagline */}
          <p className="text-lg md:text-xl font-semibold text-orange-500">
            "Fast matches. Big energy. All in the heart of the city."
          </p>

          {/* Prize */}
          <p className="text-lg md:text-xl text-primary font-bold">
            $1,000 prize for the winning team
          </p>

          {/* Key Details */}
          <div className="flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="font-medium">3v3 futsal • 16 teams</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              <span className="font-medium">Saturday, Sept 20</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-energy" />
              <span className="font-medium"> Free admission</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="pt-8 space-y-4">
            {/* Main CTA buttons */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a 
                href="https://www.eventbrite.com/e/5-points-cup-tickets-1619252671329?aff=oddtdtcreator" 
                target="_blank"
                rel="noopener"
                className="px-5 py-3 rounded-full bg-[#FF6A00] text-white font-medium hover:opacity-90 transition"
              >
                RSVP (Free)
              </a>
              
              <a 
                href="https://www.eventbrite.com/e/5-points-cup-tickets-1619252671329?aff=oddtdtcreator" 
                target="_blank"
                rel="noopener"
                className="px-5 py-3 rounded-full bg-[#FF6A00] text-white font-medium hover:opacity-90 transition"
              >
                Enter a Team
              </a>
            </div>
            
            {/* Instagram button below */}
            <div className="flex justify-center">
              <a 
                href="https://www.instagram.com/5pointscup/" 
                target="_blank" 
                rel="noopener"
                aria-label="Follow 5 Points Cup on Instagram"
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FF6A00] text-white shadow-sm hover:shadow-md transition"
              >
                {/* White IG glyph using currentColor */}
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM18 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Location Callout */}
          <div className="pt-8 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
              <MapPin className="w-4 h-4 text-energy" />
              <span className="text-sm text-foreground font-medium">
                Upper Alabama St — across from 5 Points MARTA
              </span>
            </div>
            <div className="mt-4">
              <button onClick={handleGetDirections} className="text-sm text-primary hover:text-accent transition-colors underline">
                Get Directions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-energy-bounce" />
        </div>
      </div>
    </BackgroundSection>;
};
export default HeroSection;