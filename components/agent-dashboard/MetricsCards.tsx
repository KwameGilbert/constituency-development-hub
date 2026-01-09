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

export function MetricsCards() {
  const [stats, setStats] = useState<AgentReportStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await agentService.getMyReports();
        
        if (response.success && response.data?.reports) {
          const calculatedStats = agentService.calculateReportStats(response.data.reports);
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
  }, []);

  const metrics = [
    {
      label: "Total Issues",
      value: stats.total,
      icon: FileText,
      color: "text-slate-600",
      bgColor: "bg-slate-100",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Hourglass,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: ThumbsUp,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Loader2,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {metrics.map((metric) => (
        <Card key={metric.label} className="border-none shadow-sm">
          <CardContent className="px-4 py-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`w-5 h-5 ${metric.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </p>
              <h3 className="text-xl font-bold">{metric.value}</h3>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
