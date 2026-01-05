import React from "react";
import { DashboardHeader } from "./dashboard-header";
import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";
import { MetricsCards } from "@/components/officer-dashboard/MetricsCards";
import { IssuesByStatus } from "@/components/officer-dashboard/charts/IssuesByStatus";
import { IssueBreakdown } from "@/components/officer-dashboard/charts/IssueBreakdown";
import { RecentIssuesSummary } from "@/components/officer-dashboard/RecentIssuesSummary";

function OfficerMainDashboardPage() {
  return (
    <div>
      <DashboardHeader
        title="Dashboard"
        subtitle="Welcome back, Officer.Rock"
      >
        <Button className="bg-indigo-700 hover:bg-indigo-800">
          <List className="mr-2 h-4 w-4" />
          Issues
        </Button>
        <Button className="bg-indigo-700 hover:bg-indigo-800">
          <Plus className="mr-2 h-4 w-4" />
          New Issue
        </Button>
      </DashboardHeader>
      <div className="p-4 space-y-8 bg-gray-100">
        <MetricsCards />
        <div className="grid grid-cols-2 gap-4">
          <IssuesByStatus />
          <IssueBreakdown />
        </div>

        <RecentIssuesSummary/>
      </div>    
    </div>
  );
}

export default OfficerMainDashboardPage;
