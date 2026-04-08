"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { taskForceService, DashboardStats } from "@/lib/services/task-force-service";
import { Skeleton } from "@/components/ui/skeleton";

const defaultStats: DashboardStats = {
  overview: {
    pending_assessment: 0,
    assessment_in_progress: 0,
    assessment_submitted: 0,
    resolution_in_progress: 0,
    resolved: 0,
  },
  my_assignments: {
    pending: 0,
    in_progress: 0,
    completed: 0,
  },
  team: {
    total_members: 0,
    active_members: 0,
  },
  priority: {
    urgent: 0,
    high: 0,
  },
};

export interface TaskForceMetricsCardsProps {
  stats?: DashboardStats | null;
  loading?: boolean;
}

export function TaskForceMetricsCards({
  stats: providedStats,
  loading: providedLoading,
}: TaskForceMetricsCardsProps) {
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (providedStats !== undefined) {
      setStats(providedStats || defaultStats);
      setLoading(providedLoading || false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await taskForceService.getDashboardStats();

        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError("Failed to fetch statistics");
        }
      } catch (err) {
        setError("Failed to load statistics");
        console.error("Error fetching task force dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [providedStats, providedLoading]);

  const totalIssues =
    (stats?.overview?.pending_assessment || 0) +
    (stats?.overview?.assessment_in_progress || 0) +
    (stats?.overview?.assessment_submitted || 0) +
    (stats?.overview?.resolution_in_progress || 0) +
    (stats?.overview?.resolved || 0);

  const resolutionRate = totalIssues > 0 ? Math.round(((stats?.overview?.resolved || 0) / totalIssues) * 100) : 0;

  const metrics = [
    {
      label: "Total Issues",
      value: totalIssues,
      icon: FileText,
      color: "text-slate-900",
      bg: "from-slate-100 to-slate-200",
    },
    {
      label: "Pending",
      value: stats?.overview?.pending_assessment || 0,
      icon: Clock,
      color: "text-amber-900",
      bg: "from-amber-100 to-amber-200",
    },
    {
      label: "Under Assessment",
      value: stats?.overview?.assessment_in_progress || 0,
      icon: AlertCircle,
      color: "text-indigo-900",
      bg: "from-indigo-100 to-indigo-200",
    },
    {
      label: "Resolved",
      value: stats?.overview?.resolved || 0,
      icon: CheckCircle,
      color: "text-emerald-900",
      bg: "from-emerald-100 to-emerald-200",
    },
    {
      label: "Resolution Rate",
      value: `${resolutionRate}%`,
      icon: TrendingUp,
      color: "text-blue-900",
      bg: "from-blue-100 to-blue-200",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="px-4 py-4 flex items-center gap-4">
              <Skeleton className="h-11 w-11 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-8" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-red-50 p-4 text-red-600 text-sm flex items-center gap-2">
        <XCircle className="h-4 w-4" />
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      {metrics.map((metric) => (
        <Card
          key={metric.label}
          className="border-none shadow-md shadow-slate-200/50 overflow-hidden group hover:shadow-lg transition-all duration-300"
        >
          <CardContent className="px-5 py-6 flex items-center gap-4 relative">
            <div
              className={`p-3 rounded-2xl bg-linear-to-br ${metric.bg} ${metric.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}
            >
              <metric.icon className="h-6 w-6 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-slate-900 leading-tight">
                {loading ? <Skeleton className="h-8 w-16" /> : metric.value}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">{metric.label}</p>
            </div>
            <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
