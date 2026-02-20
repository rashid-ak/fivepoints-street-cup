import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "What is Five Points Cup?",
      answer: "Five Points Cup is a fast-paced small-sided football experience built for players who thrive on competition, culture, and community. We host organized matches, tournaments, and pop-up games that bring street football energy into professionally run environments."
    },
    {
      question: "Is Five Points Cup a one-off event?",
      answer: "No — Five Points Cup is an ongoing series. Alongside our headline tournaments, we regularly host pop-up matches, qualifiers, and special activations throughout the year in multiple locations. The goal is to create a consistent competitive ecosystem, not just a single event."
    },
    {
      question: "What is the playing format?",
      answer: "Most Five Points Cup matches are played in a fast, small-sided format (typically 3v3 or similar variations depending on the event). Games are designed to be high-intensity, quick-turnaround, and spectator-friendly, with rules that reward skill, creativity, and tempo."
    },
    {
      question: "How do I register for a game or tournament?",
      answer: "Registration is completed online through our official sign-up page. Team captains (or individual players, when applicable) submit their details, complete payment if required, and receive confirmation by email. Spots are limited and filled on a first-come basis."
    },
    {
      question: "Can individuals sign up, or do I need a full team?",
      answer: "Both options may be available depending on the event. Some activations are team-based, while select pop-ups allow individual player registration and team placement. Check the specific event page for format and eligibility details."
    },
    {
      question: "What can players expect on match day?",
      answer: "Players can expect a professionally organized street football environment — quality playing surfaces, clear scheduling, competitive matchups, and a strong cultural atmosphere. Five Points Cup events are built to feel fast, premium, and community-driven from arrival to final whistle."
    },
    {
      question: "What type of playing surface will be used?",
      answer: "Playing surfaces may vary by location and activation (e.g., turf, futsal court, or specialty street surface). The exact surface for each match or tournament will always be specified on the official sign-up page so teams know what to expect ahead of time."
    },
    {
      question: "What are the core game rules and match structure?",
      answer: null,
      richAnswer: true
    }
  ];

  return (
    <section id="faq" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 animate-fade-up">
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-hero mx-auto mb-8" />
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-gradient-card border border-border rounded-lg px-6"
              >
                <AccordionTrigger className="text-left font-bold text-foreground hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-4">
                  {faq.richAnswer ? (
                    <div className="space-y-4">
                      <p>
                        Five Points Cup matches are built for speed and intensity. Standard match time is 10 minutes, unless otherwise specified, with 5 goals as the target score — if a team reaches 5 goals, the game ends immediately.
                      </p>
                      <p className="font-semibold text-foreground">Additional rules include:</p>
                      <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>Small penalty box in play</li>
                        <li>Penalty kicks awarded if the ball is illegally touched inside the box (taken from the opposite penalty mark)</li>
                        <li>Substitutions must occur during official game stoppages</li>
                        <li>Yellow card = 1-minute sin bin, forcing the team to play down a player during that period</li>
                      </ul>
                      <p className="text-sm italic text-muted-foreground">
                        Final rule variations, if any, will always be communicated on the event's official registration page.
                      </p>
                    </div>
                  ) : (
                    faq.answer
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact for More Questions */}
          <div className="mt-12 text-center bg-gradient-card p-8 rounded-xl shadow-card">
            <h3 className="text-xl font-bold text-foreground mb-4">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Reach out to us directly for any additional information.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Email: <span className="text-primary font-semibold">rashid@akanni.marketing</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Follow us for updates on social media
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
