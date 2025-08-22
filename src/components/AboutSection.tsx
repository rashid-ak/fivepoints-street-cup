import { Badge } from "@/components/ui/badge";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-up">
            <Badge variant="outline" className="mb-6 text-accent border-accent">
              ABOUT
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-8">
              PURE <span className="text-primary">ESSENCE</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8" />
          </div>

          {/* About Content */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xl text-muted-foreground leading-relaxed">
              Soccer needs only a ball and people. The 5 Points Cup brings Atlanta the pure essence of the game at historic Underground Atlanta. This kickoff event leads into a series building toward World Cup 2026.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;