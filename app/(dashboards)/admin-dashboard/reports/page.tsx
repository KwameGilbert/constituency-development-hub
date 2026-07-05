"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { ReportBuilder } from "@/components/admin-dashboard/reports/ReportBuilder";
import { ReportPreview } from "@/components/admin-dashboard/reports/ReportPreview";
import {
  BarChart3,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
  FileOutput,
} from "lucide-react";
import {
  ReportData,
  ReportColumn,
  getColumnsForType,
} from "@/lib/services/reports-service";

import { BudgetChart } from "@/components/admin-dashboard/analytics/BudgetChart";
import {
  dashboardService,
  AdminChartsData,
} from "@/lib/services/dashboard-service";

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [currentColumns, setCurrentColumns] = useState<ReportColumn[]>(
    getColumnsForType("issues"),
  );
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

  const handlePreview = (data: ReportData, columns: ReportColumn[]) => {
    setReportData(data);
    setCurrentColumns(columns);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Reports Hub"
        description="Unified interface for strategic data synthesis and multi-cluster reporting"
        roleAbbr="MP"
        dropdownItems={[
          {
            label: "Analytical Insights",
            href: "/admin-dashboard/analytics",
            icon: BarChart3,
          },
          {
             label: "System Settings",
             href: "/admin-dashboard/system-settings",
             icon: Settings2,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-500 font-bold",
          },
        ]}
        actionButtons={[
          {
            label: "Analytics Portal",
            href: "/admin-dashboard/analytics",
            icon: BarChart3,
            className: "bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
         <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
            <div>
              <h2 className="text-xl font-semibold text-slate-800 tracking-tight">
                Strategic Intelligence
              </h2>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                Execute complex queries across issues, projects, and personnel registries
              </p>
            </div>
          </div>

        <BudgetChart
          chartsData={chartsData}
          loading={chartsLoading}
          error={chartsError}
        />

        {/* Report Builder Matrix */}
        <ReportBuilder onPreview={handlePreview} />

        {/* Report Preview Ledger */}
        <ReportPreview data={reportData} columns={currentColumns} />
      </div>
    </div>
  );
}
