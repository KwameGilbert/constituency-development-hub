import { AdminSidebar } from "@/components/admin-dashboard/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="w-full bg-slate-50">
          <section className="flex flex-col h-full">{children}</section>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
