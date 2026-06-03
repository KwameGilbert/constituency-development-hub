"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ClipboardList,
  Users,
  FolderKanban,
  Wallet,
  Briefcase,
  ShieldCheck,
  UserCog,
  Banknote,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  dashboardService,
  DashboardStats,
} from "@/lib/services/dashboard-service";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricItem {
  id: string;
  label: string;
  value: number | string;
  subtitle: string;
  icon: keyof typeof iconMap;
  color: keyof typeof colorMap;
}

interface MetricData {
  row1Metrics: MetricItem[];
  row2Metrics: MetricItem[];
}

const iconMap = {
  ClipboardList,
  Users,
  FolderKanban,
  Wallet,
  Briefcase,
  ShieldCheck,
  UserCog,
  Banknote,
  TrendingUp,
  Activity,
};

const colorMap = {
  blue: {
    bg: "from-blue-50 to-blue-100",
    text: "text-blue-600",
    iconBg: "from-blue-100 to-blue-200",
    shadow: "shadow-blue-200/40",
  },
  emerald: {
    bg: "from-emerald-50 to-emerald-100",
    text: "text-emerald-600",
    iconBg: "from-emerald-100 to-emerald-200",
    shadow: "shadow-emerald-200/40",
  },
  purple: {
    bg: "from-purple-50 to-purple-100",
    text: "text-purple-600",
    iconBg: "from-purple-100 to-purple-200",
    shadow: "shadow-purple-200/40",
  },
  amber: {
    bg: "from-amber-50 to-amber-100",
    text: "text-amber-600",
    iconBg: "from-amber-400/20 to-amber-500/20",
    shadow: "shadow-amber-200/40",
  },
  indigo: {
    bg: "from-indigo-50 to-indigo-100",
    text: "text-indigo-600",
    iconBg: "from-indigo-100 to-indigo-200",
    shadow: "shadow-indigo-200/40",
  },
  slate: {
    bg: "from-slate-50 to-slate-100",
    text: "text-slate-600",
    iconBg: "from-slate-100 to-slate-200",
    shadow: "shadow-slate-200/40",
  }
};

export function AdminMetrics() {
  const [metrics, setMetrics] = useState<MetricData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await dashboardService.getAdminStats();

        if (response.success && response.data) {
          const transformedData: MetricData = {
            row1Metrics: [
              {
                id: "total-issues",
                label: "Total Issues",
                value: response.data.overview.total_issues,
                subtitle: "Reported issues",
                icon: "ClipboardList",
                color: "blue",
              },
              {
                id: "active-users",
                label: "Active Users",
                value: response.data.overview.active_users,
                subtitle: "Currently active",
                icon: "Users",
                color: "emerald",
              },
              {
                id: "total-projects",
                label: "Total Projects",
                value: response.data.overview.total_projects,
                subtitle: "All projects",
                icon: "FolderKanban",
                color: "purple",
              },
            ],
            row2Metrics: [
              {
                id: "grand-total-budget",
                label: "Total Funds Available",
                value: `₵${(response.data.overview.grand_total_budget || 0).toLocaleString()}`,
                subtitle: "Total Projects + Issues",
                icon: "Wallet",
                color: "emerald",
              },
              {
                id: "project-budget",
                label: "Funds for Development Projects",
                value: `₵${response.data.overview.total_budget.toLocaleString()}`,
                subtitle: "Allocated project funds",
                icon: "TrendingUp",
                color: "amber",
              },
              {
                id: "issues-budget",
                label: "Funds for Community Support",
                value: `₵${(response.data.overview.total_issues_budget || 0).toLocaleString()}`,
                subtitle: "Allocated for issue resolution",
                icon: "Activity",
                color: "indigo",
              },
            ],
          };

          setMetrics(transformedData);
        } else {
          setError(response.message || "Failed to load dashboard statistics");
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-none shadow-sm h-32">
            <CardContent className="p-6 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-600 text-sm font-medium">
        {error || "No data available"}
      </div>
    );
  }

  const allMetrics = [...metrics.row1Metrics, ...metrics.row2Metrics];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {allMetrics.map((metric) => {
        const IconComponent = iconMap[metric.icon];
        const colors = colorMap[metric.color];

        return (
          <Card
            key={metric.id}
            className="border-none shadow-md shadow-slate-200/40 group hover:shadow-lg transition-all duration-300 overflow-hidden relative"
          >
            <CardContent className="p-6 flex items-center gap-5 relative z-10">
              <div className={`p-3.5 rounded-2xl bg-linear-to-br ${colors.iconBg} ${colors.text} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent className="w-6 h-6 stroke-[2.5px]" />
              </div>
              <div className="flex flex-col">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {metric.label}
                </p>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  {metric.value}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">{metric.subtitle}</p>
              </div>
            </CardContent>
            {/* Background Decorative Icon */}
            <div className="absolute -top-4 -right-4 p-1 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
              <IconComponent className="h-32 w-32 rotate-12" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
