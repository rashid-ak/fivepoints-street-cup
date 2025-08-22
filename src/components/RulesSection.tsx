import { CheckCircle } from "lucide-react";

const RulesSection = () => {
  const rules = [
    "16-team single-elimination bracket",
    "3v3 format",
    "Max 6 players per team (3 on court + up to 3 subs)",
    "Match length: 10 minutes max (hard cap)",
    "Fair play, no slide tackles",
    "On-time check-in; matching tops recommended"
  ];

  return (
    <section id="rules" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              TOURNAMENT <span className="text-primary">FORMAT & RULES</span>
            </h2>
            <p className="text-xl text-primary font-bold mb-4">$1,000 prize for the winning team</p>
            <div className="w-24 h-1 bg-gradient-hero mx-auto" />
          </div>

          {/* Compact Rules */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-card p-8 rounded-xl shadow-card">
              <ul className="space-y-4">
                {rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;