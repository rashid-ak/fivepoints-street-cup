import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "Is the 5 Points Cup all-ages?",
      answer: "Everyone of all ages are welcomed to spectate and enjoy the event! However, the teams will be participating in a men's competition. The event is designed to be family-friendly with activities for spectators of all ages."
    },
    {
      question: "What is the tournament format?",
      answer: "The tournament features one round of games before single elimination, then single elimination starting from the round of 16. Each match is 3v3 futsal with first team to 5 goals winning. There's a 10-minute time cap, with the leader at time winning if no team reaches 5 goals. Ties are resolved by next-goal-wins."
    },
    {
      question: "What should players bring?",
      answer: "Players should bring appropriate futsal/soccer shoes (no cleats on indoor courts), water bottles, and matching team uniforms or tops if possible. Balls will be provided by organizers. Shin guards are recommended but not required."
    },
    {
      question: "Is there parking available?",
      answer: "Yes, Underground Atlanta offers parking options. However, we strongly recommend using MARTA as the venue is directly across from 5 Points MARTA Station, making public transit the most convenient option."
    },
    {
      question: "Is MARTA nearby?",
      answer: "Absolutely! The venue is directly across from 5 Points MARTA Station, one of Atlanta's most connected transit hubs. This makes the location easily accessible from anywhere in the metro area."
    },
    {
      question: "Can teams register the day of the event?",
      answer: "Team registration closes before the event to ensure proper bracket setup and logistics. However, spectator RSVPs are welcome right up until event day. We encourage early team registration to secure your spot."
    },
    {
      question: "What about food and drinks?",
      answer: "Multiple food trucks will be on-site offering diverse dining options. There will also be retail pop-ups and other vendors throughout the venue."
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
            <p className="text-xl text-muted-foreground">
              Everything you need to know about the 5 Points Cup
            </p>
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
                  {faq.answer}
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
              Reach out to us directly for any additional information about the tournament.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Email: <span className="text-primary font-semibold">info@5pointscup.com</span>
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