"use client";

import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { AnalyticsMetrics } from "@/components/admin-dashboard/analytics/AnalyticsMetrics";
import { AnalyticsCharts } from "@/components/admin-dashboard/analytics/AnalyticsCharts";
import { AnalyticsInsights } from "@/components/admin-dashboard/analytics/AnalyticsInsights";
import { Download } from "lucide-react";

import { toast } from "sonner";
import * as XLSX from "xlsx";
import {
  dashboardService,
  AdminChartsData,
} from "@/lib/services/dashboard-service";

import { BudgetChart } from "@/components/admin-dashboard/analytics/BudgetChart";

export default function AnalyticsPage() {
  const [isExporting, setIsExporting] = useState(false);
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

  const handleExport = async () => {
    try {
      setIsExporting(true);
      toast.info("Generating comprehensive analytics report...");

      // Fetch all necessary data
      const [metricsRes, chartsRes, insightsRes] = await Promise.all([
        dashboardService.getAnalyticsMetrics(),
        // Use already-fetched data if available, otherwise refetch
        chartsData
          ? Promise.resolve({ success: true, data: chartsData, message: "" })
          : dashboardService.getAdminCharts(),
        dashboardService.getAnalyticsInsights(),
      ]);

      if (!metricsRes.success || !chartsRes.success || !insightsRes.success) {
        throw new Error("Failed to fetch analytics data");
      }

      const metrics = metricsRes.data;
      const charts = chartsRes.data;
      const insights = insightsRes.data;

      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // --- Sheet 1: Overview (Metrics + Monthly Trends) ---
      const overviewData: (string | number)[][] = [
        ["SUMMARY METRICS"],
        ["Metric", "Value", "Trend"],
        [
          "Total Issues",
          metrics.metrics.totalIssues,
          `${metrics.trends.issuesChange}%`,
        ],
        [
          "Active Staff",
          metrics.metrics.activeStaff,
          `${metrics.trends.staffChange}%`,
        ],
        [
          "Total Projects",
          metrics.metrics.totalProjects,
          `${metrics.trends.projectsChange}%`,
        ],
        [
          "Active Budget",
          metrics.metrics.activeBudget,
          `${metrics.trends.budgetChange}%`,
        ],
        [
          "New Issues (Week)",
          metrics.metrics.newIssuesThisWeek,
          `${metrics.trends.newIssuesChange}%`,
        ],
        [
          "Resolved (Week)",
          metrics.metrics.resolvedThisWeek,
          `${metrics.trends.resolvedChange}%`,
        ],
        [
          "Active Users (7d)",
          metrics.metrics.activeUsers7Days,
          `${metrics.trends.activeUsersChange}%`,
        ],
        [
          "Ongoing Projects",
          metrics.metrics.ongoingProjects,
          `${metrics.trends.ongoingProjectsChange}%`,
        ],
        [], // Empty row
        ["MONTHLY TRENDS"],
        ["Month", "Issues Reported", "Issues Resolved"],
      ];

      if (charts.charts.monthlyTrends) {
        charts.charts.monthlyTrends.forEach((item) => {
          overviewData.push([item.name, item.issues, item.resolved]);
        });
      }

      const overviewWs = XLSX.utils.aoa_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(wb, overviewWs, "Overview");

      // --- Sheet 2: Distributions (Status + Categories) ---
      const distributionsData: (string | number)[][] = [
        ["ISSUES BY STATUS"],
        ["Status", "Count"],
      ];

      if (charts.charts.issueStatusDistribution) {
        charts.charts.issueStatusDistribution.forEach((item) => {
          distributionsData.push([item.name, item.value]);
        });
      }

      distributionsData.push(
        [],
        ["ISSUES BY CATEGORY / SEVERITY"],
        ["Category", "Count"],
      );

      if (charts.charts.categoryDistribution) {
        charts.charts.categoryDistribution.forEach((item) => {
          distributionsData.push([item.name, item.value]);
        });
      }

      const distributionsWs = XLSX.utils.aoa_to_sheet(distributionsData);
      XLSX.utils.book_append_sheet(wb, distributionsWs, "Distributions");

      // --- Sheet 3: Budget Analysis ---
      const budgetData: (string | number)[][] = [
        ["BUDGET DISTRIBUTION"],
        ["Category", "Amount (GHS)"],
      ];

      if (charts.charts.budgetDistribution) {
        charts.charts.budgetDistribution.forEach((item) => {
          budgetData.push([item.name, item.value]);
        });
      }

      const budgetWs = XLSX.utils.aoa_to_sheet(budgetData);
      XLSX.utils.book_append_sheet(wb, budgetWs, "Budget Analysis");

      // --- Sheet 4: Insights (Performers + Community) ---
      const insightsData: (string | number)[][] = [
        ["TOP PERFORMERS"],
        [
          "Rank",
          "Name",
          "Role",
          "Resolved Count",
          "Total Assigned",
          "Resolution Rate",
        ],
      ];

      if (insights.insights.topPerformers) {
        insights.insights.topPerformers.forEach((p) => {
          insightsData.push([
            p.rank,
            p.name,
            p.role,
            p.resolvedCount,
            p.totalCount,
            `${p.resolutionRate}%`,
          ]);
        });
      }

      insightsData.push(
        [],
        ["COMMUNITY INSIGHTS"],
        [
          "Location",
          "Issues Reported",
          "Avg Resolution Time",
          "Resolution Rate",
        ],
      );

      if (insights.insights.communityInsights) {
        insights.insights.communityInsights.forEach((c) => {
          insightsData.push([
            c.location,
            c.issuesReported,
            c.avgResolutionTime,
            `${c.resolutionRate}%`,
          ]);
        });
      }

      const insightsWs = XLSX.utils.aoa_to_sheet(insightsData);
      XLSX.utils.book_append_sheet(wb, insightsWs, "Insights");

      // Generate filename with date
      const dateStr = new Date().toISOString().split("T")[0];
      const fileName = `Comprehensive_Analytics_Report_${dateStr}.xlsx`;

      // Download file
      XLSX.writeFile(wb, fileName);

      toast.success("Report downloaded successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to generate report. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="System Analytics"
        description="Comprehensive insights and performance metrics"
        roleAbbr="MP"
        actionButtons={[
          {
            label: isExporting ? "Exporting..." : "Export Report",
            onClick: handleExport,
            icon: Download,
            className:
              "bg-red-900 text-white hover:bg-red-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Metric Cards - 2 Rows */}
        <AnalyticsMetrics />

        {/* Charts Sections */}
        <AnalyticsCharts
          chartsData={chartsData}
          loading={chartsLoading}
          error={chartsError}
        />

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
          <BudgetChart
            chartsData={chartsData}
            loading={chartsLoading}
            error={chartsError}
          />
        </div>
      </div>
    </div>
  );
}
