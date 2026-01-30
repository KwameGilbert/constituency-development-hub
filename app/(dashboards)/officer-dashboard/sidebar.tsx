"use client";

import * as React from "react";
import { useMemo } from "react";
import {
  FileText,
  HelpCircle,
  LogOut,
  Users,
  FileBarChart,
  ShieldUser,
  ChartLine,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

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
  SidebarRail,
} from "@/components/ui/sidebar";
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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/officer-dashboard",
    icon: ChartLine,
  },
  {
    title: "Issues",
    url: "/officer-dashboard/issues",
    icon: FileText,
  },
  {
    title: "Agents",
    url: "/officer-dashboard/agents",
    icon: Users,
  },
  {
    title: "Reports",
    url: "/officer-dashboard/reports",
    icon: FileBarChart,
  },
  {
    title: "Profile",
    url: "/officer-dashboard/profile",
    icon: ShieldUser,
  },
  {
    title: "Help",
    url: "/officer-dashboard/help",
    icon: HelpCircle,
  },
];

export function OfficerSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-indigo-700 text-sidebar-primary-foreground">
            <ShieldUser className="size-6" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <h3 className="text-gray-800 font-semibold">Officer Portal</h3>
            <p className="text-gray-500 text-xs">Welcome back</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500">
            MAIN NAVIGATION
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0">
              {items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={
                        isActive
                          ? "!bg-indigo-700 !text-white !hover:bg-indigo-800 !hover:text-white h-11 py-3"
                          : "h-11"
                      }
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <item.icon className="size-6" />
                        <span className="text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/10 p-3">
            <Avatar className="h-10 w-10 rounded-full bg-blue-100">
              <AvatarImage src="/avatars/officer.png" alt="Officer" />
              <AvatarFallback className="text-blue-600">
                {userName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-semibold">{userName}</span>
              <span className="truncate text-xs text-muted-foreground">
                {userEmail}
              </span>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="ml-auto">
                  <LogOut className="size-4 text-muted-foreground hover:text-red-600 cursor-pointer transition-colors" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to log out? You will need to sign in
                    again to access your dashboard.
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
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
