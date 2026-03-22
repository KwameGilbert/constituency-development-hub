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
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border-none flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-slate-100/60 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
            Recent Events
          </h2>
          <Link
            href="/web-admin-dashboard/events"
            className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
          >
            View All
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || events.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border-none flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-slate-100/60 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
            Recent Events
          </h2>
          <Link
            href="/web-admin-dashboard/events"
            className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
          >
            View All
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-3">
            <Calendar className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-sm text-slate-500">{error || "No events found"}</p>
          <Link
            href="/web-admin-dashboard/events/new"
            className="text-sm text-amber-600 hover:underline mt-2 font-medium"
          >
            Create your first event
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border-none flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-100/60 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
          Recent Events
        </h2>
        <Link
          href="/web-admin-dashboard/events"
          className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
        >
          View All
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 hover:bg-slate-50/80 transition-colors flex justify-between items-start gap-4 group"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 shrink-0 flex items-center justify-center border border-emerald-100 text-emerald-600 font-bold text-sm shadow-sm group-hover:scale-110 transition-transform">
                {format(new Date(event.event_date), "dd")}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-amber-700 transition-colors">
                  {event.name || event.title}
                </h3>
                <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    {formatEventDate(event.event_date)}
                  </span>
                  {event.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="truncate max-w-[100px]">
                        {event.location}
                      </span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Link
              href={`/web-admin-dashboard/events/${event.id}/edit`}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 whitespace-nowrap bg-amber-50 px-2 py-1 rounded-md"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
