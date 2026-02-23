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
  // Shield,    // Commented out: Officers page disabled
  Briefcase,
  GraduationCap,
  MapPin,
  FolderKanban,
  Lightbulb,
  Settings,
  ShieldAlert,
  UserCircle,
  HelpCircle,
  LogOut,
  Crown,
  Star,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

  // Helper to determine if a link is active
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <Sidebar
      className="bg-white border-r border-gray-200 text-gray-700"
      collapsible="icon"
    >
      {/* Sidebar Header */}
      <SidebarHeader className="h-20 border-b border-red-800 bg-red-900">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Crown className="text-red-900 w-5 h-5" />
            </div>
            {/* Admin badge */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
              <Star className="text-white w-2.5 h-2.5" />
            </div>
          </div>
          <div className="overflow-hidden">
            <h3 className="text-white font-semibold truncate">Admin Portal</h3>
            <p className="text-red-100 text-xs truncate">Super Administrator</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white font-inter">
        {/* System Overview */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mt-2">
            System Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Dashboard"
                  className={`px-4 py-2.5 h-auto text-sm transition-all duration-200 ease-in-out ${
                    isActive("/admin-dashboard") &&
                    pathname === "/admin-dashboard"
                      ? "bg-red-900 text-white font-medium shadow-lg hover:bg-red-800 hover:text-white"
                      : "text-gray-600 hover:bg-red-100 hover:text-red-900"
                  }`}
                >
                  <Link href="/admin-dashboard">
                    <LayoutDashboard className="w-5 h-5 mr-3" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Analytics"
                  className={`px-4 py-2.5 h-auto text-sm transition-all duration-200 ease-in-out ${
                    isActive("/admin-dashboard/analytics")
                      ? "bg-red-900 text-white font-medium shadow-lg hover:bg-red-800 hover:text-white"
                      : "text-gray-600 hover:bg-red-100 hover:text-red-900"
                  }`}
                >
                  <Link href="/admin-dashboard/analytics">
                    <BarChart className="w-5 h-5 mr-3" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Reports"
                  className={`px-4 py-2.5 h-auto text-sm transition-all duration-200 ease-in-out ${
                    isActive("/admin-dashboard/reports")
                      ? "bg-red-900 text-white font-medium shadow-lg hover:bg-red-800 hover:text-white"
                      : "text-gray-600 hover:bg-red-100 hover:text-red-900"
                  }`}
                >
                  <Link href="/admin-dashboard/reports">
                    <FileText className="w-5 h-5 mr-3" />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mt-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {[
                {
                  title: "Issues",
                  icon: ClipboardList,
                  href: "/admin-dashboard/issues",
                },
                { title: "Users", icon: Users, href: "/admin-dashboard/users" },
                // {
                //   title: "Officers",
                //   icon: Shield,
                //   href: "/admin-dashboard/officers",
                // },
                // {
                //   title: "Field Agents",
                //   icon: Briefcase,
                //   href: "/admin-dashboard/agents",
                // },
                {
                  title: "Youth Records",
                  icon: GraduationCap,
                  href: "/admin-dashboard/youth",
                },
                {
                  title: "Locations",
                  icon: MapPin,
                  href: "/admin-dashboard/locations",
                },
                {
                  title: "Sectors",
                  icon: Tag,
                  href: "/admin-dashboard/sectors",
                },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`px-4 py-2.5 h-auto text-sm transition-all duration-200 ease-in-out ${
                      isActive(item.href)
                        ? "bg-red-900 text-white font-medium shadow-lg hover:bg-red-800 hover:text-white"
                        : "text-gray-600 hover:bg-red-100 hover:text-red-900"
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content & Projects */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mt-2">
            Content & Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {[
                {
                  title: "Projects",
                  icon: FolderKanban,
                  href: "/admin-dashboard/projects",
                },
                {
                  title: "Employment",
                  icon: Briefcase,
                  href: "/admin-dashboard/employment",
                },
                {
                  title: "Ideas & Suggestions",
                  icon: Lightbulb,
                  href: "/admin-dashboard/ideas",
                },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`px-4 py-2.5 h-auto text-sm transition-all duration-200 ease-in-out ${
                      isActive(item.href)
                        ? "bg-red-900 text-white font-medium shadow-lg hover:bg-red-800 hover:text-white"
                        : "text-gray-600 hover:bg-red-100 hover:text-red-900"
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System Administration */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mt-2">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {[
                {
                  title: "System Settings",
                  icon: Settings,
                  href: "/admin-dashboard/system-settings",
                },
                {
                  title: "Audit Logs",
                  icon: ShieldAlert,
                  href: "/admin-dashboard/audit",
                },
                {
                  title: "Profile",
                  icon: UserCircle,
                  href: "/admin-dashboard/profile",
                },
                {
                  title: "Help & Support",
                  icon: HelpCircle,
                  href: "/admin-dashboard/help",
                },
              ].map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    className={`px-4 py-2.5 h-auto text-sm transition-all duration-200 ease-in-out ${
                      isActive(item.href)
                        ? "bg-red-900 text-white font-medium shadow-lg hover:bg-red-800 hover:text-white"
                        : "text-gray-600 hover:bg-red-100 hover:text-red-900"
                    }`}
                  >
                    <Link href={item.href}>
                      <item.icon className="w-5 h-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-red-900 border-t border-red-800 p-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-900">
                <UserCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">
                {userName}
              </p>
              <p className="text-xs text-red-100 truncate">{userEmail}</p>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="p-2 rounded-lg text-white hover:text-red-900 hover:bg-white transition-colors flex-shrink-0">
                <LogOut className="w-4 h-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to log out? You will need to sign in
                  again to access the admin dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
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
