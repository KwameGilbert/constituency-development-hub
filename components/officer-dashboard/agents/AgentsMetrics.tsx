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
      color: "text-blue-900",
      bg: "from-blue-100 to-blue-200",
      description: "Registered field agents",
    },
    {
      label: "ACTIVE AGENTS",
      value: stats.active_agents,
      icon: UserCheck,
      color: "text-emerald-900",
      bg: "from-emerald-100 to-emerald-200",
      description: "Currently on the field",
    },
    {
      label: "INACTIVE AGENTS",
      value: stats.inactive_agents,
      icon: UserX,
      color: "text-red-900",
      bg: "from-red-100 to-red-200",
      description: "Agents off-duty",
    },
    {
      label: "TOTAL REPORTS",
      value: stats.issues_handled,
      icon: FileText,
      color: "text-purple-900",
      bg: "from-purple-100 to-purple-200",
      description: "Submitted across zones",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="border-none shadow-md shadow-slate-200/50 overflow-hidden group hover:shadow-lg transition-all duration-300"
        >
          <CardContent className="px-5 py-6 flex items-center gap-4 relative bg-white">
            <div
              className={`p-3 rounded-2xl bg-gradient-to-br ${metric.bg} ${metric.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}
            >
              <metric.icon className="h-6 w-6 stroke-[2.5px]" />
            </div>
            <div className="flex flex-col z-10">
              <span className="text-2xl font-bold text-slate-900 leading-none flex items-center gap-1.5">
                {loading ? <Skeleton className="h-8 w-16" /> : metric.value}
                {!loading && <TrendingUp className="h-4 w-4 text-emerald-500" />}
              </span>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1.5">
                {metric.label}
              </p>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                {metric.description}
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
