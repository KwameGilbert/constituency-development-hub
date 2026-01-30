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
    blue: "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100",
    green: "bg-green-50 text-green-700 hover:bg-green-100 border-green-100",
    purple:
      "bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100",
  };

  return (
    <Link href={href} className="flex-1">
      <button
        className={cn(
          "w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl border transition-colors font-medium",
          colorStyles[color],
        )}
      >
        <PlusCircle className="w-5 h-5" />
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
