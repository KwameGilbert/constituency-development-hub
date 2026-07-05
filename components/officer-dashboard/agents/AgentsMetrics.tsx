"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, FileText, TrendingUp } from "lucide-react";
import { agentService } from "@/lib/services/agent-service";
import { Skeleton } from "@/components/ui/skeleton";

export function AgentsMetrics() {
  const [stats, setStats] = useState({
    total_agents: 0,
    active_agents: 0,
    inactive_agents: 0,
    issues_handled: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await agentService.getAgentStatsForOfficer();
        if (response.success && response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch agent stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const metrics = [
    {
      label: "TOTAL AGENTS",
      value: stats.total_agents,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Registered field agents",
    },
    {
      label: "ACTIVE AGENTS",
      value: stats.active_agents,
      icon: UserCheck,
      color: "text-green-600",
      bg: "bg-green-50",
      description: "Currently on the field",
    },
    {
      label: "INACTIVE AGENTS",
      value: stats.inactive_agents,
      icon: UserX,
      color: "text-orange-600",
      bg: "bg-orange-50",
      description: "Agents off-duty",
    },
    {
      label: "TOTAL REPORTS",
      value: stats.issues_handled,
      icon: FileText,
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Submitted across zones",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300 rounded-xl"
        >
          <CardContent className="p-4 flex items-center gap-3 relative bg-white">
            <div
              className={`p-2.5 rounded-xl ${metric.bg} ${metric.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}
            >
              <metric.icon className="h-5 w-5 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col z-10">
              <span className="text-xl font-bold text-slate-900 leading-none flex items-center gap-1.5">
                {loading ? <Skeleton className="h-6 w-12" /> : metric.value}
                {!loading && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
              </span>
              <div className="text-xs font-semibold text-slate-950 mt-1">
                {metric.label}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {metric.description}
              </div>
            </div>
            <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-10 transition-opacity">
              <metric.icon className="h-12 w-12 -mr-3 -mt-3 rotate-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
