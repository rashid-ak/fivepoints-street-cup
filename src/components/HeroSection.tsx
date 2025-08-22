import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
const HeroSection = () => {
  const handleGetDirections = () => {
    window.open('https://maps.google.com/?q=Underground+Atlanta,+Upper+Alabama+St,+Atlanta,+GA', '_blank');
  };
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img src="/lovable-uploads/0cd4d024-4bce-4fe0-8b10-377c28ded7e1.png" alt="5 Points Cup tournament logo with colorful geometric design" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center animate-fade-up">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <Badge variant="secondary" className="text-sm font-bold">
              FREE ADMISSION
            </Badge>
            <Badge variant="outline" className="text-sm font-bold border-accent text-accent">
              ALL AGES
            </Badge>
            <Badge variant="outline" className="text-sm font-bold border-energy text-energy">
              SEPTEMBER 20
            </Badge>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight">
            <span className="block text-foreground">5 POINTS</span>
            <span className="block bg-gradient-hero bg-clip-text text-transparent">
              CUP
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-muted-foreground max-w-3xl mx-auto">
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
          <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
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
              <span className="font-medium"> Free admission</span>
            </div>
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button variant="hero" size="lg" className="text-xl px-8 py-6 min-w-[200px]">
              RSVP (Free)
            </Button>
            <Button variant="cta" size="lg" className="min-w-[200px]">
              Enter a Team
            </Button>
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
    </section>;
};
export default HeroSection;