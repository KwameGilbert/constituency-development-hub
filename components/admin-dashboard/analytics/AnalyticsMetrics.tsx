"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Users,
  FolderKanban,
  DollarSign,
  Clock,
  CheckCircle,
  UserPlus,
  List,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
} from "lucide-react";
import {
  dashboardService,
  AnalyticsMetricsData,
} from "@/lib/services/dashboard-service";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsMetrics() {
  const [metricsData, setMetricsData] = useState<AnalyticsMetricsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await dashboardService.getAnalyticsMetrics();

        if (response.success && response.data) {
          setMetricsData(response.data);
        } else {
          setError(response.message || "Failed to load metrics data");
        }
      } catch (err) {
        setError("Failed to load metrics data");
        console.error("Error fetching metrics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const TrendIndicator = ({ change }: { change: number }) => {
    const isPositive = change >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50";

    return (
      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[10px] font-bold ${color}`}>
        <Icon className="w-3 h-3" />
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-none shadow-sm h-24">
              <CardContent className="p-5 flex items-center gap-4">
                <Skeleton className="h-11 w-11 rounded-2xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-7 w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
             <Card key={i} className="border-none shadow-sm h-20">
              <CardContent className="p-4">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-6 w-12" />
              </CardContent>
             </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metricsData) {
    return (
      <Card className="p-6 bg-red-50 border-none shadow-sm">
        <div className="text-center text-red-600 font-bold flex items-center justify-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error || "No analytics metrics available"}
        </div>
      </Card>
    );
  }

  const mainMetrics = [
    { label: "Total Issues", value: metricsData.metrics.totalIssues, trend: metricsData.trends.issuesChange, icon: AlertCircle, bg: "from-amber-500/10 to-amber-500/20", color: "text-amber-600" },
    { label: "Active Staff", value: metricsData.metrics.activeStaff, trend: metricsData.trends.staffChange, icon: Users, bg: "from-slate-100 to-slate-200", color: "text-slate-900" },
    { label: "Total Projects", value: metricsData.metrics.totalProjects, trend: metricsData.trends.projectsChange, icon: FolderKanban, bg: "from-slate-100 to-slate-200", color: "text-slate-900" },
    { label: "Active Budget", value: formatCurrency(metricsData.metrics.activeBudget), trend: metricsData.trends.budgetChange, icon: DollarSign, bg: "from-slate-100 to-slate-200", color: "text-slate-900" },
  ];

  const secondaryMetrics = [
    { label: "New This Week", value: metricsData.metrics.newIssuesThisWeek, trend: metricsData.trends.newIssuesChange, icon: Activity, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Resolutions", value: metricsData.metrics.resolvedThisWeek, trend: metricsData.trends.resolvedChange, icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Recent Users", value: metricsData.metrics.activeUsers7Days, trend: metricsData.trends.activeUsersChange, icon: UserPlus, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Ongoing", value: metricsData.metrics.ongoingProjects, trend: metricsData.trends.ongoingProjectsChange, icon: List, color: "text-slate-400", bg: "bg-slate-50" },
  ];

  return (
    <div className="space-y-4">
      {/* Row 1 — Primary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {mainMetrics.map((metric, index) => (
          <Card
            key={index}
            className="border-none shadow-sm shadow-slate-200/50 group hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden bg-white"
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={`shrink-0 p-3 rounded-xl bg-linear-to-br ${metric.bg} ${metric.color} group-hover:scale-105 transition-transform duration-200`}
              >
                <metric.icon className="w-5 h-5 stroke-2" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate mb-1">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                    {metric.value}
                  </span>
                  <TrendIndicator change={metric.trend} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Row 2 — Secondary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {secondaryMetrics.map((metric, index) => (
          <Card
            key={index}
            className="border-none shadow-sm shadow-slate-200/50 group hover:shadow-md transition-all duration-200 rounded-2xl overflow-hidden bg-white/70 backdrop-blur-sm"
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={`shrink-0 p-2.5 rounded-xl ${metric.bg} ${metric.color} group-hover:scale-105 transition-transform duration-200`}
              >
                <metric.icon className="w-4 h-4 stroke-2" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider truncate mb-1">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                    {metric.value}
                  </span>
                  <TrendIndicator change={metric.trend} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
