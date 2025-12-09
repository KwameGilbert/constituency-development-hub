import AgentDashboardHeader from "@/components/agent-dashboard/AgentDashboardHeader";
import { MetricsCards } from "@/components/agent-dashboard/MetricsCards";
import { RecentTasks } from "@/components/agent-dashboard/RecentTasks";
import { IssueBreakdown } from "@/components/officer-dashboard/charts/IssueBreakdown";
import { IssuesByStatus } from "@/components/officer-dashboard/charts/IssuesByStatus";
import React from "react";

function AgentMainPage() {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      <AgentDashboardHeader />
      <div className="flex-1 space-y-6 p-6 pt-6">
        <MetricsCards />
        <div className="grid gap-6 md:grid-cols-2">
          <IssuesByStatus />
          <IssueBreakdown />
        </div>
        <RecentTasks />
      </div>
      </div>
  );
}

export default AgentMainPage;
