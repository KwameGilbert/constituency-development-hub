"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Image as ImageIcon,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export function WebAdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="bg-violet-950 border-r border-violet-900 text-white" collapsible="icon">
      <SidebarHeader className="h-16 border-b border-violet-900 bg-violet-950">
        <div className="flex items-center gap-3 px-4 py-2">
            {/* Placeholder for Coat of Arms */}
          <div className="flex h-8 w-8 items-center justify-center">
             <span className="text-2xl">🇬🇭</span> 
          </div>
          <span className="font-bold text-lg text-white">Admin Panel</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-violet-950">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/web-admin-dashboard"}
                  className="text-violet-200 hover:bg-violet-900 hover:text-white data-[active=true]:bg-violet-600 data-[active=true]:text-white"
                >
                  <Link href="/web-admin-dashboard">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/web-admin-dashboard/blog")}
                  className="text-violet-200 hover:bg-violet-900 hover:text-white data-[active=true]:bg-violet-600 data-[active=true]:text-white"
                >
                  <Link href="/web-admin-dashboard/blog">
                    <FileText />
                    <span>Blog Posts</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/web-admin-dashboard/events")}
                  className="text-violet-200 hover:bg-violet-900 hover:text-white data-[active=true]:bg-violet-600 data-[active=true]:text-white"
                >
                  <Link href="/web-admin-dashboard/events">
                    <Calendar />
                    <span>Events</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith("/web-admin-dashboard/carousel")}
                  className="text-violet-200 hover:bg-violet-900 hover:text-white data-[active=true]:bg-violet-600 data-[active=true]:text-white"
                >
                  <Link href="/web-admin-dashboard/carousel">
                    <ImageIcon />
                    <span>Carousel</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
            <div className="px-4 py-2 text-xs font-semibold text-violet-400 uppercase tracking-wider">
                Settings
            </div>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/web-admin-dashboard/profile"}
                  className="text-violet-200 hover:bg-violet-900 hover:text-white data-[active=true]:bg-violet-600 data-[active=true]:text-white"
                >
                  <Link href="/web-admin-dashboard/profile">
                    <User />
                    <span>Profile</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-red-300 hover:bg-violet-900 hover:text-red-200"
                >
                  <LogOut />
                  <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-violet-950 border-t border-violet-900 p-4">
        {/* Footer content if needed */}
      </SidebarFooter>
    </Sidebar>
  );
}
