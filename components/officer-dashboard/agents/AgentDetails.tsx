import React from "react";
import { AgentProfileCard } from "./AgentProfileCard";
import { AgentQuickActions } from "./AgentQuickActions";
import { AgentStatsCards } from "./AgentStatsCards";
import { AgentStatusDistribution } from "./AgentStatusDistribution";
import { AgentRecentIssues } from "./AgentRecentIssues";

export function AgentDetails({ agentId = "1" }: { agentId?: string }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Profile and Actions */}
      <div className="space-y-6">
        <AgentProfileCard />
        <AgentQuickActions agentId={agentId} />
      </div>

      {/* Right Column: Stats, Charts, Issues */}
      <div className="lg:col-span-2 space-y-6">
        <AgentStatsCards />
        <AgentStatusDistribution />
        <AgentRecentIssues />
      </div>
    </div>
  );
}
