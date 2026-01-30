"use client";

import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { AllIssues } from "../../../../components/officer-dashboard/issues/AllIssues";
import { IssuesStats } from "@/components/admin-dashboard/issues/IssuesStats";
import {
  BarChart3,
  FileText,
  UserCircle,
  ShieldAlert,
  Settings2,
  LogOut,
} from "lucide-react";

export default function AdminIssuesPage() {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="All Issues"
        description="System-wide issues overview and management"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          {
            label: "Reports",
            href: "/admin-dashboard/reports",
            icon: FileText,
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
            label: "Analytics",
            href: "/admin-dashboard/analytics",
            icon: BarChart3,
            className: "bg-red-900 text-white hover:bg-red-800 shadow-sm",
          },
        ]}
      />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Issue Statistics */}
        <IssuesStats />

        {/* Reusing AllIssues in Read-Only Mode */}
        {/* The user requested to import issues from officer dashboard and admin can only VIEW issues */}
        <AllIssues readOnly={true} />
      </div>
    </div>
  );
}
