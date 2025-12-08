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
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AgentSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-white border-r border-slate-200">
      <SidebarHeader className="h-16 border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-900">Agent Portal</span>
            <span className="text-xs text-slate-500">Welcome back</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>MAIN NAVIGATION</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/agents-dashboard"}
                  className="data-[active=true]:bg-slate-900 data-[active=true]:text-white hover:bg-slate-100 hover:text-slate-900"
                >
                  <Link href="/agents-dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/agents-dashboard/issues")}
                  className="data-[active=true]:bg-slate-900 data-[active=true]:text-white hover:bg-slate-100 hover:text-slate-900"
                >
                  <Link href="/agents-dashboard/issues">
                    <FileText />
                    <span>Issues</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>ACCOUNT</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/agents-dashboard/settings"}
                  className="data-[active=true]:bg-slate-900 data-[active=true]:text-white hover:bg-slate-100 hover:text-slate-900"
                >
                  <Link href="/agents-dashboard/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">
                Agent.Rock
              </span>
              <span className="text-xs text-slate-500">
                agent.rock@kofibenteh.com
              </span>
            </div>
          </div>
          <button className="text-slate-500 hover:text-slate-900">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
