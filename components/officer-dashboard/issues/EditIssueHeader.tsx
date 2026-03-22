import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function EditIssueHeader({ caseId }: { caseId?: string }) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50" />
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Edit Issue Details
          </h1>
          {caseId ? (
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse hidden sm:block" />
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">{`Case ID: ${caseId}`}</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse hidden sm:block" />
              <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                Updating reported issue details
              </p>
            </div>
          )}
        </div>
      </div>
      <Link href="/officer-dashboard/issues">
        <Button
          variant="outline"
          className="gap-2 border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Back to Issues</span>
        </Button>
      </Link>
    </header>
  );
}
