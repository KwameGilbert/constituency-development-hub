import { OfficerSidebar } from "./sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <OfficerSidebar />
      <SidebarInset className="w-full">
        <section>{children}</section>
      </SidebarInset>
    </SidebarProvider>
  );
}
