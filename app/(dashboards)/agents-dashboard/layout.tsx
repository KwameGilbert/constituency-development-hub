import { AgentSidebar } from "@/components/agent-dashboard/AgentSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AgentSidebar />
      <main className="w-full">
        <section>{children}</section>
      </main>
    </SidebarProvider>
  );
}
