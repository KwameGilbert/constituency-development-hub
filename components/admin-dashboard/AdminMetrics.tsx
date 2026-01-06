"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  ClipboardList,
  Users,
  FolderKanban,
  Wallet,
  Briefcase,
  ShieldCheck,
  UserCog
} from "lucide-react";
import { dashboardService, DashboardStats } from "@/lib/services/dashboard-service";

interface MetricData {
  summaryMetrics: Array<{
    id: string;
    label: string;
    value: number | string;
    subtitle: string;
    icon: string;
    color: string;
  }>;
  entityMetrics: Array<{
    id: string;
    label: string;
    value: number;
    icon: string;
    color: string;
  }>;
}

const iconMap = {
  ClipboardList,
  Users,
  FolderKanban,
  Wallet,
  Briefcase,
  ShieldCheck,
  UserCog,
};

const colorMap = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-l-blue-500",
    cardBg: "bg-blue-50",
    cardBorder: "border-blue-100",
    label: "text-blue-800",
    value: "text-blue-900",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-600",
    border: "border-l-emerald-500",
    cardBg: "bg-emerald-50",
    cardBorder: "border-emerald-100",
    label: "text-emerald-800",
    value: "text-emerald-900",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-l-purple-500",
    cardBg: "bg-purple-50",
    cardBorder: "border-purple-100",
    label: "text-purple-800",
    value: "text-purple-900",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-600",
    border: "border-l-amber-500",
    cardBg: "bg-amber-50",
    cardBorder: "border-amber-100",
    label: "text-amber-800",
    value: "text-amber-900",
  },
  indigo: {
    bg: "bg-indigo-100",
    text: "text-indigo-600",
    border: "border-l-indigo-500",
    cardBg: "bg-indigo-50",
    cardBorder: "border-indigo-100",
    label: "text-indigo-800",
    value: "text-indigo-900",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-600",
    border: "border-l-red-500",
    cardBg: "bg-red-50",
    cardBorder: "border-red-100",
    label: "text-red-800",
    value: "text-red-900",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "border-l-green-500",
    cardBg: "bg-green-50",
    cardBorder: "border-green-100",
    label: "text-green-800",
    value: "text-green-900",
  },
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
          // Transform API response to component format
          const transformedData: MetricData = {
            summaryMetrics: [
              {
                id: 'total-issues',
                label: 'Total Issues',
                value: response.data.overview.total_issues,
                subtitle: 'Reported issues',
                icon: 'ClipboardList',
                color: 'blue'
              },
              {
                id: 'active-users',
                label: 'Active Users',
                value: response.data.overview.active_users,
                subtitle: 'Currently active',
                icon: 'Users',
                color: 'emerald'
              },
              {
                id: 'total-projects',
                label: 'Total Projects',
                value: response.data.overview.total_projects,
                subtitle: 'All projects',
                icon: 'FolderKanban',
                color: 'purple'
              },
              {
                id: 'total-budget',
                label: 'Total Budget',
                value: `₵${response.data.overview.total_budget.toLocaleString()}`,
                subtitle: 'Allocated budget',
                icon: 'Wallet',
                color: 'amber'
              }
            ],
            entityMetrics: [
              {
                id: 'admins',
                label: 'Admins',
                value: response.data.users_by_role.admin,
                icon: 'ShieldCheck',
                color: 'indigo'
              },
              {
                id: 'web-admins',
                label: 'Web Admins',
                value: response.data.users_by_role.web_admin,
                icon: 'UserCog',
                color: 'red'
              },
              {
                id: 'officers',
                label: 'Officers',
                value: response.data.users_by_role.officer,
                icon: 'Briefcase',
                color: 'green'
              },
              {
                id: 'agents',
                label: 'Agents',
                value: response.data.users_by_role.agent,
                icon: 'Users',
                color: 'blue'
              }
            ]
          };

          setMetrics(transformedData);
        } else {
          setError(response.message || 'Failed to load dashboard statistics');
        }
      } catch (err) {
        setError('Failed to load metrics data');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="w-16 h-6 bg-gray-200 rounded"></div>
                  <div className="w-24 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="w-20 h-4 bg-gray-200 rounded"></div>
                  <div className="w-12 h-6 bg-gray-200 rounded"></div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="space-y-6">
        <Card className="p-4 text-center text-red-600">
          {error || 'No data available'}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Row - Main Summaries */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.summaryMetrics.map((metric) => {
          const IconComponent = iconMap[metric.icon as keyof typeof iconMap];
          const colors = colorMap[metric.color as keyof typeof colorMap];

          return (
            <Card key={metric.id} className={`p-4 flex-row items-center space-x-4 border-l-4 ${colors.border} shadow-sm hover:shadow-md transition-shadow`}>
              <div className={`${colors.bg} p-3 rounded-xl`}>
                <IconComponent className={`${colors.text} w-6 h-6`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                <h3 className="text-2xl font-bold text-gray-800">{metric.value}</h3>
                <p className="text-xs text-gray-400">{metric.subtitle}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Second Row - Entity Counts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.entityMetrics.map((metric) => {
          const IconComponent = iconMap[metric.icon as keyof typeof iconMap];
          const colors = colorMap[metric.color as keyof typeof colorMap];

          return (
            <Card key={metric.id} className={`p-4 flex-row items-center justify-between ${colors.cardBg} border ${colors.cardBorder} shadow-sm`}>
              <div>
                <p className={`text-sm font-medium ${colors.label}`}>{metric.label}</p>
                <h3 className={`text-2xl font-bold ${colors.value} mt-1`}>{metric.value}</h3>
              </div>
              <div className="bg-white p-2 rounded-lg shadow-sm">
                <IconComponent className={`${colors.text} w-5 h-5`} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
