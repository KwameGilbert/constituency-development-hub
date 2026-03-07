"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Hourglass,
  ThumbsUp,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { agentService, AgentReportStats } from "@/lib/services/agent-service";
import { Skeleton } from "@/components/ui/skeleton";

const defaultStats: AgentReportStats = {
  total: 0,
  pending: 0,
  approved: 0,
  inProgress: 0,
  resolved: 0,
  rejected: 0,
};

export interface MetricsCardsProps {
  stats?: AgentReportStats | null;
  loading?: boolean;
}

export function MetricsCards({
  stats: providedStats,
  loading: providedLoading,
}: MetricsCardsProps) {
  const [stats, setStats] = useState<AgentReportStats>(defaultStats);
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
        const response = await agentService.getMyReports();

        if (response.success && response.data?.reports) {
          const calculatedStats = agentService.calculateReportStats(
            response.data.reports,
          );
          setStats(calculatedStats);
        } else {
          setError(response.message || "Failed to fetch statistics");
        }
      } catch (err) {
        setError("Failed to load statistics");
        console.error("Error fetching agent reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [providedStats, providedLoading]);

  const metrics = [
    {
      label: "Total Issues",
      value: stats.total,
      icon: FileText,
      color: "text-slate-900",
      bg: "from-slate-100 to-slate-200",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Hourglass,
      color: "text-amber-900",
      bg: "from-amber-100 to-amber-200",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: ThumbsUp,
      color: "text-blue-900",
      bg: "from-blue-100 to-blue-200",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Loader2,
      color: "text-indigo-900",
      bg: "from-indigo-100 to-indigo-200",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-emerald-900",
      bg: "from-emerald-100 to-emerald-200",
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
        <Card key={metric.label} className="border-none shadow-md shadow-slate-200/50 overflow-hidden group hover:shadow-lg transition-all duration-300">
          <CardContent className="px-5 py-6 flex items-center gap-4 relative">
            <div className={`p-3 rounded-2xl bg-linear-to-br ${metric.bg} ${metric.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
              <metric.icon className="h-6 w-6 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-semibold text-slate-900 leading-tight">
                {loading ? <Skeleton className="h-8 w-16" /> : metric.value}
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                {metric.label}
              </p>
            </div>
            <div className="absolute top-0 right-0 p-1 opacity-10 group-hover:opacity-20 transition-opacity">
               <metric.icon className="h-16 w-16 -mr-4 -mt-4 rotate-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
