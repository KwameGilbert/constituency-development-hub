import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AgentsHeader() {
  return (
    <header className="flex items-center justify-between px-4 sm:px-6 py-4 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20">
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger className="text-slate-600 hover:text-indigo-600 hover:bg-indigo-50" />
        <div className="flex flex-col">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
            Agents Management
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse hidden sm:block" />
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium whitespace-nowrap">
              Manage field agents and their activities
            </p>
          </div>
        </div>
      </div>
      <Link href="/officer-dashboard/agents/add">
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 rounded-lg shadow-sm font-semibold transition-all">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Agent</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </Link>
    </header>
  );
}
