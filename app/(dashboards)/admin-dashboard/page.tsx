"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { AdminMetrics } from "@/components/admin-dashboard/AdminMetrics";
import { AdminCharts } from "@/components/admin-dashboard/AdminCharts";
import { AdminRecentIssues } from "@/components/admin-dashboard/AdminRecentIssues";
import { AdminRecentActivity } from "@/components/admin-dashboard/AdminRecentActivity";
import { Users } from "lucide-react";

function AdminDashboardMainPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader 
        title="System Dashboard" 
        description="Complete overview of the constituency management system"
        roleAbbr="MP"
        actionButtons={[
          { label: "Manage Users", href: "/admin-dashboard/users", icon: Users }
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        
        {/* Metric Cards */}
        <AdminMetrics />

        {/* Charts Section */}
        <AdminCharts />

        {/* Recent Activity & Issues */}
        <div className="flex flex-col lg:flex-row gap-6">
            <AdminRecentIssues />
            <AdminRecentActivity />
        </div>

      </div>
    </div>
  );
}

export default AdminDashboardMainPage;
