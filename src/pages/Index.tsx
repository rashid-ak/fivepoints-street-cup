import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import EventbriteSection from "@/components/EventbriteSection";
import GallerySection from "@/components/GallerySection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main>
        <HeroSection />
        <AboutSection />
        <EventbriteSection />
        <GallerySection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
