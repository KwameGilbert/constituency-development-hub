import { AgentsHeader } from "@/components/officer-dashboard/agents/AgentsHeader";
import { AddAgentForm } from "@/components/officer-dashboard/agents/AddAgentForm";

export default function AddAgentPage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-50/50">
      <AgentsHeader />
      <main className="flex-1">
        <AddAgentForm />
      </main>
    </div>
  );
}
