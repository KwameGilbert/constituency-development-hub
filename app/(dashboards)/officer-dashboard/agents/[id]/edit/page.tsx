import React from "react";
import { EditAgentHeader } from "@/components/officer-dashboard/agents/EditAgentHeader";
import { EditAgentForm } from "@/components/officer-dashboard/agents/EditAgentForm";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <EditAgentHeader agentId={id} />
      <div className="p-6">
        <EditAgentForm agentId={id} />
      </div>
    </div>
  );
}
