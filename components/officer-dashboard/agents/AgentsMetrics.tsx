"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, FileText, TrendingUp } from "lucide-react";
import { agentService } from "@/lib/services/agent-service";
import { cn } from "@/lib/utils";

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
      label: "Total Agents",
      value: stats.total_agents,
      icon: Users,
      color: "blue",
      gradient: "from-blue-500/10 to-indigo-500/5",
      iconBg: "bg-blue-100 text-blue-600",
      description: "Registered field agents",
    },
    {
      label: "Active Agents",
      value: stats.active_agents,
      icon: UserCheck,
      color: "green",
      gradient: "from-emerald-500/10 to-green-500/5",
      iconBg: "bg-emerald-100 text-emerald-600",
      description: "Currently on the field",
    },
    {
      label: "Inactive Agents",
      value: stats.inactive_agents,
      icon: UserX,
      color: "red",
      gradient: "from-red-500/10 to-orange-500/5",
      iconBg: "bg-red-100 text-red-600",
      description: "Agents off-duty",
    },
    {
      label: "Total Reports",
      value: stats.issues_handled,
      icon: FileText,
      color: "purple",
      gradient: "from-purple-500/10 to-pink-500/5",
      iconBg: "bg-purple-100 text-purple-600",
      description: "Submitted across zones",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {metrics.map((metric, index) => (
        <Card
          key={index}
          className="overflow-hidden border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 group"
        >
          <CardContent
            className={cn("p-5 relative", "bg-gradient-to-br", metric.gradient)}
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {metric.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {loading ? (
                      <div className="h-8 w-16 bg-slate-200 animate-pulse rounded" />
                    ) : (
                      metric.value
                    )}
                  </h3>
                  {!loading && (
                    <TrendingUp className="h-3 w-3 text-emerald-500 mb-1" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  {metric.description}
                </p>
              </div>
              <div
                className={cn(
                  "p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110",
                  metric.iconBg,
                )}
              >
                <metric.icon className="h-5 w-5" />
              </div>
            </div>

            {/* Subtle background pattern */}
            <div className="absolute -bottom-2 -right-2 opacity-5 scale-150 rotate-12 transition-transform duration-500 group-hover:rotate-0">
              <metric.icon className="h-16 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
