"use client";

import React, { useEffect, useState } from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { ArrowLeft, Calendar, MapPin, Clock, Edit, Users, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { eventsService, Event } from "@/lib/services/events-service";
import { format } from "date-fns";
import { use } from "react";

interface ViewEventPageProps {
  params: Promise<{ id: string }>;
}

export default function ViewEventPage({ params }: ViewEventPageProps) {
  const { id } = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const response = await eventsService.getEventById(parseInt(id));
        if (response.success && response.data.event) {
          setEvent(response.data.event);
        } else {
          setError("Event not found");
        }
      } catch (err: unknown) {
        console.error("Failed to fetch event:", err);
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <WebAdminHeader title="View Event" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <WebAdminHeader title="View Event" />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Event Not Found</h2>
          <p className="text-slate-500 mb-4">{error || "The event you're looking for doesn't exist."}</p>
          <Link href="/web-admin-dashboard/events">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <WebAdminHeader title="View Event" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/web-admin-dashboard/events">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Event Details</h1>
              <p className="text-slate-500">View information about this event</p>
            </div>
          </div>
          <Link href={`/web-admin-dashboard/events/${id}/edit`}>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white">
              <Edit className="mr-2 h-4 w-4" />
              Edit Event
            </Button>
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Event Image */}
            <div className="h-64 w-full bg-slate-100 relative">
              {event.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  No Image Available
                </div>
              )}
              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                  event.status === 'upcoming' 
                    ? 'bg-violet-100 text-violet-700' 
                    : event.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {event.status}
                </span>
              </div>
            </div>

            <div className="p-8 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">{event.title}</h2>
                    {event.slug && (
                      <p className="text-slate-400 text-sm mt-1">/{event.slug}</p>
                    )}
                </div>

                {/* Event Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-y border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-50 rounded-lg">
                            <Calendar className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Date</p>
                            <p className="text-slate-900 font-medium">
                              {format(new Date(event.event_date), "MMMM d, yyyy")}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-50 rounded-lg">
                            <Clock className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Time</p>
                            <p className="text-slate-900 font-medium">
                              {event.start_time || "All Day"}
                              {event.end_time && ` - ${event.end_time}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-violet-50 rounded-lg">
                            <MapPin className="h-5 w-5 text-violet-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-semibold">Location</p>
                            <p className="text-slate-900 font-medium">{event.location}</p>
                        </div>
                    </div>
                </div>

                {/* Registration Info (if applicable) */}
                {(event.registration_required || event.max_attendees) && (
                  <div className="flex items-center gap-4 p-4 bg-violet-50 rounded-lg">
                    <Users className="h-5 w-5 text-violet-600" />
                    <div>
                      {event.registration_required && (
                        <span className="text-violet-700 font-medium">Registration Required</span>
                      )}
                      {event.max_attendees && (
                        <span className="text-violet-600 ml-2">
                          • Max {event.max_attendees} attendees
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {event.description && (
                  <div className="prose max-w-none text-slate-600">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">About this Event</h3>
                      <div className="whitespace-pre-wrap">{event.description}</div>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
