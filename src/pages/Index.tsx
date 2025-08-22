import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import RulesSection from "@/components/RulesSection";
import ScheduleSection from "@/components/ScheduleSection";
import GallerySection from "@/components/GallerySection";
import PartnersSection from "@/components/PartnersSection";
import FAQSection from "@/components/FAQSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main>
        <HeroSection />
        <AboutSection />
        <RulesSection />
        <ScheduleSection />
        <GallerySection />
        <PartnersSection />
        <FAQSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
