import { AgentSettings } from "@/components/agent-dashboard/settings/AgentSettings";
import AgentDashboardHeader from "@/components/agent-dashboard/AgentDashboardHeader";
import React from "react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AgentDashboardHeader />
      <div className="flex-1 p-4 sm:p-6">
        <AgentSettings />
      </div>
    </div>
  );
}
