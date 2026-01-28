import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WebAdminSidebar } from "@/components/web-admin-dashboard/WebAdminSidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function WebAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["web_admin"]}>
      <SidebarProvider>
        <WebAdminSidebar />
        <SidebarInset className="bg-slate-50">{children}</SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
