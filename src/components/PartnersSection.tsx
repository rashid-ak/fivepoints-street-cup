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
                {partner.name === "Underground Atlanta" ? (
                  <a 
                    href="https://www.undergroundatl.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 group-hover:scale-105 transition-transform">
                      <img 
                        src="/lovable-uploads/079a9a2d-bab0-424c-93f5-c3f8509f98e5.png" 
                        alt="Underground Atlanta logo"
                        className="w-full h-full object-contain cursor-pointer"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer">{partner.name}</h3>
                  </a>
                ) : partner.name === "Akanni Marketing" ? (
                  <a 
                    href="https://akanni.marketing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 group-hover:scale-105 transition-transform">
                      <img 
                        src="/lovable-uploads/f35b8cec-db23-45c7-895e-b1bb80a3c519.png" 
                        alt="Akanni Marketing logo"
                        className="w-full h-full object-contain cursor-pointer"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer">{partner.name}</h3>
                  </a>
                ) : partner.name === "Kick It" ? (
                  <a 
                    href="#" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <div className="w-16 h-16 mx-auto mb-4 group-hover:scale-105 transition-transform">
                      <img 
                        src="/lovable-uploads/68a9271b-b444-4242-a444-7419feeb9651.png" 
                        alt="Kick It logo"
                        className="w-full h-full object-contain cursor-pointer"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors cursor-pointer">{partner.name}</h3>
                  </a>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <span className="text-2xl font-black text-primary">
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{partner.name}</h3>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BackgroundSection>
  );
};

export default PartnersSection;