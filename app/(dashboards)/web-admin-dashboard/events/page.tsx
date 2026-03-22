import React from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { EventsHeader } from "@/components/web-admin-dashboard/events/EventsHeader";
import { EventsList } from "@/components/web-admin-dashboard/events/EventsList";

export default function ManageEventsPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <WebAdminHeader title="Events" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <EventsHeader />
        <EventsList />
      </div>
    </div>
  );
}
