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
    },
    {
      id: 5,
      image: "/lovable-uploads/ce7f690a-6069-4012-99e8-fb9e0767146e.png",
      title: "Champion Victory",
      description: "Tournament winner celebrating with trophy at Underground Atlanta",
      category: "Victory",
      date: "Sept 2024"
    },
    {
      id: 6,
      image: "/lovable-uploads/39eec840-e742-450a-9412-b42244424982.png",
      title: "Team Champions",
      description: "Winning team celebrating their tournament victory together",
      category: "Victory",
      date: "Sept 2024"
    },
    {
      id: 7,
      image: "/lovable-uploads/a5caa889-5648-491b-b2c9-df05d8675da8.png",
      title: "Intense Competition",
      description: "Players battling for ball control during tournament match",
      category: "Gameplay",
      date: "Sept 2024"
    },
    {
      id: 8,
      image: "/lovable-uploads/89bf2720-e4f6-486b-8a48-b7419036908d.png",
      title: "Tournament Teams",
      description: "Competing teams posing at Underground Atlanta venue",
      category: "Community",
      date: "Sept 2024"
    },
    {
      id: 9,
      image: "/lovable-uploads/6dbab928-0b43-4d9f-85f9-45792d5a07fd.png",
      title: "Court Action",
      description: "Players displaying skills on the futsal court",
      category: "Gameplay",
      date: "Sept 2024"
    },
    {
      id: 10,
      image: "/lovable-uploads/2a8e8d70-221d-40a4-a770-635fe64d4e55.png",
      title: "Ball Control",
      description: "Close-up of precise ball handling and footwork technique",
      category: "Highlights",
      date: "Sept 2024"
    }
  ];

  const itemsPerSlide = 1; // Show one large image at a time
  const totalSlides = galleryItems.length;

  // Removed auto-advance functionality

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentSlideItems = () => {
    return [galleryItems[currentSlide]];
  };

  const currentItem = galleryItems[currentSlide];

  return (
    <div className="relative">
      {/* Single Large Image Display */}
      <div className="overflow-hidden">
        <div className="flex justify-center">
          <Card className="group hover:shadow-glow transition-all duration-300 overflow-hidden bg-background/10 backdrop-blur-sm max-w-4xl w-full">
            <CardContent className="p-0">
              {/* Large Image */}
              <div className="aspect-[16/10] relative overflow-hidden">
                <img 
                  src={currentItem.image} 
                  alt={currentItem.description}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8 bg-background/80 backdrop-blur-sm">
                <h3 className="text-3xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  {currentItem.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {currentItem.description}
                </p>
              </div>
            </CardContent>
          </Card>
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

      {/* Removed auto-play indicator since auto-advance is disabled */}
    </div>
  );
};

export default GallerySlideshow;