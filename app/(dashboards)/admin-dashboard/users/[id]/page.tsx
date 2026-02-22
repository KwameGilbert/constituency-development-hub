"use client";

import { use } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { UserProfile } from "@/components/admin-dashboard/users/UserProfile";
import {
  Edit,
  UserX,
  ArrowLeft,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
} from "lucide-react";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="User Profile"
        description="Admin.Rock"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          { label: "Deactivate User", icon: UserX, className: "text-gray-700" },
          {
            label: "Back to Users",
            href: "/admin-dashboard/users",
            icon: ArrowLeft,
          },
          {
            label: "Profile Settings",
            href: "/admin-dashboard/profile",
            icon: UserCircle,
          },
          {
            label: "Audit Logs",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
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
        ]}
        actionButtons={[
          {
            label: "Edit User",
            href: `/admin-dashboard/users/${id}/edit`,
            icon: Edit,
            className: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <UserProfile />
      </div>
    </div>
  );
}
