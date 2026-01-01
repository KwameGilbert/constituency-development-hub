"use client";

import React, { useEffect, useState } from "react";
import { FileText, Calendar, Image as ImageIcon, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { dashboardService, DashboardStats } from "@/lib/services/dashboard-service";

interface MetricCardProps {
  title: string;
  count: string | number;
  label: string;
  icon: React.ElementType;
  href: string;
  color: "blue" | "green" | "purple" | "orange";
  loading?: boolean;
}

function MetricCard({ title, count, label, icon: Icon, href, color, loading }: MetricCardProps) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      iconBg: "bg-green-100",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      iconBg: "bg-orange-100",
    },
  };

  const styles = colorStyles[color];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
          {loading ? (
            <div className="h-9 w-16 bg-slate-200 animate-pulse rounded" />
          ) : (
            <span className="text-3xl font-bold text-slate-900">{count}</span>
          )}
        </div>
        <div className={cn("p-3 rounded-full", styles.iconBg)}>
          <Icon className={cn("w-5 h-5", styles.text)} />
        </div>
      </div>
      <Link href={href} className={cn("text-sm font-medium hover:underline", styles.text)}>
        {label}
      </Link>
    </div>
  );
}

export function WebAdminMetrics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await dashboardService.getStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch {
        // Silently use fallback values if API fails
        setStats({
          blog_posts: 0,
          events: 0,
          carousel_items: 0,
          upcoming_events: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Blog Posts"
        count={stats?.blog_posts ?? 0}
        label="Manage Posts"
        icon={FileText}
        href="/web-admin-dashboard/blog"
        color="blue"
        loading={loading}
      />
      <MetricCard
        title="Events"
        count={stats?.events ?? 0}
        label="Manage Events"
        icon={Calendar}
        href="/web-admin-dashboard/events"
        color="green"
        loading={loading}
      />
      <MetricCard
        title="Carousel Items"
        count={stats?.carousel_items ?? 0}
        label="Manage Carousel"
        icon={ImageIcon}
        href="/web-admin-dashboard/carousel"
        color="purple"
        loading={loading}
      />
      <MetricCard
        title="Upcoming Events"
        count={stats?.upcoming_events ?? 0}
        label="View Calendar"
        icon={Clock}
        href="/web-admin-dashboard/events"
        color="orange"
        loading={loading}
      />
    </div>
  );
}
