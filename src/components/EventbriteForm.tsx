import { useEffect } from 'react';

interface EventbriteFormProps {
  type: 'team' | 'rsvp';
  onLoad?: () => void;
}

export const EventbriteForm = ({ type, onLoad }: EventbriteFormProps) => {
  const eventbriteUrl = "https://www.eventbrite.com/e/5-points-cup-tickets-1619252671329?aff=oddtdtcreator";

  useEffect(() => {
    // Simulate form loading
    const timer = setTimeout(() => {
      onLoad?.();
    }, 500);
    return () => clearTimeout(timer);
  }, [onLoad]);

  return (
    <div className="w-full h-96">
      <iframe
        src={eventbriteUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        scrolling="auto"
        allowFullScreen
        title={`Eventbrite - ${type === 'team' ? 'Team Registration' : 'RSVP'}`}
        loading="lazy"
        className="rounded-md"
      />
    </div>
  );
};