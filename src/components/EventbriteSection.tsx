import { Badge } from "@/components/ui/badge";
import { Users, CheckCircle } from "lucide-react";
import BackgroundSection from "@/components/ui/background-section";
import { getSectionBackground } from "@/config/section-backgrounds";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const EventbriteSection = () => {
  const backgroundConfig = getSectionBackground('about');

  const handleEventbriteRedirect = () => {
    window.open('https://www.eventbrite.com/e/5-points-cup-tickets-1619252671329?aff=oddtdtcreator', '_blank');
  };

  return (
    <BackgroundSection 
      {...backgroundConfig}
      className="py-20 bg-background"
      id="registration"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 text-sm font-bold border-primary text-primary bg-background/20 backdrop-blur-sm">
              <Users className="w-4 h-4 mr-2" />
              RSVP & TEAM ENTRY
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                JOIN THE
              </span>
              <span className="block text-foreground">ACTION</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose how you want to be part of the 5 Points Cup. All registration and payments are handled securely through Eventbrite.
            </p>
          </div>

          {/* Registration Options Overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Team Registration */}
            <Card className="bg-gradient-card border-primary/20 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl font-black">ENTER A TEAM</CardTitle>
                <p className="text-muted-foreground">Compete in the tournament</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-primary mb-2">$100</div>
                    <p className="text-sm text-muted-foreground">Entry fee per team</p>
                  </div>
                  
                  <Separator />
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      6 players max (3 starters + 3 subs)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Tournament bracket entry
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Team check-in & logistics
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-accent" />
                      Prize eligibility - $1,000 for winning team
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* RSVP */}
            <Card className="bg-gradient-card border-accent/20 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center pb-6">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent-foreground" />
                </div>
                <CardTitle className="text-2xl font-black">RSVP FREE</CardTitle>
                <p className="text-muted-foreground">Join as a spectator</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-accent mb-2">FREE</div>
                    <p className="text-sm text-muted-foreground">No cost to attend</p>
                  </div>
                  
                  <Separator />
                  
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Watch tournament action
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Big screen watch parties
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Food trucks & entertainment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      Family-friendly activities
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Registration CTA */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-card p-8 rounded-xl shadow-card text-center">
              <h3 className="text-3xl font-black mb-4">Register on Eventbrite</h3>
              <p className="text-xl text-muted-foreground mb-2">
                Saturday, September 20
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Underground Atlanta — Upper Alabama St, across from 5 Points MARTA Station
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="text-xl px-8 py-6 min-w-[200px]"
                  onClick={handleEventbriteRedirect}
                >
                  RSVP (Free)
                </Button>
                <Button 
                  variant="cta" 
                  size="lg" 
                  className="min-w-[200px]"
                  onClick={handleEventbriteRedirect}
                >
                  Enter a Team
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground mt-6">
                All registration, payment, and confirmation handled securely by Eventbrite
              </p>
            </div>
          </div>
        </div>
      </div>
    </BackgroundSection>
  );
};

export default EventbriteSection;