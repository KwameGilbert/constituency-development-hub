import { AgentSettings } from "@/components/agent-dashboard/settings/AgentSettings";
import AgentDashboardHeader from "@/components/agent-dashboard/AgentDashboardHeader";
import React from "react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      <AgentDashboardHeader />
      <div className="p-6">
        <AgentSettings />
      </div>
    </div>
  );
}
