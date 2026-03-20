import { AgentsHeader } from "@/components/officer-dashboard/agents/AgentsHeader";
import { AgentDetails } from "@/components/officer-dashboard/agents/AgentDetails";

export default async function AgentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
      <AgentsHeader />
      <main className="flex-1 p-6 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <AgentDetails agentId={id} />
        </div>
      </main>
    </div>
  );
}
