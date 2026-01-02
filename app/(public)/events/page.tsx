"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, DownloadCloud, MapPin, Loader2, Clock, Users } from "lucide-react";
import Image from "next/image";

import EventFilters from "@/components/events/EventFilters";
import EventsHero, { type EventStat } from "@/components/events/EventsHero";
import { Button } from "@/components/ui/button";
import { eventsService, Event } from "@/lib/services/events-service";
import { format } from "date-fns";

const heroStats: EventStat[] = [
  {
    label: "Constituency stops",
    value: "48",
    detail: "Since January 2025",
  },
  {
    label: "Policy forums",
    value: "12",
    detail: "Energy, youth, and health",
  },
  {
    label: "Community partners",
    value: "36",
    detail: "Traditional, civic, and faith groups",
  },
  {
    label: "Volunteer hours",
    value: "2,400+",
    detail: "Logged by local teams",
  },
];

const eventFilters = [
  "All",
  "Community",
  "Parliament",
  "Infrastructure",
  "Education",
];

const timelineUpdates = [
  {
    id: "timeline-1",
    date: "08 Feb 2025",
    title: "Logistics prep",
    detail:
      "Advance team surveyed venues and secured interpreters for mixed-language engagements.",
  },
  {
    id: "timeline-2",
    date: "20 Feb 2025",
    title: "Media briefing",
    detail:
      "Shared progress scorecards with regional press to support transparent reporting.",
  },
  {
    id: "timeline-3",
    date: "05 Mar 2025",
    title: "Volunteer onboarding",
    detail:
      "Trained 75 new constituency volunteers on data collection for field visits.",
  },
];

// Simple event card component for API data
function EventCard({ event, index }: { event: Event; index: number }) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: i * 0.05 },
    }),
  };

  const eventDate = new Date(event.event_date);

  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="rounded-3xl border border-white/70 bg-white/95 p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Image */}
      <figure className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/60 bg-slate-100">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title || "Event"}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority={index < 2}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            <CalendarDays className="h-12 w-12" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/40 via-slate-900/10" />
      </figure>

      {/* Category & Date */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
          {event.status === "upcoming" ? "Upcoming" : event.status || "Event"}
        </span>
        <p className="text-sm font-semibold text-slate-400">
          {format(eventDate, "dd MMM yyyy")}
        </p>
      </div>

      {/* Title & Description */}
      <h3 className="mt-4 text-2xl font-semibold text-slate-900 line-clamp-2">
        {event.title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 line-clamp-3">{event.description}</p>

      {/* Details */}
      <div className="mt-4 grid gap-2 text-sm text-slate-500">
        {event.start_time && (
          <p className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            {event.start_time}{event.end_time ? ` - ${event.end_time}` : ""}
          </p>
        )}
        {event.location && (
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-500" />
            {event.location}
          </p>
        )}
        {event.max_attendees && (
          <p className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-500" />
            Up to {event.max_attendees} attendees
          </p>
        )}
      </div>

      {/* Registration Badge */}
      {event.registration_required && (
        <div className="mt-5 rounded-2xl border border-amber-100 bg-amber-50/60 p-4 text-sm text-amber-700">
          <p className="font-semibold text-amber-800">Registration Required</p>
          <p className="text-amber-700">Sign up in advance to attend this event.</p>
        </div>
      )}
    </motion.article>
  );
}

// Fallback events if API fails
const fallbackEventsData: Event[] = [
  {
    id: 1,
    title: "Youth Skills Acceleration Clinic",
    description: "Hands-on mentorship with artisans and digital mentors focused on employability for senior high school graduates.",
    event_date: "2025-02-12",
    start_time: "09:00",
    location: "Sefwi Wiawso Innovation Hub",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Parliamentary Briefing on Cocoa Roads",
    description: "Presented updates to local media and chiefs on the phased rehabilitation of feeder roads across the cocoa belt.",
    event_date: "2025-02-21",
    start_time: "14:30",
    location: "Sefwi Boako Palace Forecourt",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Constituency Health Outreach",
    description: "Mobile screening with nurses, NHIS officers, and volunteers delivering basic care and insurance renewals.",
    event_date: "2025-03-01",
    start_time: "08:00",
    location: "Asafo Community Park",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Education Stakeholder Roundtable",
    description: "Dialogue with head teachers, PTA leaders, and tertiary alumni on resourcing STEM labs in deprived schools.",
    event_date: "2025-03-09",
    start_time: "16:00",
    location: "Sefwi Wiawso Municipal Assembly Hall",
    status: "upcoming",
  },
];

function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await eventsService.getAllEvents(1, 20);
        if (response.success && response.data.events && response.data.events.length > 0) {
          setEvents(response.data.events);
        } else {
          // Use fallback if no events from API
          setEvents(fallbackEventsData);
          setUsingFallback(true);
        }
      } catch {
        // API error - use fallback data silently
        setEvents(fallbackEventsData);
        setUsingFallback(true);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const heroVariants = useMemo(
    () => ({ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }),
    []
  );

  const filteredEvents = useMemo(() => {
    if (activeFilter === "All") return events;
    // Filter by matching the status or a category field if available
    return events.filter((event) => 
      event.status?.toLowerCase() === activeFilter.toLowerCase() ||
      event.title?.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [activeFilter, events]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-emerald-50 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-20 h-72 w-72 rounded-full bg-emerald-200/40 blur-[120px]" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-sky-200/30 blur-[160px]" />
      </div>

      <main className="relative mx-auto max-w-6xl space-y-12 px-4 py-16 sm:px-6 lg:px-8">
        <EventsHero
          title="Tracking every field visit, forum, and policy stop"
          description="Follow the engagements Hon. Kofi Benteh Afful attends across the constituency and Parliament. Live data synced from the backend API."
          stats={heroStats}
          variants={heroVariants}
        />

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-sm"
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
                Filter feed
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Browse events by focus area
              </h2>
            </div>
            <EventFilters
              filters={eventFilters}
              activeFilter={activeFilter}
              onSelect={setActiveFilter}
            />
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <CalendarDays className="h-4 w-4 text-emerald-500" />
            <span>{filteredEvents.length} records shown</span>
            <span className="text-slate-300">•</span>
            <span>
              {loading ? "Loading events..." : usingFallback ? "Showing sample events" : "Data synced from live API"}
            </span>
          </div>
        </motion.section>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-700">No events found</h3>
            <p className="text-slate-500 mt-2">Try selecting a different filter or check back later.</p>
          </div>
        ) : (
          <section className="grid gap-6 md:grid-cols-2">
            {filteredEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
        >
          <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-emerald-500" />
              <h3 className="text-xl font-semibold">Field timeline</h3>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              We are documenting every logistical note so you can replay how an
              engagement was prepared and followed up.
            </p>
            <div className="mt-6 space-y-6 border-l border-slate-200 pl-6">
              {timelineUpdates.map((update) => (
                <div key={update.id} className="relative">
                  <span className="absolute -left-[34px] top-2 h-3 w-3 rounded-full border-2 border-emerald-500 bg-white" />
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                    {update.date}
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {update.title}
                  </p>
                  <p className="text-sm text-slate-600">{update.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-900/10 bg-slate-900 p-8 text-white shadow-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
              Stay updated
            </p>
            <h3 className="mt-4 text-3xl font-semibold">
              Subscribe for event notifications
            </h3>
            <p className="mt-3 text-base text-white/80">
              Get notified about upcoming events, community gatherings, and policy forums
              happening in the constituency.
            </p>
            <Button
              variant="outline"
              className="mt-8 inline-flex items-center gap-2 rounded-full border-white/40 px-6 py-3 text-white hover:bg-white/10"
            >
              <DownloadCloud className="h-4 w-4" />
              Download event calendar
            </Button>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

export default EventsPage;
