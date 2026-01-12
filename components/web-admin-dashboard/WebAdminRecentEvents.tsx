"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { eventsService, Event } from "@/lib/services/events-service";
import { Loader2, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export function WebAdminRecentEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsService.getAdminEvents(1, 5);
        if (response.success && response.data?.events) {
          setEvents(response.data.events);
        } else {
          setError(response.message || "Failed to load events");
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatEventDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Events</h2>
          <Link href="/web-admin-dashboard/events" className="text-sm text-green-600 hover:text-green-700 font-medium">
            View All
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Events</h2>
          <Link href="/web-admin-dashboard/events" className="text-sm text-green-600 hover:text-green-700 font-medium">
            View All
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center mb-3">
            <Calendar className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-slate-500">{error || "No events found"}</p>
          <Link href="/web-admin-dashboard/events/new" className="text-sm text-green-600 hover:underline mt-2">
            Create your first event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Recent Events</h2>
        <Link href="/web-admin-dashboard/events" className="text-sm text-green-600 hover:text-green-700 font-medium">
          View All
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {events.map((event) => (
          <div key={event.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-50 flex-shrink-0 flex items-center justify-center border border-green-100 text-green-600 font-bold text-sm">
                {format(new Date(event.event_date), "dd")}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-slate-900 line-clamp-1">
                  {event.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatEventDate(event.event_date)}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate max-w-[100px]">{event.location}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Link
              href={`/web-admin-dashboard/events/${event.id}/edit`}
              className="text-xs font-medium text-green-600 hover:text-green-700 whitespace-nowrap"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

