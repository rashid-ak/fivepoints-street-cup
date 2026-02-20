import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";
const AboutSection = () => {
  const backgroundConfig = getSectionBackground('about');
  return <BackgroundSection {...backgroundConfig} className="py-20 bg-background" id="about">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              ABOUT THE <span className="text-primary">5 POINTS CUP</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8" />
            <div className="bg-background/80 backdrop-blur-sm rounded-lg p-8 border border-border/20">
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The 5 Points Cup is a 3v3 football tournament created to bring the pure essence of soccer to the heart of Atlanta in a unique way. Soccer has always been the world's most successful sport, all you need is a ball and people, and this event celebrates that simplicity while highlighting the city's culture, creativity, and community.
              </p>
              <p className="text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed mt-4">
                This tournament will be hosted at Underground Atlanta. There will be a series of tournaments and pickup sessions throughout the duration of 2026, ongoing.
              </p>
            </div>

            {/* Instagram Post Embed */}
            <div className="mt-12 max-w-lg mx-auto">
              
            </div>
          </div>
        </div>
      </div>
    </BackgroundSection>;
};
export default AboutSection;