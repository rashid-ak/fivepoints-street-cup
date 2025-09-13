// Critical above-the-fold CSS for immediate rendering
export const CriticalCSS = () => (
  <style dangerouslySetInnerHTML={{
    __html: `
      /* Critical path CSS - only above-the-fold styles */
      .hero-critical {
        min-height: 100vh;
        background: linear-gradient(135deg, hsl(220 100% 50%) 0%, hsl(48 100% 50%) 50%, hsl(25 100% 55%) 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      .hero-content {
        max-width: 1024px;
        margin: 0 auto;
        padding: 1rem;
        text-align: center;
        color: white;
      }
      
      .hero-logo {
        height: 8rem;
        width: auto;
        object-fit: contain;
        margin: 0 auto 2rem;
      }
      
      .hero-subtitle {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 1rem;
      }
      
      .hero-tagline {
        font-size: 1.125rem;
        font-weight: 600;
        color: hsl(25 100% 55%);
        margin-bottom: 1rem;
      }
      
      .cta-button {
        display: inline-block;
        padding: 0.75rem 1.25rem;
        margin: 0.5rem;
        background: hsl(25 100% 55%);
        color: white;
        text-decoration: none;
        border-radius: 9999px;
        font-weight: 500;
        transition: opacity 0.2s;
      }
      
      .cta-button:hover {
        opacity: 0.9;
      }
      
      @media (min-width: 768px) {
        .hero-logo { height: 12rem; }
        .hero-subtitle { font-size: 2rem; }
        .hero-tagline { font-size: 1.25rem; }
      }
      
      @media (min-width: 1024px) {
        .hero-logo { height: 14rem; }
        .hero-subtitle { font-size: 3rem; }
        .hero-tagline { font-size: 1.5rem; }
      }
    `
  }} />
);