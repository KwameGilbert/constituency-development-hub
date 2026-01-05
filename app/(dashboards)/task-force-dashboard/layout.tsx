import AppHeader from "@/components/app-header";
import { AppSidebar } from "@/components/appsidebar";
import { Home, FileText, BarChart3, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";

const taskForceNavItems = [
  {
    label: "Dashboard",
    href: "/task-force-dashboard/dashboard",
    icon: <Home className="h-4 w-4" />,
  },
  {
    label: "Pending Issues",
    href: "/task-force-dashboard/pending",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    label: "Under Assessment",
    href: "/task-force-dashboard/under-assessment",
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    label: "All Issues",
    href: "/task-force-dashboard/issues",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    label: "Reports",
    href: "/task-force-dashboard/reports",
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    label: "Team",
    href: "/task-force-dashboard/team",
    icon: <Users className="h-4 w-4" />,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-64 flex-shrink-0">
        <AppSidebar navItems={taskForceNavItems} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-shrink-0">
          <AppHeader />
        </div>
        <main className="flex-1 overflow-y-auto p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
