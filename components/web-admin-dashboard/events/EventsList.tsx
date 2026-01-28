"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Calendar,
  Plus,
  MapPin,
  Clock,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Search,
  X,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { eventsService, Event } from "@/lib/services/events-service";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface EventsListProps {
  initialEvents?: Event[];
}

export function EventsList({ initialEvents }: EventsListProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents || []);
  const [loading, setLoading] = useState(!initialEvents);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!initialEvents) {
      fetchEvents();
    }
  }, [initialEvents]);

  // Filter events based on search query
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;

    const query = searchQuery.toLowerCase();
    return events.filter(
      (event) =>
        event.name?.toLowerCase().includes(query) ||
        event.title?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.status?.toLowerCase().includes(query),
    );
  }, [events, searchQuery]);

  async function fetchEvents() {
    try {
      setLoading(true);
      const response = await eventsService.getAdminEvents();
      if (response.success && response.data.events) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      const response = await eventsService.deleteEvent(id);
      if (response.success) {
        setEvents(events.filter((e) => e.id !== id));
        toast.success("Event deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete event:", error);
      toast.error("Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  }

  function getEventStatus(event: Event): "upcoming" | "past" {
    const eventDate = new Date(event.event_date);
    const now = new Date();
    return eventDate >= now ? "upcoming" : "past";
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
        <div className="h-16 w-16 bg-violet-50 rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-violet-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">
            No Events Yet
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Get started by creating your first event. It will appear here once
            created.
          </p>
        </div>
        <Link href="/web-admin-dashboard/events/new">
          <Button className="bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search events by title, location, or description..."
            className="pl-10 pr-10 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-slate-500 mt-2">
            Found {filteredEvents.length}{" "}
            {filteredEvents.length === 1 ? "event" : "events"} matching &quot;
            {searchQuery}&quot;
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Event Name</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Location</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    {searchQuery
                      ? `No events matching "${searchQuery}"`
                      : "No events found"}
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => {
                  const status = event.status || getEventStatus(event);
                  return (
                    <tr
                      key={event.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="h-12 w-16 bg-slate-100 rounded-md overflow-hidden border border-slate-200 flex-shrink-0 flex items-center justify-center">
                          {event.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={getImageUrl(event.image)}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="h-5 w-5 text-slate-300" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-violet-50 flex-shrink-0 flex items-center justify-center border border-violet-100 text-violet-600 font-bold text-sm">
                            {format(new Date(event.event_date), "dd")}
                          </div>
                          <span className="font-medium text-slate-900 line-clamp-1">
                            {event.name || event.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col text-xs">
                          <span className="font-medium text-slate-700 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {format(new Date(event.event_date), "MMM d, yyyy")}
                          </span>
                          {event.start_time && (
                            <span className="text-slate-500 flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {event.start_time}
                              {event.end_time ? ` - ${event.end_time}` : ""}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">
                            {event.location}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                            status === "upcoming"
                              ? "bg-violet-50 text-violet-700 border border-violet-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/web-admin-dashboard/events/${event.id}`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-violet-600"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/web-admin-dashboard/events/${event.id}/edit`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-blue-600"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-red-600"
                                disabled={deletingId === event.id}
                              >
                                {deletingId === event.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Event
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete &quot;
                                  {event.name || event.title}&quot;? This action
                                  cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(event.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
