import { Clock, MapPin, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ScheduleSection = () => {
  const scheduleItems = [
    {
      time: "10:00 AM - 12:00 PM",
      title: "Chelsea vs Manchester United",
      subtitle: "Big Screen Watch Party",
      type: "watch-party",
      icon: "⚽"
    },
    {
      time: "12:00 PM - 4:00 PM", 
      title: "5 Points Cup",
      subtitle: "Local 3v3 Tournament",
      type: "tournament",
      icon: "🏆"
    },
    {
      time: "4:00 PM - 4:30 PM",
      title: "Prize Reveal",
      subtitle: "Champions Ceremony",
      type: "ceremony",
      icon: "🎉"
    },
    {
      time: "4:30 PM - 6:30 PM",
      title: "Atlanta United vs San Diego FC",
      subtitle: "Big Screen Watch Party",
      type: "watch-party",
      icon: "⚽"
    }
  ];

  const handleSaveToCalendar = () => {
    // This would generate an ICS file
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//5 Points Cup//Event//EN
BEGIN:VEVENT
UID:5pointscup2024@underground-atlanta.com
DTSTAMP:20240920T100000Z
DTSTART:20240920T100000Z
DTEND:20240920T183000Z
SUMMARY:5 Points Cup - Street Soccer Tournament
DESCRIPTION:3v3 futsal tournament at Underground Atlanta with watch parties, tournament action, and prize ceremonies
LOCATION:Underground Atlanta, Upper Alabama St, Atlanta, GA
URL:https://5pointscup.com
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '5-points-cup-schedule.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleGetDirections = () => {
    window.open('https://maps.google.com/?q=Underground+Atlanta,+Upper+Alabama+St,+Atlanta,+GA', '_blank');
  };

  return (
    <section id="schedule" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              EVENT <span className="text-primary">SCHEDULE</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8" />
            <p className="text-xl text-muted-foreground">
              Saturday, September 20 • Underground Atlanta
            </p>
          </div>

          {/* Schedule Timeline */}
          <div className="space-y-6 mb-12">
            {scheduleItems.map((item, index) => (
              <Card key={index} className={`bg-gradient-card border-border transition-all duration-300 hover:shadow-glow ${
                item.type === 'tournament' ? 'ring-2 ring-primary/30' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="text-4xl">{item.icon}</div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="text-primary font-bold">{item.time}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.subtitle}</p>
                    </div>

                    {item.type === 'tournament' && (
                      <div className="text-right">
                        <div className="text-2xl font-black text-accent">MAIN</div>
                        <div className="text-2xl font-black text-accent">EVENT</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Location & Actions */}
          <div className="bg-gradient-card p-8 rounded-xl shadow-card">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-energy" />
                <h3 className="text-xl font-bold text-foreground">Location</h3>
              </div>
              <p className="text-lg text-muted-foreground mb-2">Underground Atlanta</p>
              <p className="text-muted-foreground">Upper Alabama St, across from 5 Points MARTA Station</p>
              <p className="text-sm text-muted-foreground mt-2">Central. Connected. Neutral ground.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="outline" 
                onClick={handleSaveToCalendar}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Save to Calendar
              </Button>
              <Button 
                variant="outline" 
                onClick={handleGetDirections}
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Get Directions
              </Button>
            </div>
          </div>

          {/* Additional Activities */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-card rounded-lg">
              <h4 className="font-bold text-accent mb-2">Freestyle Tournament</h4>
              <p className="text-sm text-muted-foreground">Hosted by MIFLAND</p>
            </div>
            <div className="text-center p-6 bg-gradient-card rounded-lg">
              <h4 className="font-bold text-energy mb-2">Retail Pop-ups</h4>
              <p className="text-sm text-muted-foreground">Local vendor showcase</p>
            </div>
            <div className="text-center p-6 bg-gradient-card rounded-lg">
              <h4 className="font-bold text-primary mb-2">Food & Music</h4>
              <p className="text-sm text-muted-foreground">Food trucks & live DJs</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;