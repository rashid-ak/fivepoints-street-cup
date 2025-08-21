import { Trophy, Medal, Award, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PrizeSection = () => {
  return (
    <section id="prizes" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              PRIZES & <span className="text-primary">FREESTYLE</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8" />
            <p className="text-xl text-muted-foreground">
              Championship glory awaits at 4:00 PM
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Prize Reveal */}
            <div className="space-y-8">
              <Card className="bg-gradient-card border-primary/20 shadow-glow">
                <CardContent className="p-8 text-center">
                  <Trophy className="w-16 h-16 text-primary mx-auto mb-6 animate-glow-pulse" />
                  <h3 className="text-3xl font-black text-foreground mb-4">
                    PRIZE REVEAL
                  </h3>
                  <div className="text-2xl font-bold text-accent mb-4">
                    4:00 PM - 4:30 PM
                  </div>
                  <p className="text-lg text-muted-foreground mb-6">
                    Champions will be crowned and prizes revealed in a special ceremony following the tournament final.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-3">
                      <Medal className="w-6 h-6 text-energy" />
                      <span className="text-foreground font-semibold">Tournament Champions</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Award className="w-6 h-6 text-accent" />
                      <span className="text-foreground font-semibold">Runner-up Recognition</span>
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Star className="w-6 h-6 text-primary" />
                      <span className="text-foreground font-semibold">Individual Awards</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <p className="text-sm text-muted-foreground italic">
                  "Winner takes all in the heart of the city"
                </p>
              </div>
            </div>

            {/* Freestyle Tournament */}
            <div className="space-y-8">
              <Card className="bg-gradient-card border-accent/20 shadow-card">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">⚽</span>
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-2">
                      FREESTYLE TOURNAMENT
                    </h3>
                    <p className="text-accent font-semibold">Hosted by MIFLAND</p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Showcase your technical skills in the freestyle soccer tournament running alongside the main event. 
                      Individual competitors will demonstrate their ball control, creativity, and style.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-bold text-foreground mb-1">Sign-up</h4>
                        <p className="text-sm text-muted-foreground">At event</p>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-bold text-foreground mb-1">Format</h4>
                        <p className="text-sm text-muted-foreground">Individual skills</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">Categories:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Ball control & juggling</li>
                        <li>• Creative combinations</li>
                        <li>• Style & presentation</li>
                        <li>• Technical difficulty</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  Learn More About Freestyle
                </Button>
              </div>
            </div>
          </div>

          {/* Championship Vision */}
          <div className="mt-16 text-center bg-gradient-card p-8 rounded-xl shadow-card">
            <h3 className="text-2xl font-black text-foreground mb-4">
              THE PATH TO <span className="text-energy">WORLD CUP 2026</span>
            </h3>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              This tournament marks the beginning of a series that will grow through 2025-2026, 
              building toward the ultimate celebration of street soccer culture during World Cup 2026.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="bg-primary/10 px-3 py-1 rounded-full">September 2024: 5 Points Cup Inaugural</span>
              <span className="bg-accent/10 px-3 py-1 rounded-full">2025: Series Expansion</span>
              <span className="bg-energy/10 px-3 py-1 rounded-full">2026: World Cup Culmination</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrizeSection;