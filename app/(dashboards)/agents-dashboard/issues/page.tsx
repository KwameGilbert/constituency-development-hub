import { AgentAllIssues } from "@/components/agent-dashboard/issues/AgentAllIssues";
import { AgentIssuesHeader } from "@/components/agent-dashboard/issues/AgentIssuesHeader";
import React from "react";

export default function IssuesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AgentIssuesHeader />
      <div className="flex-1 p-4 sm:p-6 space-y-6 sm:space-y-8">
        <AgentAllIssues />
      </div>
    </div>
  );
}
