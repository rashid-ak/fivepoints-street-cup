import { lazy, Suspense } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Skeleton } from '@/components/ui/skeleton';

interface LazySectionProps {
  importFunc: () => Promise<{ default: React.ComponentType<any> }>;
  fallback?: React.ReactNode;
  props?: any;
  threshold?: number;
  rootMargin?: string;
}

export const LazySection = ({ 
  importFunc, 
  fallback, 
  props = {},
  threshold = 0.1,
  rootMargin = '100px'
}: LazySectionProps) => {
  const { elementRef, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  const LazyComponent = lazy(importFunc);

  const defaultFallback = (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <Skeleton className="h-12 w-64 mx-auto mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div ref={elementRef}>
      {hasIntersected ? (
        <Suspense fallback={fallback || defaultFallback}>
          <LazyComponent {...props} />
        </Suspense>
      ) : (
        fallback || defaultFallback
      )}
    </div>
  );
};