import { AgentAllIssues } from "@/components/agent-dashboard/issues/AgentAllIssues";
import { AgentIssuesHeader } from "@/components/agent-dashboard/issues/AgentIssuesHeader";
import React from "react";

export default function IssuesPage() {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      <AgentIssuesHeader />
      <div className="p-6 space-y-8">
        <AgentAllIssues />
      </div>
    </div>
  );
}
