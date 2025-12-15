"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { UserList } from "@/components/admin-dashboard/users/UserList";
import { UserPlus, BarChart3, FileText, UserCircle, ShieldAlert, Settings2, LogOut } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader 
        title="All Users" 
        description="System-wide user management"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
            { label: "Reports", href: "/admin-dashboard/reports", icon: FileText },
            { label: "Profile Settings", href: "/admin-dashboard/profile", icon: UserCircle },
            { label: "Audit Logs", href: "/admin-dashboard/audit", icon: ShieldAlert },
            { label: "System Settings", href: "/admin-dashboard/system-settings", icon: Settings2 },
            { label: "Logout", icon: LogOut, className: "text-red-600 focus:text-red-600 focus:bg-red-50" },
        ]}
        actionButtons={[
          { label: "Add New User", href: "/admin-dashboard/users/new", icon: UserPlus, className: "bg-red-900 text-white hover:bg-red-800 shadow-sm" }
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <UserList />
      </div>
    </div>
  );
}
