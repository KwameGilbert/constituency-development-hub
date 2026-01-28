import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";

interface AgentDetailsHeaderProps {
  agentName?: string;
  agentEmail?: string;
  agentId?: string;
}

export function AgentDetailsHeader({
  agentName = "Agent.Rock",
  agentEmail = "agent.rock@kofibenteh.com",
  agentId = "1",
}: AgentDetailsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-[#1e1b4b]">
          Agent Details: {agentName}
        </h1>
        <p className="text-muted-foreground">{agentEmail}</p>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/officer-dashboard/agents">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Agents
          </Button>
        </Link>
        <Link href={`/officer-dashboard/agents/${agentId}/edit`}>
          <Button className="bg-[#312e81] hover:bg-[#312e81]/90 gap-2">
            <Edit className="h-4 w-4" />
            Edit Agent
          </Button>
        </Link>
      </div>
    </div>
  );
}
