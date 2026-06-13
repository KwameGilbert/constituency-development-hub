import { AgentsHeader } from "@/components/officer-dashboard/agents/AgentsHeader";
import { EditAgentForm } from "@/components/officer-dashboard/agents/EditAgentForm";

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      <AgentsHeader />
      <main className="flex-1 pb-20">
        <EditAgentForm agentId={id} />
      </main>
    </div>
  );
}
