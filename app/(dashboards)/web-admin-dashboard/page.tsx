import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { WebAdminMetrics } from "@/components/web-admin-dashboard/WebAdminMetrics";
import { WebAdminQuickActions } from "@/components/web-admin-dashboard/WebAdminQuickActions";
import { WebAdminRecentPosts } from "@/components/web-admin-dashboard/WebAdminRecentPosts";
import { WebAdminRecentEvents } from "@/components/web-admin-dashboard/WebAdminRecentEvents";
import { WebAdminFooter } from "@/components/web-admin-dashboard/WebAdminFooter";
import React from "react";

export default function WebAdminDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <WebAdminHeader title="Dashboard" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <WebAdminMetrics />
        <WebAdminQuickActions />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <WebAdminRecentPosts />
          <WebAdminRecentEvents />
        </div>
        <WebAdminFooter />
      </div>
    </div>
  );
}
