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
  BarChart,
  FileText,
  ClipboardList,
  Users,
  Briefcase,
  GraduationCap,
  MapPin,
  FolderKanban,
  Lightbulb,
  Settings,
  ShieldAlert,
  HelpCircle,
  LogOut,
  Crown,
  DollarSign,
  Tag,
  UserCircle,
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

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const { userName, userEmail } = useMemo(() => {
    const user = authService.getCurrentUser();
    return {
      userName: user?.name || user?.email?.split("@")[0] || "Administrator",
      userEmail: user?.email || "admin@example.com",
    };
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <Sidebar
      collapsible="offcanvas"
      className="bg-slate-900 border-r-0 selection:bg-amber-500/30 z-40"
    >
      <SidebarHeader className="h-20 border-b border-slate-800/50 bg-slate-900 sticky top-0 z-10 px-2 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-6">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-amber-400 to-amber-600 text-slate-900 shadow-lg shadow-amber-500/20">
            <Crown className="h-6 w-6 stroke-[2.5px]" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-semibold text-slate-100 tracking-tight text-lg">
              MP Portal
            </span>
            <span className="text-[10px] text-amber-500/80 font-medium mt-1">
              Admin Hub
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-slate-900 px-3 custom-scrollbar">
        {/* System Overview */}
        <SidebarGroup className="py-4">
          <SidebarGroupLabel className="text-slate-500 font-semibold text-[11px] px-4 mb-2 uppercase tracking-wider">
            System Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {[
                { title: "Dashboard", icon: LayoutDashboard, href: "/admin-dashboard" },
                { title: "Analytics", icon: BarChart, href: "/admin-dashboard/analytics" },
                { title: "Reports", icon: FileText, href: "/admin-dashboard/reports" },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="text-slate-500 font-semibold text-[11px] px-4 mb-2 uppercase tracking-wider">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {[
                { title: "Issues", icon: ClipboardList, href: "/admin-dashboard/issues" },
                { title: "Users", icon: Users, href: "/admin-dashboard/users" },
                { title: "Youth Records", icon: GraduationCap, href: "/admin-dashboard/youth" },
                { title: "Locations", icon: MapPin, href: "/admin-dashboard/locations" },
                { title: "Sectors", icon: Tag, href: "/admin-dashboard/sectors" },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content & Projects */}
        <SidebarGroup className="py-2">
          <SidebarGroupLabel className="text-slate-500 font-semibold text-[11px] px-4 mb-2 uppercase tracking-wider">
            Content & Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {[
                { title: "Projects", icon: FolderKanban, href: "/admin-dashboard/projects" },
                { title: "Employment", icon: Briefcase, href: "/admin-dashboard/employment" },
                { title: "Ideas & Suggestions", icon: Lightbulb, href: "/admin-dashboard/ideas" },
                { title: "Finance", icon: DollarSign, href: "/admin-dashboard/finance" },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Administration */}
        <SidebarGroup className="mt-auto py-2">
          <SidebarGroupLabel className="text-slate-500 font-semibold text-[11px] px-4 mb-2 uppercase tracking-wider">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {[
                { title: "System Settings", icon: Settings, href: "/admin-dashboard/system-settings" },
                { title: "Audit Logs", icon: ShieldAlert, href: "/admin-dashboard/audit" },
                { title: "Profile", icon: UserCircle, href: "/admin-dashboard/profile" },
                { title: "Help & Support", icon: HelpCircle, href: "/admin-dashboard/help" },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    className="h-11 px-4 text-slate-400 data-[active=true]:bg-amber-500 data-[active=true]:text-slate-950 data-[active=true]:font-semibold hover:bg-slate-800 hover:text-slate-100 transition-all duration-200 rounded-lg group"
                  >
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5 group-data-[active=true]:text-slate-950" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                  again to access the admin dashboard.
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
