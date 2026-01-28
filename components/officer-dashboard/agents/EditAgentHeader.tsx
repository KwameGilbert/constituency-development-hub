import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditAgentHeaderProps {
  agentName?: string;
  agentId?: string;
}

export function EditAgentHeader({
  agentName = "Agent.Rock",
  agentId = "1",
}: EditAgentHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-[#1e1b4b]">
          Edit Agent: {agentName}
        </h1>
        <p className="text-muted-foreground">
          Update agent information and settings
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link href={`/officer-dashboard/agents/${agentId}`}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Agent
          </Button>
        </Link>
      </div>
    </div>
  );
}
