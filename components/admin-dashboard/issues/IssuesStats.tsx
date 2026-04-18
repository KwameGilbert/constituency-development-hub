"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { issuesService, IssueStatistics } from "@/lib/services/issues-service";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function IssuesStats() {
  const [stats, setStats] = useState<IssueStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await issuesService.getStatistics();
        if (response && response.success) {
          setStats(response.data);
        } else {
          setStats(null);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="px-5 py-6 flex items-center gap-4">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-7 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="p-6 bg-red-50 border-none shadow-sm shadow-red-200/50">
        <p className="text-red-600 font-bold flex items-center gap-2 text-sm">
          <AlertCircle className="w-4 h-4" />
          Failed to load issue statistics
        </p>
      </Card>
    );
  }

  const metrics = [
    {
      label: "Total Issues",
      value: stats.total,
      icon: Activity,
      color: "text-slate-900",
      bg: "from-slate-100 to-slate-200",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-900",
      bg: "from-amber-100 to-amber-200",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "text-emerald-900",
      bg: "from-emerald-100 to-emerald-200",
    },
    {
      label: "Urgent",
      value: stats.by_priority.urgent || 0,
      icon: Zap,
      color: "text-red-900",
      bg: "from-red-100 to-red-200",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <Card 
            key={index} 
            className="border-none shadow-md shadow-slate-200/40 group hover:shadow-lg transition-all duration-300 overflow-hidden relative"
          >
            <CardContent className="px-5 py-6 flex items-center gap-4 relative z-10">
              <div className={`p-3 rounded-2xl bg-linear-to-br ${metric.bg} ${metric.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className="w-6 h-6 stroke-[2.5px]" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-slate-900 leading-tight">
                  {metric.value}
                </span>
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-0.5">
                  {metric.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
          <div className="bg-white/50 border-b border-slate-100/60 p-4 font-bold text-sm text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            Status Breakdown
          </div>
          <CardContent className="p-4 bg-white">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stats.by_status).map(([status, count]) => (
                <div
                  key={status}
                  className="p-3 rounded-xl border border-slate-50 bg-slate-50/30 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 truncate">
                    {status.replace(/_/g, " ")}
                  </p>
                  <p className="text-xl font-bold text-slate-900">{count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
          <div className="bg-white/50 border-b border-slate-100/60 p-4 font-bold text-sm text-slate-800 flex items-center gap-2">
            <Activity className="w-4 h-4 text-amber-500" />
            Priority Distribution
          </div>
          <CardContent className="p-4 bg-white">
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(stats.by_priority).map(([priority, count]) => {
                const priorityConfig = {
                  urgent: { color: "text-red-700", bg: "bg-red-50" },
                  high: { color: "text-orange-700", bg: "bg-orange-50" },
                  medium: { color: "text-amber-700", bg: "bg-amber-50" },
                  low: { color: "text-emerald-700", bg: "bg-emerald-50" },
                }[priority as keyof typeof stats.by_priority] || { color: "text-slate-700", bg: "bg-slate-50" };

                return (
                  <div
                    key={priority}
                    className={`p-3 rounded-xl border border-transparent ${priorityConfig.bg} transition-all`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`text-[10px] font-bold uppercase ${priorityConfig.color}`}>
                        {priority}
                      </p>
                      <p className={`text-xl font-bold ${priorityConfig.color}`}>{count}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
