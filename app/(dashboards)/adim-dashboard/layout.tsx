import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/appsidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar navItems={[]} />
      <main className="w-full h-screen flex flex-col overflow-hidden">
        <SidebarInset className="w-full">
          <AppHeader />
          <section>{children}</section>
        </SidebarInset>
      </main>
    </SidebarProvider>
  );
}
