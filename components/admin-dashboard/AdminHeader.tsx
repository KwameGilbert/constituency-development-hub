"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  Crown,
  User,
  Settings,
  ShieldAlert,
  LogOut,
  UserCircle,
  RefreshCw,
  Settings2,
} from "lucide-react";
import Link from "next/link";

interface ActionButton {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

interface DropdownItemConfig {
  label: string;
  href?: string;
  count?: number;
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
}

interface AdminHeaderProps {
  title: string;
  description?: string;
  roleAbbr?: string;
  userName?: string;
  userRoleLabel?: string;
  actionButtons?: ActionButton[];
  dropdownItems?: DropdownItemConfig[];
}

export function AdminHeader({
  title,
  description,
  roleAbbr = "MP",
  userName = "Administrator",
  userRoleLabel = "Member of Parliament",
  actionButtons = [],
  dropdownItems,
}: AdminHeaderProps) {
  const primaryButton = actionButtons[0];

  const defaultDropdownItems: DropdownItemConfig[] = [
    {
      label: "Refresh Data",
      icon: RefreshCw,
      onClick: () => console.log("Refresh"),
    },
    { label: "Settings", href: "/admin-dashboard/settings", icon: Settings },
    {
      label: "Profile Settings",
      href: "/admin-dashboard/profile",
      icon: UserCircle,
    },
    { label: "Logout", icon: LogOut, className: "text-red-500 focus:text-red-500 focus:bg-red-50" },
  ];

  const itemsToRender = dropdownItems || defaultDropdownItems;

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm sticky top-0 z-30">
      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-slate-600 hover:text-amber-600 hover:bg-amber-50" />
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: '#1e1b4b' }}>
                {title}
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-widest border border-amber-600/20">
                <Crown className="mr-1 w-3 h-3 text-slate-950" />
                {roleAbbr}
              </span>
            </div>
            {description && (
              <p className="text-base font-normal text-muted-foreground mt-1 hidden sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {primaryButton && (
            <div className="hidden xl:flex items-center">
              <Button
                asChild={!!primaryButton.href}
                onClick={primaryButton.onClick}
                className={`h-10 px-4 text-sm font-medium rounded-xl transition-all duration-200 ${
                  primaryButton.className || "bg-amber-500 text-slate-950 hover:bg-amber-600 shadow-md shadow-amber-500/20"
                }`}
              >
                {primaryButton.href ? (
                  <Link href={primaryButton.href}>
                    {primaryButton.icon && <primaryButton.icon className="w-4 h-4 mr-2" />}
                    <span>{primaryButton.label}</span>
                  </Link>
                ) : (
                  <>
                    {primaryButton.icon && <primaryButton.icon className="w-4 h-4 mr-2" />}
                    <span>{primaryButton.label}</span>
                  </>
                )}
              </Button>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center space-x-2 p-1.5 pr-3 text-slate-600 hover:bg-slate-100 rounded-full transition-all outline-none">
                <div className="w-8 h-8 rounded-full bg-linear-to-br from-amber-400 to-amber-600 p-0.5 shadow-sm">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <User className="text-amber-500 w-4 h-4" />
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 mt-2 p-2 rounded-2xl shadow-xl border-slate-200" align="end">
              <DropdownMenuLabel className="p-3">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-slate-900 leading-none">
                    {userName}
                  </p>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-amber-600">
                    {userRoleLabel}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-100" />
              
              <DropdownMenuGroup className="p-1">
                {itemsToRender
                  .filter((item) => item.label !== "Logout")
                  .map((item, idx) => (
                    <DropdownMenuItem
                      key={idx}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-slate-600 focus:bg-slate-50 focus:text-slate-900"
                      asChild={!!item.href}
                      onClick={item.onClick}
                    >
                      {item.href ? (
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      ) : (
                        <div>
                          <item.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                      )}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator className="bg-slate-100" />
              
              <DropdownMenuItem
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-red-500 focus:bg-red-50 focus:text-red-700 font-medium"
                onClick={() => itemsToRender.find(i => i.label === "Logout")?.onClick?.()}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
