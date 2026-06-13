"use client";

import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { HelpSections } from "@/components/officer-dashboard/help/HelpSections";
import { HelpCircle, ShieldAlert, LogOut } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 overflow-hidden">
      <AdminHeader
        title="Intelligence Center"
        description="Unified documentation hub, operational guidance, and strategic support registry"
        roleAbbr="MP"
        dropdownItems={[
          {
            label: "System Audit",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-500 font-bold",
          },
        ]}
      />

      <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-[1600px] mx-auto w-full space-y-8">
           <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
            <div>
              <h2 className="text-3xl font-bold text-slate-950 tracking-tight flex items-center gap-3">
                Knowledge Matrix
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                Access administrative protocols and operational training documentation
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-[32px] shadow-md shadow-slate-200/40 overflow-hidden border border-slate-50">
             <div className="p-2">
                <HelpSections />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
