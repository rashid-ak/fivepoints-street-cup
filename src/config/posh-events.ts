/**
 * Posh Events Configuration
 * 
 * Add new Posh events here. Each entry powers an event card
 * on the homepage that links directly to the Posh event page.
 * 
 * To add a new event:
 * 1. Copy an existing entry
 * 2. Update all fields with the new event's info
 * 3. The card will appear automatically
 */

export interface PoshEvent {
  /** Unique key for React rendering */
  id: string;
  /** Event title as shown on Posh */
  title: string;
  /** Organizer / host name */
  organizer?: string;
  /** Display date string (e.g. "Sun, Mar 29, 2026") */
  date: string;
  /** ISO date for sorting (YYYY-MM-DD) */
  sortDate: string;
  /** Venue or location name */
  location: string;
  /** URL to the event flyer image */
  flyerImage: string;
  /** Full Posh event URL — where the user lands on click */
  poshUrl: string;
  /** Optional time range */
  time?: string;
}

export const poshEvents: PoshEvent[] = [
  {
    id: "5-points-session-mar29",
    title: "5 Points Session",
    organizer: "5 Points Cup",
    date: "Sun, Mar 29, 2026",
    sortDate: "2026-03-29",
    location: "Underground ATL",
    flyerImage:
      "https://posh.vip/cdn-cgi/image/width=1080,quality=75,fit=scale-down,format=auto/https://posh-images-originals-production.s3.amazonaws.com/69c16aa1efbd4da4529a292a",
    poshUrl: "https://posh.vip/e/5-points-session",
    time: "3:00 PM – 6:00 PM",
  },
];
