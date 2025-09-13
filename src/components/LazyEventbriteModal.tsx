import { lazy, Suspense, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load the Eventbrite form component
const EventbriteForm = lazy(() => 
  import('./EventbriteForm').then(module => ({ default: module.EventbriteForm }))
);

interface LazyEventbriteModalProps {
  type: 'team' | 'rsvp';
  onClose: () => void;
}

export const LazyEventbriteModal = ({ type, onClose }: LazyEventbriteModalProps) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h2 className="text-xl font-bold">
            {type === 'team' ? 'Enter a Team' : 'RSVP (Free)'}
          </h2>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4">
          <Suspense 
            fallback={
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            }
          >
            <EventbriteForm 
              type={type} 
              onLoad={() => setIsLoading(false)}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};