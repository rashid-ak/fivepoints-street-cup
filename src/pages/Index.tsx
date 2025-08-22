import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import RulesSection from "@/components/RulesSection";
import ScheduleSection from "@/components/ScheduleSection";
import PartnersSection from "@/components/PartnersSection";
import PrizeSection from "@/components/PrizeSection";
import FAQSection from "@/components/FAQSection";
import FooterSection from "@/components/FooterSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <RulesSection />
        <ScheduleSection />
        <PartnersSection />
        <PrizeSection />
        <FAQSection />
      </main>
      <FooterSection />
    </div>
  );
};

export default Index;
