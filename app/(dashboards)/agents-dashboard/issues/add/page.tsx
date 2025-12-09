import { AgentAddIssues } from "@/components/agent-dashboard/issues/AgentAddIssues";
import { AgentAddIssuesHeader } from "@/components/agent-dashboard/issues/AgentAddIssuesHeader";
import React from "react";

export default function AddIssuePage() {
    return (
        <div className="flex flex-col h-full w-full bg-slate-50">
            <AgentAddIssuesHeader />
            <div className="p-6">
                <AgentAddIssues />
            </div>
        </div>
    );
}
