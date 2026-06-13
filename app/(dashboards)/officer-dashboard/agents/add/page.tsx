import { AgentsHeader } from "@/components/officer-dashboard/agents/AgentsHeader";
import { AddAgentForm } from "@/components/officer-dashboard/agents/AddAgentForm";

export default function AddAgentPage() {
  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      <AgentsHeader />
      <main className="flex-1 pb-20">
        <AddAgentForm />
      </main>
    </div>
  );
}
