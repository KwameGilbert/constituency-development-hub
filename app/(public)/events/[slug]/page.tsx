import { Metadata, ResolvingMetadata } from "next";
import { eventsService } from "@/lib/services/events-service";
import EventDetailClient from "./EventDetailClient";
import JsonLd from "@/components/seo/JsonLd";
import { getImageUrl } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;
  const defaultTitle = "Event Details | Kofi Benteh Afful";
  const defaultDesc = "Join Hon. Kofi Benteh Afful for upcoming community events and engagements.";

  try {
    const response = await eventsService.getEventBySlug(slug);
    
    if (response.success && response.data.event) {
      const event = response.data.event;
      const previousImages = (await parent).openGraph?.images || [];
      
      const title = `${event.name || event.title} | Events`;
      const description = event.description || defaultDesc;

      return {
        title: title,
        description: description,
        openGraph: {
          title: title,
          description: description,
          images: event.image ? [getImageUrl(event.image), ...previousImages] : previousImages,
          type: "website", 
        },
        twitter: {
          card: "summary_large_image",
          title: title,
          description: description,
          images: event.image ? [getImageUrl(event.image)] : undefined,
        },
      };
    }
  } catch (error) {
    console.error("Failed to fetch event metadata:", error);
  }

  return {
    title: defaultTitle,
    description: defaultDesc,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const slug = params.slug;
  let initialEvent = null;

  try {
    const response = await eventsService.getEventBySlug(slug);
    if (response.success && response.data.event) {
      initialEvent = response.data.event;
    }
  } catch (error) {
    console.error("Failed to fetch event details for rendering:", error);
  }

  const jsonLd = initialEvent ? {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": initialEvent.name || initialEvent.title,
    "description": initialEvent.description,
    "startDate": initialEvent.event_date && initialEvent.start_time ? `${initialEvent.event_date}T${initialEvent.start_time}` : initialEvent.event_date,
    "endDate": initialEvent.event_date && initialEvent.end_time ? `${initialEvent.event_date}T${initialEvent.end_time}` : undefined,
    "eventStatus": initialEvent.status === 'cancelled' ? "https://schema.org/EventCancelled" : "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": initialEvent.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Sefwi Wiawso",
        "addressCountry": "GH"
      }
    },
    "image": initialEvent.image ? [getImageUrl(initialEvent.image)] : [],
    "organizer": {
      "@type": "Person",
      "name": "Kofi Benteh Afful",
      "url": "https://kofibentehafful.com"
    }
  } : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <EventDetailClient slug={slug} initialEvent={initialEvent} />
    </>
  );
}
