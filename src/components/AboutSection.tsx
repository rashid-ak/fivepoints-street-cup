import { Trophy, Target, Users, Calendar } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              THE <span className="text-primary">STORY</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8" />
          </div>

          {/* Main Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 animate-fade-up">
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                The 5 Points Cup is a 3v3 futsal tournament built to bring soccer back to its purest form—
                <span className="text-accent font-semibold"> just a ball and people</span>—right in the center of Atlanta.
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                Hosted at historic Underground Atlanta beside the 5 Points MARTA Station, this is the city's 
                <span className="text-primary font-semibold"> neutral ground</span> for a new kind of matchday.
              </p>
              
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground">
                The September 20 kickoff is the first in a series leading toward 
                <span className="text-energy font-semibold"> World Cup 2026</span>.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-gradient-card p-6 rounded-lg text-center shadow-card">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">16</h3>
                <p className="text-muted-foreground">Teams Competing</p>
              </div>
              
              <div className="bg-gradient-card p-6 rounded-lg text-center shadow-card">
                <Target className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">5</h3>
                <p className="text-muted-foreground">Goals to Win</p>
              </div>
              
              <div className="bg-gradient-card p-6 rounded-lg text-center shadow-card">
                <Users className="w-12 h-12 text-energy mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">3v3</h3>
                <p className="text-muted-foreground">Players + 1 Sub</p>
              </div>
              
              <div className="bg-gradient-card p-6 rounded-lg text-center shadow-card">
                <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-foreground mb-2">4</h3>
                <p className="text-muted-foreground">Hours of Action</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-card p-8 rounded-xl shadow-card">
            <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4">
              Soccer only needs a ball and people.
            </h3>
            <p className="text-lg text-muted-foreground mb-6">
              We're bringing the game back to its pure essence for the Atlanta community at a historic location.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center">
                <p className="text-accent font-bold text-lg">Enter your squad.</p>
                <p className="text-accent font-bold text-lg">Claim the crown.</p>
              </div>
              <div className="text-center">
                <p className="text-primary font-bold text-lg">RSVP free—</p>
                <p className="text-primary font-bold text-lg">bring your people.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;