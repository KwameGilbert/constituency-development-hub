import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import Link from "next/link";

export function AgentIssuesHeader() {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger className="text-slate-600 hover:text-amber-600 hover:bg-amber-50" />
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Issues & Reports
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Constituency Tracking System</p>
          </div>
        </div>
      </div>
      <Link
        href="/agents-dashboard/issues/add"
        className="bg-slate-900 hover:bg-slate-800 text-white font-medium flex gap-2 items-center px-4 py-2 rounded-lg shadow-sm transition-all hover:scale-[1.02] active:scale-95 text-sm"
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Submit New Issue</span>
        <span className="sm:hidden">New Issue</span>
      </Link>
    </div>
  );
}
