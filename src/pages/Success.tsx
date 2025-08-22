import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Users, Calendar, MapPin, Trophy, ArrowLeft } from "lucide-react";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [type] = useState(searchParams.get("type") || "team");

  useEffect(() => {
    // Track analytics events
    if (type === "team") {
      // Analytics: team_payment_succeeded
      console.log("Analytics: team_payment_succeeded");
    } else {
      // Analytics: rsvp_submitted
      console.log("Analytics: rsvp_submitted");
    }
  }, [type]);

  const isTeamSuccess = type === "team";

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')} 
            className="mb-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>

          <Card className="bg-gradient-card shadow-card text-center">
            <CardHeader className="pb-6">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 animate-energy-bounce">
                <CheckCircle className="w-10 h-10 text-accent-foreground" />
              </div>
              <CardTitle className="text-3xl font-black text-accent">
                {isTeamSuccess ? "TEAM REGISTERED!" : "RSVP CONFIRMED!"}
              </CardTitle>
              <p className="text-muted-foreground text-lg">
                {isTeamSuccess 
                  ? "Your team is officially entered in the 5 Points Cup tournament"
                  : "You're all set for the 5 Points Cup experience"
                }
              </p>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {isTeamSuccess ? (
                <>
                  {/* Team Success Content */}
                  <div className="bg-muted p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-primary" />
                      Tournament Details
                    </h3>
                     <div className="grid md:grid-cols-2 gap-4 text-sm">
                       <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-accent" />
                         <span>Saturday, September 20, 12:00 PM – 4:00 PM</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-accent" />
                         <span>Underground Atlanta — Upper Alabama St</span>
                       </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">What's Next?</h3>
                    <ul className="text-left space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        Check your email for detailed tournament information and rules
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        Team check-in begins 30 minutes before tournament start
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        Bring water, cleats, and your competitive spirit!
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        Tournament format: 10-minute games, single elimination from round of 16
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  {/* RSVP Success Content */}
                  <div className="bg-muted p-6 rounded-lg space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Event Details
                    </h3>
                     <div className="grid md:grid-cols-2 gap-4 text-sm">
                       <div className="flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-accent" />
                         <span>Saturday, September 20, 12:00 PM – 4:00 PM</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <MapPin className="w-4 h-4 text-accent" />
                         <span>Underground Atlanta — Upper Alabama St</span>
                       </div>
                     </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">What to Expect</h3>
                    <ul className="text-left space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        Watch exciting tournament matches throughout the day
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        Enjoy food trucks and family-friendly activities
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        Big screen viewing areas for the best action
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        Check your email for event updates and directions
                      </li>
                    </ul>
                  </div>
                </>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => navigate('/')} variant="cta">
                  Back to Home
                </Button>
                {isTeamSuccess && (
                  <Button onClick={() => navigate('/registration')} variant="outline">
                    Register Another Team
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Success;