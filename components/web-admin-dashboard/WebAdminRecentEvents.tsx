import React from "react";
import Link from "next/link";

export function WebAdminRecentEvents() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Recent Events</h2>
        <Link href="/web-admin-dashboard/events" className="text-sm text-green-600 hover:text-green-700 font-medium">
          View All
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center p-12 text-slate-400 text-sm">
        No events found.
      </div>
    </div>
  );
}
