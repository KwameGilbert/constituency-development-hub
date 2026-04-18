import { AdminSidebar } from "@/components/admin-dashboard/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "20rem",
          } as React.CSSProperties
        }
      >
        <AdminSidebar />
        <main className="w-full bg-slate-50/50 h-screen overflow-hidden">
          <div className="max-w-[1600px] mx-auto w-full h-full flex flex-col">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
