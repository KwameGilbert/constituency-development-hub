"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { DashboardHeader } from "./dashboard-header";
import { Button } from "@/components/ui/button";
import { List, Plus } from "lucide-react";
import { MetricsCards } from "@/components/officer-dashboard/MetricsCards";
import { IssuesByStatus } from "@/components/officer-dashboard/charts/IssuesByStatus";
import { IssueBreakdown } from "@/components/officer-dashboard/charts/IssueBreakdown";
import { RecentIssuesSummary } from "@/components/officer-dashboard/RecentIssuesSummary";
import { authService } from "@/lib/services/auth-service";

function OfficerMainDashboardPage() {
  const userName = useMemo(() => {
    const user = authService.getCurrentUser();
    return user?.name || user?.email?.split("@")[0] || "Officer";
  }, []);
  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 overflow-y-auto custom-scrollbar">
      <DashboardHeader title="Dashboard" subtitle={`Welcome back, ${userName}`}>
        <Button className="bg-indigo-700 hover:bg-indigo-800" asChild>
          <Link href="/officer-dashboard/issues">
            <List className="mr-2 h-4 w-4" />
            Issues
          </Link>
        </Button>
        <Button className="bg-indigo-700 hover:bg-indigo-800" asChild>
          <Link href="/officer-dashboard/issues/add">
            <Plus className="mr-2 h-4 w-4" />
            New Issue
          </Link>
        </Button>
      </DashboardHeader>
      <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6 pb-20">
        <MetricsCards />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <IssuesByStatus />
          <IssueBreakdown />
        </div>

        <RecentIssuesSummary />
      </div>
    </div>
  );
}

export default OfficerMainDashboardPage;
