"use client"

import * as React from "react"
import {
    FileText,
    HelpCircle,
    LayoutDashboard,
    LogOut,
    Users,
    FileBarChart,
    ShieldUser,
    ChartLine,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"

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
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
]

export function OfficerSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

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
                    <SidebarGroupLabel className="text-gray-500">MAIN NAVIGATION</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0">
                            {items.map((item) => {
                                const isActive = pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive} tooltip={item.title} className={isActive ? "!bg-indigo-700 !text-white !hover:bg-indigo-800 !hover:text-white h-11 py-3" : "h-11"}>
                                            <Link href={item.url} className="flex items-center gap-3">
                                                <item.icon className="size-6" />
                                                <span className="text-base">{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
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
                            <AvatarFallback className="text-blue-600">OR</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                            <span className="truncate font-semibold">   Officer.Rock</span>
                            <span className="truncate text-xs text-muted-foreground">officer.rock@kofibenteh.com</span>
                        </div>
                        <LogOut className="ml-auto size-4 text-muted-foreground hover:text-foreground cursor-pointer" />
                    </div>
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
