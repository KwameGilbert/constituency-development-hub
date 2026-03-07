import { AgentAddIssues } from "@/components/agent-dashboard/issues/AgentAddIssues";
import { AgentAddIssuesHeader } from "@/components/agent-dashboard/issues/AgentAddIssuesHeader";
import React from "react";

export default function AddIssuePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AgentAddIssuesHeader />
      <div className="flex-1 p-4 sm:p-6">
        <AgentAddIssues />
      </div>
    </div>
  );
}
