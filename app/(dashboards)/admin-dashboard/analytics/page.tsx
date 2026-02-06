"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { AnalyticsMetrics } from "@/components/admin-dashboard/analytics/AnalyticsMetrics";
import { AnalyticsCharts } from "@/components/admin-dashboard/analytics/AnalyticsCharts";
import { AnalyticsInsights } from "@/components/admin-dashboard/analytics/AnalyticsInsights";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

import { BudgetChart } from "@/components/admin-dashboard/analytics/BudgetChart";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="System Analytics"
        description="Comprehensive insights and performance metrics"
        roleAbbr="MP"
        actionButtons={[
          {
            label: "Export Report",
            href: "#",
            icon: Download,
            className: "bg-red-900 text-white hover:bg-red-800 shadow-sm",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Metric Cards - 2 Rows */}
        <AnalyticsMetrics />

        {/* Charts Sections */}
        <AnalyticsCharts />

        {/* Bottom Insights */}
        <AnalyticsInsights />

        {/* Budget Analytics */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Budget Analytics
            </h3>
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Project Finances
            </span>
          </div>
          <BudgetChart />
        </div>
      </div>
    </div>
  );
}
