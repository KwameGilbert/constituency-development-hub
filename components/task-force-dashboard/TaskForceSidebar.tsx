"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Clock,
  AlertCircle,
  FileText,
  BarChart3,
  Users,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { authService } from "@/lib/services/auth-service";
import { useMemo } from "react";

export function TaskForceSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { userName, userEmail } = useMemo(() => {
    const user = authService.getCurrentUser();
    return {
      userName: user?.name || user?.email?.split("@")[0] || "Officer",
      userEmail: user?.email || "officer@example.com",
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-slate-900 border-r-0 selection:bg-amber-500/30 z-40"
    >
      <SidebarHeader className="h-20 border-b border-slate-800/50 bg-slate-900 sticky top-0 z-10 px-2 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/20">
            <BarChart3 className="h-6 w-6 stroke-[2.5px]" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-slate-100 tracking-tight text-lg">
              Task Force
            </span>
            <span className="text-[10px] text-amber-500/80 font-medium mt-1">
              Resolution Hub
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-900 px-3">
        <SidebarGroup className="py-6">
          <SidebarGroupLabel className="text-slate-500 font-semibold text-[11px] px-4 mb-2 uppercase tracking-wider">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/task-force-dashboard/dashboard"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/task-force-dashboard/dashboard">
                    <LayoutDashboard className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/task-force-dashboard/pending"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/task-force-dashboard/pending">
                    <Clock className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Pending Issues</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/task-force-dashboard/under-assessment"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/task-force-dashboard/under-assessment">
                    <AlertCircle className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Under Assessment</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/task-force-dashboard/issues"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/task-force-dashboard/issues">
                    <FileText className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">All Issues</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/task-force-dashboard/reports"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/task-force-dashboard/reports">
                    <BarChart3 className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/task-force-dashboard/team"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/task-force-dashboard/team">
                    <Users className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Team</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-6">
          <SidebarGroupLabel className="text-slate-500 font-semibold text-[11px] px-4 mb-2">
            Personal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/task-force-dashboard/profile"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/task-force-dashboard/profile">
                    <User className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/task-force-dashboard/settings"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/task-force-dashboard/settings">
                    <Settings className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-slate-900 border-t border-slate-800/50 px-3 py-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <SidebarMenuButton className="h-11 px-4 text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all duration-200 rounded-lg data-[active=true]:text-red-400">
              <LogOut className="h-5 w-5" />
              <span className="text-sm">Logout</span>
            </SidebarMenuButton>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will need to login again to access the dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <div className="flex items-center gap-3 px-2 py-2 mt-4 border-t border-slate-800/50 pt-4">
          <Avatar className="h-8 w-8 ring-2 ring-slate-700">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="bg-amber-500 text-slate-950 font-bold text-xs">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-slate-100 truncate">{userName}</p>
            <p className="text-[10px] text-slate-400 truncate">{userEmail}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
