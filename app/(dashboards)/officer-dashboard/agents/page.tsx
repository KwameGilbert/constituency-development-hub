import { AgentsHeader } from "@/components/officer-dashboard/agents/AgentsHeader";
import { AgentsMetrics } from "@/components/officer-dashboard/agents/AgentsMetrics";
import { AllAgents } from "@/components/officer-dashboard/agents/AllAgents";
import React from "react";

export default function AgentsPage() {
  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      <AgentsHeader />

      <main className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full pb-20">
        <AgentsMetrics />
        <AllAgents />
      </main>
    </div>
  );
}
