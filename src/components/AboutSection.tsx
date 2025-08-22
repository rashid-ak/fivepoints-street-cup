import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";

const AboutSection = () => {
  const backgroundConfig = getSectionBackground('about');

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
              ABOUT THE <span className="text-primary">5 POINTS CUP</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8" />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Soccer needs only a ball and people. The 5 Points Cup brings Atlanta the pure essence of the game at historic Underground Atlanta. This kickoff event leads into a series building toward World Cup 2026.
            </p>
          </div>
        </div>
      </div>
    </BackgroundSection>
  );
};

export default AboutSection;