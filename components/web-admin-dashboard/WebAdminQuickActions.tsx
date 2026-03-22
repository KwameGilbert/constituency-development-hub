import React from "react";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  label: string;
  href: string;
  color: "blue" | "green" | "purple";
}

function QuickActionButton({ label, href, color }: QuickActionProps) {
  const colorStyles = {
    blue: "bg-white border-slate-200/60 text-slate-700 hover:border-amber-500/50 hover:bg-amber-50/50 hover:text-amber-700 shadow-sm",
    green: "bg-white border-slate-200/60 text-slate-700 hover:border-emerald-500/50 hover:bg-emerald-50/50 hover:text-emerald-700 shadow-sm",
    purple: "bg-white border-slate-200/60 text-slate-700 hover:border-amber-500/50 hover:bg-amber-50/50 hover:text-amber-700 shadow-sm",
  };

  return (
    <Link href={href} className="flex-1">
      <button
        className={cn(
          "w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl border transition-all duration-300 font-semibold group",
          colorStyles[color],
        )}
      >
        <PlusCircle className="w-5 h-5 text-amber-600 group-hover:scale-110 transition-transform" />
        {label}
      </button>
    </Link>
  );
}

export function WebAdminQuickActions() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
      <div className="flex flex-col md:flex-row gap-4">
        <QuickActionButton
          label="New Blog Post"
          href="/web-admin-dashboard/blog/new"
          color="blue"
        />
        <QuickActionButton
          label="New Event"
          href="/web-admin-dashboard/events/new"
          color="green"
        />
        <QuickActionButton
          label="New Carousel Item"
          href="/web-admin-dashboard/carousel/new"
          color="purple"
        />
      </div>
    </div>
  );
}
