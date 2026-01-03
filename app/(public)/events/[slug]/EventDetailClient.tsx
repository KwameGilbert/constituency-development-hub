"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { eventsService, Event } from "@/lib/services/events-service";
import { Loader2, Calendar, MapPin, Clock, ArrowLeft, Share2, Users, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Image from "next/image";

interface EventDetailClientProps {
  initialEvent?: Event | null;
  slug: string;
}

export default function EventDetailClient({ initialEvent, slug }: EventDetailClientProps) {
  const [event, setEvent] = useState<Event | null>(initialEvent || null);
  const [loading, setLoading] = useState(!initialEvent);
  const [error, setError] = useState<string | null>(initialEvent ? null : null);

  useEffect(() => {
    async function fetchEvent() {
      if (initialEvent) return;
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await eventsService.getEventBySlug(slug);
        if (response.success && response.data.event) {
          setEvent(response.data.event);
        } else {
          setError("Event not found");
        }
      } catch {
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [slug, initialEvent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Event Not Found</h1>
          <p className="text-slate-600 mb-8">{error || "The event you're looking for doesn't exist."}</p>
          <Link href="/events">
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.event_date);
  const isPast = event.status === "past" || new Date() > eventDate;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative h-[400px] lg:h-[500px] bg-slate-900">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.title || "Event image"}
            fill
            className="object-cover opacity-80"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
             <Calendar className="h-24 w-24 text-slate-600 opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
      </div>

      {/* Content */}
      <main className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           className="bg-white rounded-2xl shadow-xl -mt-32 relative p-8 lg:p-12 mb-12 grid gap-12 lg:grid-cols-[2fr_1fr]"
        >
          {/* Main Info */}
          <div className="space-y-8">
            <Link 
              href="/events"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all events
            </Link>

            <div>
              <div className="flex flex-wrap gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                  isPast 
                    ? "bg-slate-100 text-slate-500" 
                    : "bg-emerald-50 text-emerald-600"
                }`}>
                  {isPast ? "Past Event" : "Upcoming Event"}
                </span>
                {event.registration_required && (
                   <span className="px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-600">
                     Registration Required
                   </span>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                {event.title}
              </h1>
            </div>

            <div className="prose prose-slate max-w-none text-slate-600">
              <p className="text-lg leading-relaxed">{event.description}</p>
              {/* If there was rich text content, we would render it here. 
                  Currently using description as the main content based on Interface */}
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm text-slate-500">Share this event</p>
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Sidebar / details */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-2xl p-6 space-y-6 border border-slate-100">
              <h3 className="font-semibold text-slate-900">Event Details</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Date</p>
                    <p className="text-slate-600">{format(eventDate, "EEEE, MMMM d, yyyy")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Time</p>
                    <p className="text-slate-600">
                      {event.start_time}
                      {event.end_time ? ` - ${event.end_time}` : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">Location</p>
                    <p className="text-slate-600">{event.location}</p>
                  </div>
                </div>

                {event.max_attendees && (
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-emerald-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Capacity</p>
                      <p className="text-slate-600">{event.max_attendees} People</p>
                    </div>
                  </div>
                )}
              </div>

              {!isPast && event.registration_required && (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 font-semibold" size="lg">
                  Register Now
                </Button>
              )}
              
              {isPast && (
                <Button disabled className="w-full bg-slate-200 text-slate-500 font-semibold" size="lg">
                   Event Concluded
                </Button>
              )}
            </div>
            
            <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-start gap-3">
                   <CheckCircle2 className="h-6 w-6 text-emerald-600 flex-shrink-0" />
                   <div>
                      <p className="font-semibold text-emerald-900 text-sm">Community Focus</p>
                      <p className="text-emerald-800/80 text-xs mt-1">This event aligns with our commitment to transparent and inclusive governance.</p>
                   </div>
                </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
