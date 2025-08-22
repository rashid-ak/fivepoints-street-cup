import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Music, ShoppingBag, Users } from "lucide-react";
import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";

const PartnersSection = () => {
  const backgroundConfig = getSectionBackground('partners');
  
  const partners = [
    {
      name: "Underground Atlanta",
      description: "Historic venue partner providing the perfect central location for Atlanta's street soccer tournament.",
      role: "Venue Partner"
    },
    {
      name: "BnDorsed",
      description: "Supporting local talent and community engagement through sports and entertainment partnerships.",
      role: "Community Partner"
    },
    {
      name: "Akanni Marketing",
      description: "Strategic marketing partner connecting the tournament with Atlanta's diverse soccer community.",
      role: "Marketing Partner"
    },
    {
      name: "Kick It",
      description: "Supporting grassroots soccer development and community building through sport.",
      role: "Development Partner"
    }
  ];

  const activations = [
    {
      icon: ShoppingBag,
      title: "Retail Pop-up",
      description: "Local vendors and soccer gear showcase",
      color: "text-primary"
    },
    {
      icon: Music,
      title: "Live DJs",
      description: "High-energy music throughout the day",
      color: "text-accent"
    },
    {
      icon: MapPin,
      title: "Food Trucks",
      description: "Diverse food options for all attendees",
      color: "text-energy"
    },
    {
      icon: Users,
      title: "Family Zone",
      description: "Activities and seating for all ages",
      color: "text-primary"
    }
  ];

  return (
    <BackgroundSection 
      {...backgroundConfig}
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              <span className="text-primary">PARTNERS</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto" />
          </div>

          {/* Partners Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partners.map((partner, index) => (
              <div key={index} className="text-center p-6 bg-gradient-card rounded-lg group hover:shadow-glow transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <span className="text-2xl font-black text-primary">
                    {partner.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{partner.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BackgroundSection>
  );
};

export default PartnersSection;