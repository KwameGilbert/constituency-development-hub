import { Metadata } from 'next';
import EventsClient from './EventsClient';

export const metadata: Metadata = {
  title: 'Events & Engagements',
  description: 'Upcoming events, policy forums, and community engagements by Hon. Kofi Benteh Afful in Sefwi Wiawso.',
};

export default function EventsPage() {
  return <EventsClient />;
}
