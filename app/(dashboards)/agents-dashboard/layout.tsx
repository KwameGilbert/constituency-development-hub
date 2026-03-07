import { AgentSidebar } from "@/components/agent-dashboard/AgentSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["agent"]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "20rem",
          } as React.CSSProperties
        }
      >
        <AgentSidebar />
        <main className="w-full bg-slate-50/50 min-h-screen">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
