import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, CreditCard, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Registration = () => {
  const navigate = useNavigate();
  const [registrationType, setRegistrationType] = useState<'team' | 'rsvp' | null>(null);
  const [formData, setFormData] = useState({
    teamName: '',
    captainName: '',
    captainEmail: '',
    captainPhone: '',
    player2: '',
    player3: '',
    player4: '',
    skillLevel: '',
    rulesAcknowledged: false,
    mediaRelease: false,
    // RSVP specific
    name: '',
    email: '',
    zipCode: '',
    partySize: '1'
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTeamSubmit = () => {
    // This would integrate with Stripe for payment
    alert('Stripe integration requires Supabase backend setup. Please connect to Supabase first.');
  };

  const handleRSVPSubmit = () => {
    // This would save RSVP to database
    alert('RSVP functionality requires Supabase backend setup. Please connect to Supabase first.');
  };

  if (!registrationType) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-8 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-black mb-6">
                JOIN THE <span className="text-primary">ACTION</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Choose how you want to be part of the 5 Points Cup
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Team Registration */}
              <Card className="bg-gradient-card border-primary/20 hover:shadow-glow transition-all duration-300 cursor-pointer group" 
                    onClick={() => setRegistrationType('team')}>
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-glow-pulse">
                    <Users className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl font-black">ENTER A TEAM</CardTitle>
                  <p className="text-muted-foreground">Compete in the tournament</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-black text-primary mb-2">$75</div>
                      <p className="text-sm text-muted-foreground">Entry fee per team</p>
                    </div>
                    
                    <Separator />
                    
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-accent" />
                        4 players max (3 starters + 1 sub)
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
                        Prize eligibility
                      </li>
                    </ul>
                    
                    <Button className="w-full" variant="cta">
                      Enter your squad. Claim the crown.
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* RSVP */}
              <Card className="bg-gradient-card border-accent/20 hover:shadow-glow transition-all duration-300 cursor-pointer group"
                    onClick={() => setRegistrationType('rsvp')}>
                <CardHeader className="text-center pb-6">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:animate-energy-bounce">
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
                    
                    <Button className="w-full" variant="hero">
                      RSVP free—bring your people.
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => setRegistrationType(null)}
            className="mb-8 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Options
          </Button>

          <Card className="bg-gradient-card shadow-card">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-black flex items-center justify-center gap-3">
                {registrationType === 'team' ? (
                  <>
                    <Users className="w-8 h-8 text-primary" />
                    TEAM REGISTRATION
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-8 h-8 text-accent" />
                    RSVP REGISTRATION
                  </>
                )}
              </CardTitle>
              <p className="text-muted-foreground">
                {registrationType === 'team' 
                  ? 'Enter your team details for the tournament' 
                  : 'Reserve your spot as a spectator'
                }
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {registrationType === 'team' ? (
                <>
                  {/* Team Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Team Information</h3>
                    
                    <div>
                      <Label htmlFor="teamName">Team Name *</Label>
                      <Input 
                        id="teamName" 
                        value={formData.teamName}
                        onChange={(e) => handleInputChange('teamName', e.target.value)}
                        placeholder="Enter your team name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="skillLevel">Team Skill Level *</Label>
                      <Select value={formData.skillLevel} onValueChange={(value) => handleInputChange('skillLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select skill level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  {/* Captain Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Captain Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="captainName">Captain Name *</Label>
                        <Input 
                          id="captainName" 
                          value={formData.captainName}
                          onChange={(e) => handleInputChange('captainName', e.target.value)}
                          placeholder="Captain's full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="captainPhone">Phone Number *</Label>
                        <Input 
                          id="captainPhone" 
                          value={formData.captainPhone}
                          onChange={(e) => handleInputChange('captainPhone', e.target.value)}
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="captainEmail">Email Address *</Label>
                      <Input 
                        id="captainEmail" 
                        type="email"
                        value={formData.captainEmail}
                        onChange={(e) => handleInputChange('captainEmail', e.target.value)}
                        placeholder="captain@email.com"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Team Players */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Team Players</h3>
                    <p className="text-sm text-muted-foreground">3 starters + 1 substitute (4 players max)</p>
                    
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="player2">Player 2 Name</Label>
                        <Input 
                          id="player2" 
                          value={formData.player2}
                          onChange={(e) => handleInputChange('player2', e.target.value)}
                          placeholder="Player 2 full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="player3">Player 3 Name</Label>
                        <Input 
                          id="player3" 
                          value={formData.player3}
                          onChange={(e) => handleInputChange('player3', e.target.value)}
                          placeholder="Player 3 full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="player4">Player 4 Name (Substitute)</Label>
                        <Input 
                          id="player4" 
                          value={formData.player4}
                          onChange={(e) => handleInputChange('player4', e.target.value)}
                          placeholder="Substitute player name"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Acknowledgments */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Acknowledgments</h3>
                    
                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="rules"
                        checked={formData.rulesAcknowledged}
                        onCheckedChange={(checked) => handleInputChange('rulesAcknowledged', checked as boolean)}
                      />
                      <Label htmlFor="rules" className="text-sm leading-relaxed">
                        I acknowledge that I have read and agree to the tournament rules and format. *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox 
                        id="media"
                        checked={formData.mediaRelease}
                        onCheckedChange={(checked) => handleInputChange('mediaRelease', checked as boolean)}
                      />
                      <Label htmlFor="media" className="text-sm leading-relaxed">
                        I consent to photography and video recording for promotional purposes. *
                      </Label>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="bg-muted p-6 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <CreditCard className="w-6 h-6 text-primary" />
                      <h3 className="text-lg font-bold text-foreground">Payment</h3>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-muted-foreground">Team Entry Fee</span>
                      <span className="text-2xl font-bold text-foreground">$75.00</span>
                    </div>
                    <Button 
                      onClick={handleTeamSubmit}
                      className="w-full" 
                      variant="cta"
                      disabled={!formData.rulesAcknowledged || !formData.mediaRelease}
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {/* RSVP Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-foreground">Your Information</h3>
                    
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input 
                        id="name" 
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email" 
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zipCode">Zip Code</Label>
                        <Input 
                          id="zipCode" 
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode', e.target.value)}
                          placeholder="30309"
                        />
                      </div>
                      <div>
                        <Label htmlFor="partySize">Party Size</Label>
                        <Select value={formData.partySize} onValueChange={(value) => handleInputChange('partySize', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 10}, (_, i) => (
                              <SelectItem key={i+1} value={(i+1).toString()}>
                                {i+1} {i === 0 ? 'person' : 'people'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button 
                      onClick={handleRSVPSubmit}
                      className="w-full" 
                      variant="hero"
                    >
                      Complete Free RSVP
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Registration;