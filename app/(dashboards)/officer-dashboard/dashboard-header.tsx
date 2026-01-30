import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  title,
  subtitle,
  children,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-auto min-h-16 w-full items-center justify-between gap-4 border-b bg-background px-6 py-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2 md:hidden" />
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-3">{children}</div>
    </header>
  );
}
