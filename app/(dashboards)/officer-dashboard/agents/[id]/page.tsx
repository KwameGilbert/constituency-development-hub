import { AgentsHeader } from "@/components/officer-dashboard/agents/AgentsHeader";
import { AgentDetails } from "@/components/officer-dashboard/agents/AgentDetails";

export default async function AgentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      <AgentsHeader />
      <main className="flex-1 p-3 sm:p-4 pb-6">
        <div className="max-w-5xl mx-auto space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AgentDetails agentId={id} />
        </div>
      </main>
    </div>
  );
}
