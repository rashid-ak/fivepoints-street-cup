import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Camera, MapPin, Calendar } from "lucide-react";

const GallerySlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Gallery images using the uploaded photos
  const galleryItems = [
    {
      id: 1,
      image: "/lovable-uploads/7819dfd3-f6af-406e-887f-85ec0cbcce27.png",
      title: "Tournament Atmosphere",
      description: "Players and spectators at futsal court with Atlanta skyline",
      category: "Community",
      date: "Sept 2024"
    },
    {
      id: 2,
      image: "/lovable-uploads/0d09f1f6-3d40-42c5-a715-be70d6d84171.png",
      title: "Street Football Action",
      description: "Players showcasing their skills in downtown ATL",
      category: "Gameplay", 
      date: "Sept 2024"
    },
    {
      id: 3,
      image: "/lovable-uploads/b01a2a2a-fa1c-4b0a-9c78-86c4ed26d0c7.png",
      title: "Skills & Technique",
      description: "Close-up action of soccer cleats and ball control",
      category: "Highlights",
      date: "Sept 2024"
    },
    {
      id: 4,
      image: "/lovable-uploads/ed3a79cb-67b1-490f-87e3-c9a37e0913c0.png",
      title: "Game Action",
      description: "Players in action during futsal game at Underground Atlanta",
      category: "Gameplay",
      date: "Sept 2024"
    }
  ];

  const itemsPerSlide = 3;
  const totalSlides = Math.ceil(galleryItems.length / itemsPerSlide);

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentSlideItems = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return galleryItems.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <div className="relative">
      {/* Slideshow Container */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getCurrentSlideItems().map((item) => (
            <Card key={item.id} className="group hover:shadow-glow transition-all duration-300 overflow-hidden bg-background/10 backdrop-blur-sm">
              <CardContent className="p-0">
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.description}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="text-xs font-bold bg-background/80 backdrop-blur-sm">
                      {item.category}
                    </Badge>
                  </div>

                  {/* Date */}
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-background/80 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {item.description}
                  </p>
                  
                  {/* Location indicator */}
                  <div className="flex items-center gap-2 text-xs text-energy">
                    <MapPin className="w-3 h-3" />
                    <span className="font-medium">Underground Atlanta</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center items-center gap-4 mt-8">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Slide Indicators */}
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-primary' 
                  : 'bg-background/50 hover:bg-background/70'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Auto-play indicator */}
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground bg-background/50 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
          Auto-advancing every 5 seconds
        </p>
      </div>
    </div>
  );
};

export default GallerySlideshow;