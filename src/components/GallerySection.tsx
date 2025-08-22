import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";
import GallerySlideshow from "./GallerySlideshow";
const GallerySection = () => {
  const backgroundConfig = getSectionBackground('gallery');
  return <BackgroundSection {...backgroundConfig} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-sm font-bold border-primary text-primary bg-background/20 backdrop-blur-sm">
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

        {/* Gallery Slideshow */}
        <GallerySlideshow />

        {/* Street Football Action Image */}
        <div className="text-center mt-16">
          
        </div>
      </div>
    </BackgroundSection>;
};
export default GallerySection;