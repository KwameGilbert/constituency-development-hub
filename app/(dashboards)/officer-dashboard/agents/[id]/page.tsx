import React from "react";
import { AgentDetailsHeader } from "@/components/officer-dashboard/agents/AgentDetailsHeader";
import { AgentDetails } from "@/components/officer-dashboard/agents/AgentDetails";

export default async function AgentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="space-y-6">
            <AgentDetailsHeader agentId={id} />
            <div className="p-6">
                <AgentDetails agentId={id} />
            </div>
        </div>
    );
}
