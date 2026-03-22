import { SidebarProvider } from "@/components/ui/sidebar";
import { WebAdminSidebar } from "@/components/web-admin-dashboard/WebAdminSidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function WebAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["web_admin"]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "20rem",
          } as React.CSSProperties
        }
      >
        <WebAdminSidebar />
        <main className="w-full bg-slate-50/50 h-screen overflow-hidden flex flex-col">
          <div className="flex-1 relative overflow-y-auto max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
