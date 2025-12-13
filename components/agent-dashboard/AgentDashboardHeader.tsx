import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import React from "react";

export default function AgentDashboardHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-4 w-full bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Welcome back, Agent.Rock</p>
        </div>
      </div>
      <Button className="bg-slate-900 text-white hover:bg-slate-800">
        <Plus className="mr-2 h-4 w-4" />
        New Issue
      </Button>
    </div>
  );
}
