import { AgentsHeader } from "@/components/officer-dashboard/agents/AgentsHeader";
import { AgentsMetrics } from "@/components/officer-dashboard/agents/AgentsMetrics";
import { AllAgents } from "@/components/officer-dashboard/agents/AllAgents";
import React from "react";

export default function AgentsPage() {
  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      <AgentsHeader />

      <main className="p-3 sm:p-4 space-y-4 max-w-7xl mx-auto w-full pb-6">
        <AgentsMetrics />
        <AllAgents />
      </main>
    </div>
  );
}
