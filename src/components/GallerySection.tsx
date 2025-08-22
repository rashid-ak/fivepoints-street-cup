import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Calendar } from "lucide-react";
import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";

const GallerySection = () => {
  const backgroundConfig = getSectionBackground('gallery');
  
  // Placeholder gallery items - in a real app these would come from a database
  const galleryItems = [
    {
      id: 1,
      title: "Tournament Setup",
      description: "Getting the courts ready at Underground Atlanta",
      category: "Behind the Scenes",
      date: "Sept 2024"
    },
    {
      id: 2,
      title: "Street Football Action",
      description: "Players showcasing their skills in downtown ATL",
      category: "Gameplay", 
      date: "Sept 2024"
    },
    {
      id: 3,
      title: "Community Vibes",
      description: "Fans and families enjoying the tournament atmosphere",
      category: "Community",
      date: "Sept 2024"
    },
    {
      id: 4,
      title: "Victory Moments",
      description: "Teams celebrating their wins",
      category: "Highlights",
      date: "Sept 2024"
    },
    {
      id: 5,
      title: "5 Points MARTA",
      description: "The central location connecting all of Atlanta",
      category: "Location",
      date: "Sept 2024"
    },
    {
      id: 6,
      title: "Urban Football",
      description: "Street football in the heart of the city",
      category: "Gameplay",
      date: "Sept 2024"
    }
  ];

  return (
    <BackgroundSection 
      {...backgroundConfig}
      className="py-24 bg-background"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-sm font-bold border-primary text-primary">
            <Camera className="w-4 h-4 mr-2" />
            GALLERY
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
            <span className="bg-gradient-hero bg-clip-text text-transparent">
              TOURNAMENT
            </span>
            <span className="block text-foreground">MOMENTS</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Capturing the energy, community, and raw talent of street football in downtown Atlanta.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-glow transition-all duration-300 overflow-hidden">
              <CardContent className="p-0">
                {/* Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="text-xs font-bold">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Date */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                  
                  {/* Location indicator */}
                  <div className="flex items-center gap-2 mt-4 text-xs text-energy">
                    <MapPin className="w-3 h-3" />
                    <span className="font-medium">Underground Atlanta</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Want to share your tournament photos?
          </p>
          <Badge variant="outline" className="text-sm font-bold border-accent text-accent cursor-pointer hover:bg-accent/10 transition-colors">
            #5PointsCup
          </Badge>
        </div>
      </div>
    </BackgroundSection>
  );
};

export default GallerySection;