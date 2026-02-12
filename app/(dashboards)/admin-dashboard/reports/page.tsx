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
        title="Reports"
        description="Create, filter, and export system reports"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          {
            label: "Profile Settings",
            href: "/admin-dashboard/profile",
            icon: UserCircle,
          },
          {
            label: "Audit Logs",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "System Settings",
            href: "/admin-dashboard/system-settings",
            icon: Settings2,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-600 focus:text-red-600 focus:bg-red-50",
          },
        ]}
        actionButtons={[
          {
            label: "Analytics",
            href: "/admin-dashboard/analytics",
            icon: BarChart3,
            className: "bg-red-900 text-white hover:bg-red-800 shadow-sm",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <BudgetChart
          chartsData={chartsData}
          loading={chartsLoading}
          error={chartsError}
        />
        
        {/* Report Builder */}
        <ReportBuilder onPreview={handlePreview} />

        {/* Report Preview */}
        <ReportPreview data={reportData} columns={currentColumns} />
      </div>
    </div>
  );
}
