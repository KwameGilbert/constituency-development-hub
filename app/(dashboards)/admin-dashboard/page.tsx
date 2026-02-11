"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { AdminMetrics } from "@/components/admin-dashboard/AdminMetrics";
import { AdminCharts } from "@/components/admin-dashboard/AdminCharts";
import { AdminRecentIssues } from "@/components/admin-dashboard/AdminRecentIssues";
import { AdminRecentActivity } from "@/components/admin-dashboard/AdminRecentActivity";
import { BudgetChart } from "@/components/admin-dashboard/analytics/BudgetChart";
import {
  dashboardService,
  AdminChartsData,
} from "@/lib/services/dashboard-service";
import { Users } from "lucide-react";

function AdminDashboardMainPage() {
  const [chartsData, setChartsData] = useState<AdminChartsData | null>(null);
  const [chartsLoading, setChartsLoading] = useState(true);
  const [chartsError, setChartsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharts = async () => {
      try {
        const response = await dashboardService.getAdminCharts();
        if (response.success && response.data) {
          setChartsData(response.data);
        } else {
          setChartsError(response.message || "Failed to load chart data");
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setChartsError("Failed to load chart data");
      } finally {
        setChartsLoading(false);
      }
    };

    fetchCharts();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="System Dashboard"
        description="Complete overview of the constituency management system"
        roleAbbr="MP"
        actionButtons={[
          {
            label: "Manage Users",
            href: "/admin-dashboard/users",
            icon: Users,
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Metric Cards */}
        <AdminMetrics />

        {/* Charts Section */}
        <AdminCharts
          chartsData={chartsData}
          loading={chartsLoading}
          error={chartsError}
        />
        <BudgetChart
          chartsData={chartsData}
          loading={chartsLoading}
          error={chartsError}
        />

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
