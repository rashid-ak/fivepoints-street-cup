import { ReactNode } from "react";

interface BackgroundSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundAlt?: string;
  overlayOpacity?: number;
  className?: string;
  id?: string;
}

const BackgroundSection = ({ 
  children, 
  backgroundImage, 
  backgroundAlt = "",
  overlayOpacity = 0.7,
  className = "",
  id
}: BackgroundSectionProps) => {
  if (!backgroundImage) {
    return <div className={className} id={id}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`} id={id}>
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt={backgroundAlt}
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 bg-background"
          style={{ opacity: overlayOpacity }}
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="[&_h1]:text-shadow-lg [&_h2]:text-shadow-lg [&_h3]:text-shadow-lg [&_p]:text-shadow-md [&_.badge]:backdrop-blur-sm [&_.badge]:bg-background/20 [&_.card]:backdrop-blur-sm [&_.card]:bg-background/10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BackgroundSection;