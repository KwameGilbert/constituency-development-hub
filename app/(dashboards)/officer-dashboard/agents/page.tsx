import { AgentsHeader } from "@/components/officer-dashboard/agents/AgentsHeader";
import { AgentsMetrics } from "@/components/officer-dashboard/agents/AgentsMetrics";
import { AllAgents } from "@/components/officer-dashboard/agents/AllAgents";
import React from "react";

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <AgentsHeader />

      <div className="p-6 space-y-6">
        <AgentsMetrics />
        <AllAgents />
      </div>
    </div>
  );
}
