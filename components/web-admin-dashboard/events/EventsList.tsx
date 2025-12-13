import React from "react";
import { Calendar, Plus, MapPin, Clock, MoreVertical, Eye, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const events = [
  {
    id: 1,
    title: "Community Health Fair",
    date: "Oct 15, 2025",
    time: "09:00 AM - 04:00 PM",
    location: "Community Center, Main Hall",
    status: "Upcoming",
    image: null
  },
  {
    id: 2,
    title: "Youth Employment Workshop",
    date: "Nov 02, 2025",
    time: "10:00 AM - 02:00 PM",
    location: "District Library Conference Room",
    status: "Upcoming",
    image: null
  },
  {
    id: 3,
    title: "Annual Constituency Town Hall",
    date: "Dec 10, 2025",
    time: "05:00 PM - 08:00 PM",
    location: "Town Square",
    status: "Upcoming",
    image: null
  },
  {
    id: 4,
    title: "Back to School Drive",
    date: "Sep 05, 2025",
    time: "08:00 AM - 12:00 PM",
    location: "Methodist Primary School",
    status: "Past",
    image: null
  },
  {
    id: 5,
    title: "Sanitation Day Cleanup",
    date: "Aug 20, 2025",
    time: "06:00 AM - 10:00 AM",
    location: "Market Circle",
    status: "Past",
    image: null
  }
];

export function EventsList() {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[400px]">
        <div className="h-16 w-16 bg-violet-50 rounded-full flex items-center justify-center">
          <Calendar className="h-8 w-8 text-violet-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900">No Events Yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Get started by creating your first event. It will appear here once created.
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
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Event Name</th>
              <th className="px-6 py-4 font-medium">Date & Time</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-violet-50 flex-shrink-0 flex items-center justify-center border border-violet-100 text-violet-600 font-bold">
                      {event.date.split(' ')[1].replace(',', '')}
                    </div>
                    <span className="font-medium text-slate-900 line-clamp-1">
                      {event.title}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-slate-400" /> {event.date}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-slate-400" /> {event.time}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">
                    <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="truncate max-w-[150px]">{event.location}</span>
                    </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    event.status === 'Upcoming' 
                        ? 'bg-violet-50 text-violet-700 border border-violet-100' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {event.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/web-admin-dashboard/events/${event.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-violet-600">
                        <Eye className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Link href={`/web-admin-dashboard/events/${event.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                        <Edit className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <p className="text-sm text-slate-500">Showing 1 to 5 of 5 events</p>
        <div className="flex gap-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-violet-50 text-violet-600 border-violet-200">1</Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-50" disabled>{">"}</Button>
        </div>
      </div>
    </div>
  );
}
