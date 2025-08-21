import { CheckCircle, Clock, Users, Shield, Trophy, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const RulesSection = () => {
  const rules = [
    {
      icon: Users,
      title: "16 Teams",
      description: "Single-elimination bracket"
    },
    {
      icon: Target,
      title: "3v3 + 1 Sub",
      description: "4 players max per team"
    },
    {
      icon: Trophy,
      title: "First to 5 Wins",
      description: "Pure futsal scoring"
    },
    {
      icon: Clock,
      title: "15-Min Cap",
      description: "Leader at cap wins"
    },
    {
      icon: CheckCircle,
      title: "Next Goal Wins",
      description: "Tie resolution"
    },
    {
      icon: Shield,
      title: "No Slide Tackles",
      description: "Respect & fair play"
    }
  ];

  return (
    <section id="rules" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              TOURNAMENT <span className="text-primary">FORMAT</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8" />
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Fast-paced 3v3 futsal action with simple rules designed for maximum excitement and fair play.
            </p>
          </div>

          {/* Rules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {rules.map((rule, index) => (
              <Card key={index} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <rule.icon className="w-12 h-12 text-primary mx-auto mb-4 group-hover:text-accent transition-colors" />
                  <h3 className="text-xl font-bold text-foreground mb-2">{rule.title}</h3>
                  <p className="text-muted-foreground">{rule.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tournament Structure */}
          <div className="bg-gradient-card p-8 rounded-xl shadow-card mb-12">
            <h3 className="text-2xl font-black text-center mb-8">
              TOURNAMENT <span className="text-accent">TIMELINE</span>
            </h3>
            
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-black text-primary-foreground">R16</span>
                </div>
                <h4 className="font-bold text-foreground mb-2">Round of 16</h4>
                <p className="text-sm text-muted-foreground">12:00 - 1:00 PM</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-black text-accent-foreground">QF</span>
                </div>
                <h4 className="font-bold text-foreground mb-2">Quarter Finals</h4>
                <p className="text-sm text-muted-foreground">1:30 - 2:30 PM</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-energy rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-black text-energy-foreground">SF</span>
                </div>
                <h4 className="font-bold text-foreground mb-2">Semi Finals</h4>
                <p className="text-sm text-muted-foreground">3:00 - 3:30 PM</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-background" />
                </div>
                <h4 className="font-bold text-foreground mb-2">Final</h4>
                <p className="text-sm text-muted-foreground">3:45 - 4:00 PM</p>
              </div>
            </div>
          </div>

          {/* Additional Rules */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground mb-4">Field & Equipment</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Futsal court dimensions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Balls provided by organizers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Uniforms or matching tops recommended</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground mb-4">Check-in & Fair Play</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">On-time check-in required</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Respect for all players and officials</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Spirit of the game emphasized</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;