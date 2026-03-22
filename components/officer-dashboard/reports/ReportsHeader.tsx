"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2 } from "lucide-react";
import { officerReportsService } from "@/lib/services/officer-reports-service";
import { toast } from "sonner"; // Assuming sonner is used for toasts, if not, I'll check and adjust

export function ReportsHeader() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // 1. Fetch all necessary data
      const [summary, trends, distribution, recentActivity] = await Promise.all(
        [
          officerReportsService.getSummary(),
          officerReportsService.getTrends(12),
          officerReportsService.getStatusDistribution(),
          officerReportsService.getRecentActivity(20), // Get more for export
        ],
      );

      // 2. Construct CSV content
      const csvRows = [];

      // Title
      csvRows.push(["Officer Dashboard Report"]);
      csvRows.push([`Generated on: ${new Date().toLocaleString()}`]);
      csvRows.push([]);

      // Summary Section
      if (summary.success) {
        csvRows.push(["Summary Statistics"]);
        csvRows.push(["Metric", "Value"]);
        csvRows.push(["Total Issues", summary.data.total_issues]);
        csvRows.push(["Pending Issues", summary.data.pending_issues]);
        csvRows.push(["Resolved Issues", summary.data.resolved_issues]);
        csvRows.push([
          "Avg Resolution Time (hrs)",
          summary.data.avg_resolution_time,
        ]);
        csvRows.push([]);
      }

      // Trends Section
      if (trends.success) {
        csvRows.push(["Monthly Trends"]);
        csvRows.push(["Month", "Total Issues", "Resolved Issues"]);
        trends.data.trends.forEach((t) => {
          csvRows.push([t.month, t.total, t.resolved]);
        });
        csvRows.push([]);
      }

      // Status Distribution Section
      if (distribution.success) {
        csvRows.push(["Status Distribution"]);
        csvRows.push(["Status", "Count"]);
        distribution.data.distribution.forEach((d) => {
          csvRows.push([d.name, d.value]);
        });
        csvRows.push([]);
      }

      // Recent Activity Section
      if (recentActivity.success) {
        csvRows.push(["Recent Activity"]);
        csvRows.push(["ID", "Title", "Status", "Category", "Date"]);
        recentActivity.data.activities.forEach((a) => {
          csvRows.push([a.id, a.title, a.status, a.category, a.formatted_date]);
        });
        csvRows.push([]);
      }

      // 3. Convert to CSV string
      const csvContent = csvRows
        .map((row) => row.map((item) => `"${item}"`).join(","))
        .join("\n");

      // 4. Download file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `officer_report_${new Date().toISOString().split("T")[0]}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Report exported successfully");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border shadow-sm print:shadow-none print:border-none print:p-0 print:mb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1e1b4b]">
          Reports & Analytics
        </h1>
        <p className="text-muted-foreground print:text-sm">
          Comprehensive system insights and performance metrics
        </p>
      </div>
      <div className="flex items-center gap-3 print:hidden">
        <Button
          className="bg-[#312e81] hover:bg-[#312e81]/90 gap-2"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export Report
        </Button>
        <Button
          variant="outline"
          className="gap-2 bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700"
          onClick={handlePrint}
        >
          <Printer className="h-4 w-4" />
          Print Report
        </Button>
      </div>
    </div>
  );
}
