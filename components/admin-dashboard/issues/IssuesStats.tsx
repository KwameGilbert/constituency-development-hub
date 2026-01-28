"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { issuesService, IssueStatistics } from "@/lib/services/issues-service";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data fallback

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-700 font-medium">Failed to load statistics</p>
      </Card>
    );
  }

  const primaryMetrics = [
    {
      label: "Total Issues",
      value: stats.total,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      label: "Resolved",
      value: stats.resolved,
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Urgent Priority",
      value: stats.by_priority.urgent || 0,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {primaryMetrics.map((metric, index) => (
          <Card key={index} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500">
                  {metric.label}
                </p>
                <h3 className="text-3xl font-bold text-gray-900">
                  {metric.value}
                </h3>
              </div>
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Status Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          Status Breakdown
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {Object.entries(stats.by_status).map(([status, count]) => (
            <div
              key={status}
              className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <p className="text-xs font-medium text-gray-500 mb-1 capitalize">
                {status.replace(/_/g, " ")}
              </p>
              <p className="text-xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Priority Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-gray-600" />
          Priority Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats.by_priority).map(([priority, count]) => {
            const priorityConfig = {
              urgent: {
                color: "text-red-700",
                bgColor: "bg-red-100",
                borderColor: "border-red-200",
              },
              high: {
                color: "text-orange-700",
                bgColor: "bg-orange-100",
                borderColor: "border-orange-200",
              },
              medium: {
                color: "text-yellow-700",
                bgColor: "bg-yellow-100",
                borderColor: "border-yellow-200",
              },
              low: {
                color: "text-gray-700",
                bgColor: "bg-gray-100",
                borderColor: "border-gray-200",
              },
            }[priority as keyof typeof stats.by_priority] || {
              color: "text-gray-700",
              bgColor: "bg-gray-100",
              borderColor: "border-gray-200",
            };

            return (
              <Card
                key={priority}
                className={`p-4 border-2 ${priorityConfig.borderColor} ${priorityConfig.bgColor}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="outline"
                    className={`${priorityConfig.color} border-0 font-semibold capitalize`}
                  >
                    {priority}
                  </Badge>
                </div>
                <p className={`text-2xl font-bold ${priorityConfig.color}`}>
                  {count}
                </p>
              </Card>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
