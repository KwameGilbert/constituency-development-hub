import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EventsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-transparent data-stuck:border-slate-200/60 sticky top-16 z-10 -mx-4 transition-all">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Manage Events</h1>
        <p className="text-sm text-slate-500">
          Create, edit and manage your events calendar
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search events..."
            className="pl-9 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <Select defaultValue="all">
          <SelectTrigger className="w-[140px] border-slate-200 focus:ring-amber-500">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past Events</SelectItem>
          </SelectContent>
        </Select>

        <Link href="/web-admin-dashboard/events/new">
          <Button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>
    </div>
  );
}
