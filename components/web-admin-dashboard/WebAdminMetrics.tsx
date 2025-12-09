import React from "react";
import { FileText, Calendar, Image as ImageIcon, Clock } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  count: string | number;
  label: string;
  icon: React.ElementType;
  href: string;
  color: "blue" | "green" | "purple" | "orange";
}

function MetricCard({ title, count, label, icon: Icon, href, color }: MetricCardProps) {
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
          <span className="text-3xl font-bold text-slate-900">{count}</span>
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Blog Posts"
        count="11"
        label="Manage Posts"
        icon={FileText}
        href="/web-admin-dashboard/blog"
        color="blue"
      />
      <MetricCard
        title="Events"
        count="0"
        label="Manage Events"
        icon={Calendar}
        href="/web-admin-dashboard/events"
        color="green"
      />
      <MetricCard
        title="Carousel Items"
        count="6"
        label="Manage Carousel"
        icon={ImageIcon}
        href="/web-admin-dashboard/carousel"
        color="purple"
      />
      <MetricCard
        title="Upcoming Events"
        count="0"
        label="View Calendar"
        icon={Clock}
        href="/web-admin-dashboard/events"
        color="orange"
      />
    </div>
  );
}
