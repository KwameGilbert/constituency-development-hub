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
  count?: number; // For notifications or counts if needed later
  onClick?: () => void;
  icon: React.ComponentType<{ className?: string }>;
  className?: string; // To style text-red-600 etc
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
  roleAbbr = "SA",
  userName = "Administrator",
  userRoleLabel = "Super Admin",
  actionButtons = [],
  dropdownItems,
}: AdminHeaderProps) {
  const primaryButton = actionButtons[0];

  // Default dropdown items if none provided
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
    { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
    {
      label: "System Settings",
      href: "/admin-dashboard/system-settings",
      icon: Settings2,
    },
    {
      label: "Logout",
      icon: LogOut,
      className: "text-red-600 focus:text-red-600 focus:bg-red-50",
    },
  ];

  const itemsToRender = dropdownItems || defaultDropdownItems;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          {/* Mobile Sidebar Trigger - using SidebarTrigger from Shadcn which handles toggle */}
          <div className="lg:hidden mr-3">
            <SidebarTrigger className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors" />
          </div>

          <div className="flex items-center space-x-4">
            {/* Page Title and Description */}
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
                  {title}
                </h1>
                {/* Admin Role Badge */}
                <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-white">
                  <Crown className="mr-1 w-3 h-3 text-white" />
                  {roleAbbr}
                </span>
              </div>
              {description && (
                <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons and Admin Info */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Action Buttons - Primary Desktop */}
          {primaryButton && (
            <div className="hidden xl:flex items-center space-x-3">
              {primaryButton.href ? (
                <Link
                  href={primaryButton.href}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium ${
                    primaryButton.className ||
                    "bg-red-900 text-white hover:bg-red-800 shadow-sm"
                  }`}
                >
                  {primaryButton.icon && (
                    <primaryButton.icon className="w-3 h-3" />
                  )}
                  <span>{primaryButton.label}</span>
                </Link>
              ) : (
                <button
                  onClick={primaryButton.onClick}
                  className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 flex items-center space-x-2 font-medium ${
                    primaryButton.className ||
                    "bg-red-900 text-white hover:bg-red-800 shadow-sm"
                  }`}
                >
                  {primaryButton.icon && (
                    <primaryButton.icon className="w-3 h-3" />
                  )}
                  <span>{primaryButton.label}</span>
                </button>
              )}
            </div>
          )}

          {/* Admin Quick Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                id="adminMenuToggle"
                className="flex items-center space-x-2 px-2 py-2 text-sm text-gray-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors outline-none focus:ring-2 focus:ring-red-100"
              >
                <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center">
                  <User className="text-white w-3.5 h-3.5" />
                </div>
                <ChevronDown className="w-3 h-3 hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium text-gray-900 leading-none">
                    {userName}
                  </p>
                  <p className="text-xs leading-none text-gray-500">
                    {userRoleLabel}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Mobile Actions in Dropdown */}
              {actionButtons.length > 0 && (
                <DropdownMenuGroup className="xl:hidden">
                  {actionButtons.map((btn, idx) => (
                    <DropdownMenuItem key={idx} asChild={!!btn.href}>
                      {btn.href ? (
                        <Link
                          href={btn.href}
                          className="cursor-pointer flex items-center w-full"
                        >
                          {btn.icon ? (
                            <btn.icon className="mr-2 h-4 w-4" />
                          ) : null}
                          <span>{btn.label}</span>
                        </Link>
                      ) : (
                        <button
                          className="cursor-pointer flex items-center w-full outline-none select-none"
                          onClick={btn.onClick}
                        >
                          {btn.icon ? (
                            <btn.icon className="mr-2 h-4 w-4" />
                          ) : null}
                          <span>{btn.label}</span>
                        </button>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                </DropdownMenuGroup>
              )}

              <DropdownMenuGroup>
                {itemsToRender
                  .filter((item) => item.label !== "Logout")
                  .map((item, idx) => {
                    const content = (
                      <>
                        {item.icon ? (
                          <item.icon className="mr-2 h-4 w-4" />
                        ) : null}
                        <span>{item.label}</span>
                      </>
                    );

                    return (
                      <DropdownMenuItem
                        key={idx}
                        asChild={!!item.href}
                        className={`cursor-pointer ${item.className || ""}`}
                        onClick={item.onClick}
                      >
                        {item.href ? (
                          <Link href={item.href}>{content}</Link>
                        ) : (
                          <span>{content}</span>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              {(() => {
                const logoutItem: DropdownItemConfig = itemsToRender.find(
                  (item) => item.label === "Logout",
                ) || {
                  label: "Logout",
                  icon: LogOut,
                  className: "text-red-600 focus:text-red-600 focus:bg-red-50",
                  onClick: undefined,
                };
                const content = (
                  <>
                    {logoutItem.icon ? (
                      <logoutItem.icon className="mr-2 h-4 w-4" />
                    ) : null}
                    <span>{logoutItem.label}</span>
                  </>
                );
                return (
                  <DropdownMenuItem
                    className={`cursor-pointer ${logoutItem.className || ""}`}
                    onClick={logoutItem.onClick}
                  >
                    {/* Logout usually href="../login/logout.php" in php but here likely specific logic or link */}
                    {/* Defaulting to span content for now as nextjs auth varies */}
                    <span>{content}</span>
                  </DropdownMenuItem>
                );
              })()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
