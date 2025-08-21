import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Music, ShoppingBag, Users } from "lucide-react";

const PartnersSection = () => {
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
      name: "MIFLAND",
      description: "Hosting the freestyle soccer tournament and bringing technical skills showcase to the event.",
      role: "Freestyle Host"
    },
    {
      name: "Akanni Marketing",
      description: "Strategic marketing partner connecting the tournament with Atlanta's diverse soccer community.",
      role: "Marketing Partner"
    },
    {
      name: "KickIt",
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
    <section id="partners" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              PARTNERS & <span className="text-primary">ACTIVATIONS</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8" />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Bringing together Atlanta's best to create an unforgettable street soccer experience.
            </p>
          </div>

          {/* Partners Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {partners.map((partner, index) => (
              <Card key={index} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <span className="text-2xl font-black text-primary">
                        {partner.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{partner.name}</h3>
                    <div className="text-sm text-accent font-semibold mb-3">{partner.role}</div>
                  </div>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">
                    {partner.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Activations */}
          <div className="bg-gradient-card p-8 rounded-xl shadow-card">
            <h3 className="text-2xl font-black text-center mb-8">
              ON-SITE <span className="text-accent">ACTIVATIONS</span>
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {activations.map((activation, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <activation.icon className={`w-8 h-8 ${activation.color}`} />
                  </div>
                  <h4 className="font-bold text-foreground mb-2">{activation.title}</h4>
                  <p className="text-sm text-muted-foreground">{activation.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Reach */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-foreground mb-6">Community Reach</h3>
            <div className="flex flex-wrap justify-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full" />
                <span>Atlanta United Supporter Groups</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span>Underground Atlanta Network</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-energy rounded-full" />
                <span>Local Soccer Communities</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;