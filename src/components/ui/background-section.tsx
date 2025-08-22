import { ReactNode } from "react";

interface BackgroundSectionProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundAlt?: string;
  overlayOpacity?: number;
  className?: string;
}

const BackgroundSection = ({ 
  children, 
  backgroundImage, 
  backgroundAlt = "",
  overlayOpacity = 0.7,
  className = "" 
}: BackgroundSectionProps) => {
  if (!backgroundImage) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`relative ${className}`}>
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
        {children}
      </div>
    </div>
  );
};

export default BackgroundSection;