import React from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { EventForm } from "@/components/web-admin-dashboard/events/EventForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateEventPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <WebAdminHeader title="Create Event" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 sticky top-16 z-10 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 px-4 transition-all border-b border-transparent data-stuck:border-slate-200/60">
          <Link href="/web-admin-dashboard/events">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Create New Event
            </h1>
            <p className="text-slate-500">
              Enter the details for your new event
            </p>
          </div>
        </div>

        <EventForm />
      </div>
    </div>
  );
}
