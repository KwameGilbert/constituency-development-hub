"use client";

import AgentDashboardHeader from "@/components/agent-dashboard/AgentDashboardHeader";
import { MetricsCards } from "@/components/agent-dashboard/MetricsCards";
import { RecentTasks } from "@/components/agent-dashboard/RecentTasks";
import { IssueBreakdown } from "@/components/officer-dashboard/charts/IssueBreakdown";
import { IssuesByStatus } from "@/components/officer-dashboard/charts/IssuesByStatus";
import { agentService, AgentReport, AgentReportStats } from "@/lib/services/agent-service";
import React, { useEffect, useState, useMemo } from "react";

// Chart data interfaces
interface StatusChartDataItem {
    status: string
    count: number
    fill: string
}

interface BreakdownChartDataItem {
    label: string
    count: number
    fill: string
}

const categoryColors: Record<string, string> = {
    infrastructure: "#ef4444",
    health: "#3b82f6",
    education: "#f97316",
    security: "#8b5cf6",
    environment: "#22c55e",
    social: "#6366f1",
    economic: "#2dd4bf",
    other: "#6b7280",
}

const priorityColors: Record<string, string> = {
    urgent: "#ef4444",
    high: "#f97316",
    medium: "#eab308",
    low: "#22c55e",
}


function AgentMainPage() {
  const [reports, setReports] = useState<AgentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AgentReportStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await agentService.getMyReports();
        if (response.success && response.data?.reports) {
          setReports(response.data.reports);
          const computedStats = agentService.calculateReportStats(response.data.reports);
          setStats(computedStats);
        }
      } catch (error) {
        console.error("Failed to fetch agent data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Compute status chart data
  const statusChartData = useMemo(() => {
    if (!stats) return undefined;
    
    const data: StatusChartDataItem[] = [];
    const { resolved, pending, inProgress } = stats;
    
    // Map simplified stats to chart format
    // Note: pending includes submitted, under review etc.
    if (resolved > 0) data.push({ status: "resolved", count: resolved, fill: "#22c55e" });
    if (pending > 0) data.push({ status: "submitted", count: pending, fill: "#3b82f6" });
    if (inProgress > 0) data.push({ status: "in_progress", count: inProgress, fill: "#f59e0b" });
    
    // Default if empty
    if (data.length === 0) data.push({ status: "submitted", count: 0, fill: "#3b82f6" });
    
    return data;
  }, [stats]);

  // Compute breakdown chart data
  const breakdownChartData = useMemo(() => {
    if (!reports.length) return undefined;

    // Category Data
    const catCounts: Record<string, number> = {};
    reports.forEach(r => {
        const cat = r.category?.toLowerCase() || 'other';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
    });

    const categoryData: BreakdownChartDataItem[] = Object.entries(catCounts).map(([cat, count]) => {
        const label = cat.charAt(0).toUpperCase() + cat.slice(1);
        return {
            label: label.length > 12 ? label.substring(0, 12) + "..." : label,
            count,
            fill: categoryColors[cat] || categoryColors.other
        };
    }).sort((a, b) => b.count - a.count).slice(0, 5);

    if (categoryData.length === 0) categoryData.push({ label: "No Data", count: 0, fill: "#6b7280" });

    // Priority Data
    const priCounts: Record<string, number> = {};
    reports.forEach(r => {
        const pri = r.priority?.toLowerCase() || 'medium';
        priCounts[pri] = (priCounts[pri] || 0) + 1;
    });

    const priorityOrder = ["urgent", "high", "medium", "low"];
    const priorityData: BreakdownChartDataItem[] = Object.entries(priCounts).map(([pri, count]) => ({
        label: pri.charAt(0).toUpperCase() + pri.slice(1),
        count,
        fill: priorityColors[pri] || "#6b7280"
    })).sort((a, b) => {
        return priorityOrder.indexOf(a.label.toLowerCase()) - priorityOrder.indexOf(b.label.toLowerCase());
    });

    if (priorityData.length === 0) priorityData.push({ label: "No Data", count: 0, fill: "#6b7280" });

    return { categoryData, priorityData };
  }, [reports]);

  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      <AgentDashboardHeader />
      <div className="flex-1 space-y-6 p-6 pt-6">
        <MetricsCards stats={stats} loading={loading} />
        <div className="grid gap-6 md:grid-cols-2">
          <IssuesByStatus data={statusChartData} />
          <IssueBreakdown data={breakdownChartData} />
        </div>
        <RecentTasks reports={reports} loading={loading} />
      </div>
      </div>
  );
}

export default AgentMainPage;
