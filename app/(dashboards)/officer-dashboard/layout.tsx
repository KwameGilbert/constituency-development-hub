import { OfficerSidebar } from "./sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['officer']}>
      <SidebarProvider>
        <OfficerSidebar />
        <SidebarInset className="w-full">
          <section>{children}</section>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
