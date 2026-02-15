import { AgentSidebar } from "@/components/agent-dashboard/AgentSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["agent"]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "18rem",
          } as React.CSSProperties
        }
      >
        <AgentSidebar />
        <main className="w-full">
          <section>{children}</section>
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
