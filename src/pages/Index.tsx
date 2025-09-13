import { lazy, Suspense } from "react";
import NavigationBar from "@/components/NavigationBar";
import HeroSection from "@/components/HeroSection";
import { LazySection } from "@/components/LazySection";
import { Skeleton } from "@/components/ui/skeleton";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";

// Lazy load non-critical sections
const AboutSection = lazy(() => import("@/components/AboutSection"));
const RulesSection = lazy(() => import("@/components/RulesSection"));
const ScheduleSection = lazy(() => import("@/components/ScheduleSection"));
const EventbriteSection = lazy(() => import("@/components/EventbriteSection"));
const GallerySection = lazy(() => import("@/components/GallerySection"));
const PartnersSection = lazy(() => import("@/components/PartnersSection"));
const FAQSection = lazy(() => import("@/components/FAQSection"));
const FooterSection = lazy(() => import("@/components/FooterSection"));

const SectionSkeleton = () => (
  <div className="py-20">
    <div className="container mx-auto px-4">
      <Skeleton className="h-12 w-64 mx-auto mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  </div>
);

const Index = () => {
  // Monitor performance metrics
  usePerformanceMonitor();
  
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <main>
        {/* Critical above-the-fold content */}
        <HeroSection />
        
        {/* Lazy load below-the-fold sections */}
        <LazySection
          importFunc={() => import("@/components/AboutSection")}
          fallback={<SectionSkeleton />}
          rootMargin="200px"
        />
        
        <LazySection
          importFunc={() => import("@/components/RulesSection")}
          fallback={<SectionSkeleton />}
          rootMargin="200px"
        />
        
        <LazySection
          importFunc={() => import("@/components/ScheduleSection")}
          fallback={<SectionSkeleton />}
          rootMargin="200px"
        />
        
        {/* EventbriteSection with higher priority for CTA */}
        <LazySection
          importFunc={() => import("@/components/EventbriteSection")}
          fallback={<SectionSkeleton />}
          rootMargin="100px"
        />
        
        <LazySection
          importFunc={() => import("@/components/GallerySection")}
          fallback={<SectionSkeleton />}
          rootMargin="200px"
        />
        
        <LazySection
          importFunc={() => import("@/components/PartnersSection")}
          fallback={<SectionSkeleton />}
          rootMargin="200px"
        />
        
        <LazySection
          importFunc={() => import("@/components/FAQSection")}
          fallback={<SectionSkeleton />}
          rootMargin="200px"
        />
      </main>
      
      <LazySection
        importFunc={() => import("@/components/FooterSection")}
        fallback={<SectionSkeleton />}
        rootMargin="100px"
      />
    </div>
  );
};

export default Index;
