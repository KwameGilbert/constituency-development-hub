import { SidebarTrigger } from "@/components/ui/sidebar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export function AgentAddIssuesHeader() {
  return (
    <div className="flex items-center justify-between px-4 sm:px-6 py-4 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger className="text-slate-600 hover:text-amber-600 hover:bg-amber-50" />
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Add New Issue
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">Community Submission Portal</p>
          </div>
        </div>
      </div>
      <Link href="/agents-dashboard/issues">
        <Button
          variant="outline"
          className="gap-2 border-slate-200 hover:bg-slate-50 text-slate-600 font-medium rounded-lg transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Issues</span>
          <span className="sm:hidden">Back</span>
        </Button>
      </Link>
    </div>
  );
}
