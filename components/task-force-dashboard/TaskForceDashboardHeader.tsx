import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";

export default function TaskForceDashboardHeader() {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger className="text-slate-600 hover:text-amber-600 hover:bg-amber-50" />
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
              Task Force Resolution Hub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
