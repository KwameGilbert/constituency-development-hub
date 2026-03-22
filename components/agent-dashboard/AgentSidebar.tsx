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
  FileText,
  Settings,
  LogOut,
  User,
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

export function AgentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { userName, userEmail } = useMemo(() => {
    const user = authService.getCurrentUser();
    return {
      userName: user?.name || user?.email?.split("@")[0] || "Agent",
      userEmail: user?.email || "agent@example.com",
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
            <User className="h-6 w-6 stroke-[2.5px]" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-slate-100 tracking-tight text-lg">
              Agent Portal
            </span>
            <span className="text-[10px] text-amber-500/80 font-medium mt-1">
              Sefwi Wiawso Hub
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-900 px-3">
        <SidebarGroup className="py-6">
          <SidebarGroupLabel className="text-slate-500 font-semibold text-[11px] px-4 mb-2">
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/agents-dashboard"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/agents-dashboard">
                    <LayoutDashboard className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/agents-dashboard/issues")}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/agents-dashboard/issues">
                    <FileText className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Issues & Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 font-semibold text-[11px] px-4 mb-2">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/agents-dashboard/settings"}
                  className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                >
                  <Link href="/agents-dashboard/settings">
                    <Settings className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                    <span className="text-sm">Profile Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-800/50 bg-slate-900 p-4">
        <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-800/40 border border-slate-700/30">
          <div className="flex items-center gap-3 overflow-hidden">
            <Avatar className="h-9 w-9 shrink-0 ring-2 ring-slate-700/50">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback className="bg-amber-500 text-slate-950 font-semibold text-xs capitalize">
                {userName.slice(0, 2).toLowerCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="truncate text-xs font-semibold text-slate-100 capitalize">
                {userName}
              </span>
              <span className="truncate text-[10px] text-slate-400">
                {userEmail}
              </span>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="shrink-0 p-2 text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400 rounded-lg">
                <LogOut className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-slate-900 border-slate-800 text-slate-100">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Confirm Logout
                </AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Are you sure you want to log out? You will need to sign in
                  again to access your dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-100 hover:bg-slate-700">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
