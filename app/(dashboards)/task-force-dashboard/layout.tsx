"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { TaskForceSidebar } from "@/components/task-force-dashboard/TaskForceSidebar";
import TaskForceDashboardHeader from "@/components/task-force-dashboard/TaskForceDashboardHeader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={["task_force"]}>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <TaskForceSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TaskForceDashboardHeader />
            <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
