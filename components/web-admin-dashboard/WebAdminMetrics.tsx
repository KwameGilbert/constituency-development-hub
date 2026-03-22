"use client";

import React, { useState, useEffect } from "react";
import { dashboardService } from "@/lib/services/dashboard-service";
import { FileText, Calendar, Image as ImageIcon, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WebAdminStats {
  blog_posts: number;
  events: number;
  carousel_items: number;
  upcoming_events: number;
}

// Default stats - can be replaced with actual API data when available
const defaultStats: WebAdminStats = {
  blog_posts: 0,
  events: 0,
  carousel_items: 0,
  upcoming_events: 0,
};

interface MetricCardProps {
  title: string;
  count: string | number;
  label: string;
  icon: React.ElementType;
  href: string;
  color: "blue" | "green" | "purple" | "orange";
  loading?: boolean;
}

function MetricCard({
  title,
  count,
  label,
  icon: Icon,
  href,
  color,
  loading,
}: MetricCardProps) {
  const colorStyles = {
    blue: {
      bg: "from-blue-100 to-blue-200",
      text: "text-blue-900",
    },
    green: {
      bg: "from-emerald-100 to-emerald-200",
      text: "text-emerald-900",
    },
    purple: {
      bg: "from-violet-100 to-violet-200",
      text: "text-violet-900",
    },
    orange: {
      bg: "from-amber-100 to-amber-200",
      text: "text-amber-900",
    },
  };

  const styles = colorStyles[color];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md shadow-slate-200/50 border-none flex flex-col justify-between h-full group hover:shadow-lg transition-all duration-300 relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {title}
          </h3>
          {loading ? (
            <div className="h-9 w-16 bg-slate-200 animate-pulse rounded" />
          ) : (
            <span className="text-3xl font-bold text-slate-900">{count}</span>
          )}
        </div>
        <div
          className={cn(
            "p-3 rounded-2xl bg-linear-to-br shadow-sm group-hover:scale-110 transition-transform duration-300",
            styles.bg,
            styles.text,
          )}
        >
          <Icon className="w-5 h-5 stroke-[2.5px]" />
        </div>
      </div>
      <Link
        href={href}
        className={cn(
          "text-xs font-semibold hover:underline mt-2 relative z-10",
          styles.text,
        )}
      >
        {label}
      </Link>
      <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="h-16 w-16 -mr-4 -mt-4 rotate-12" />
      </div>
    </div>
  );
}

export function WebAdminMetrics() {
  const [stats, setStats] = useState<WebAdminStats>(defaultStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await dashboardService.getAdminStats();
        if (response.success && response.data.content_stats) {
          setStats(response.data.content_stats);
        }
      } catch (error) {
        console.error("Failed to fetch web admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

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
