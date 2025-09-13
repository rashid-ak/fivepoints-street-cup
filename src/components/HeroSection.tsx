import { useState, lazy, Suspense } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { CriticalCSS } from "@/components/CriticalCSS";

// Lazy load the modal component
const LazyEventbriteModal = lazy(() => 
  import("@/components/LazyEventbriteModal").then(module => ({ 
    default: module.LazyEventbriteModal 
  }))
);

const HeroSection = () => {
  const [showModal, setShowModal] = useState<'team' | 'rsvp' | null>(null);
  
  const handleGetDirections = () => {
    window.open('https://maps.google.com/?q=Underground+Atlanta,+Upper+Alabama+St,+Atlanta,+GA', '_blank');
  };

  const handleCTAClick = (type: 'team' | 'rsvp') => {
    setShowModal(type);
  };

  return (
    <>
      <CriticalCSS />
      <section className="hero-critical relative">
        {/* Optimized background image with lazy loading */}
        <OptimizedImage
          src="/lovable-uploads/befc3630-9aab-4d1b-826c-65f8a757f443.png"
          alt="Player in action at Underground Atlanta futsal court"
          className="absolute inset-0 object-cover"
          priority={true}
          sizes="100vw"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content */}
        <div className="hero-content relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
            </div>

            {/* Main Headline with optimized image */}
            <div className="flex justify-center mb-8">
              <OptimizedImage
                src="/lovable-uploads/a31225d7-44b0-4fa9-8b72-47ced129a51e.png"
                alt="5 Points Cup Logo"
                className="hero-logo"
                width={224}
                height={224}
                priority={true}
                sizes="(max-width: 768px) 128px, (max-width: 1024px) 192px, 224px"
              />
            </div>

            {/* Subtitle */}
            <p className="hero-subtitle">
              3v3 Futsal at Underground Atlanta
            </p>

            {/* Tagline */}
            <p className="hero-tagline">
              "Fast matches. Big energy. All in the heart of the city."
            </p>

            {/* Prize */}
            <p className="text-lg md:text-xl text-primary font-bold">
              $1,000 prize for the winning team
            </p>

            {/* Key Details */}
            <div className="flex flex-wrap justify-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="font-medium">3v3 futsal • 16 teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                <span className="font-medium">Saturday, Sept 20</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-energy" />
                <span className="font-medium"> Free admission</span>
              </div>
            </div>

            {/* Call to Action Buttons */}
            <div className="pt-8 space-y-4">
              {/* Optimized CTA buttons with lazy modal loading */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button 
                  onClick={() => handleCTAClick('rsvp')}
                  className="cta-button"
                  aria-label="RSVP for free admission"
                >
                  RSVP (Free)
                </button>
                
                <button 
                  onClick={() => handleCTAClick('team')}
                  className="cta-button"
                  aria-label="Enter a team in the tournament"
                >
                  Enter a Team
                </button>
              </div>
              
              {/* Instagram button below */}
              <div className="flex justify-center">
                <a 
                  href="/instagram.html" 
                  target="_top"
                  aria-label="Open 5 Points Cup Instagram"
                  className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#FF6A00] text-white shadow-sm hover:shadow-md transition"
                >
                  {/* White IG glyph using currentColor */}
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zM18 6.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Location Callout */}
            <div className="pt-8 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
                <MapPin className="w-4 h-4 text-energy" />
                <span className="text-sm text-foreground font-medium">
                  Upper Alabama St — across from 5 Points MARTA
                </span>
              </div>
              <div className="mt-4">
                <button onClick={handleGetDirections} className="text-sm text-primary hover:text-accent transition-colors underline">
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Lazy-loaded modal */}
      {showModal && (
        <Suspense fallback={null}>
          <LazyEventbriteModal 
            type={showModal} 
            onClose={() => setShowModal(null)} 
          />
        </Suspense>
      )}
    </>
  );
};

export default HeroSection;