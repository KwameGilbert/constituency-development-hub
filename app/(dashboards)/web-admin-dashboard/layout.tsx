import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { WebAdminSidebar } from "@/components/web-admin-dashboard/WebAdminSidebar";

export default function WebAdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <WebAdminSidebar />
      <SidebarInset className="bg-slate-50">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
