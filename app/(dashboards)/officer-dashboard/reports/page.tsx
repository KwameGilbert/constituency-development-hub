import React from "react";
import { ReportsHeader } from "@/components/officer-dashboard/reports/ReportsHeader";
import { ReportsFilters } from "@/components/officer-dashboard/reports/ReportsFilters";
import { ReportsMetrics } from "@/components/officer-dashboard/reports/ReportsMetrics";
import { ReportsCharts } from "@/components/officer-dashboard/reports/ReportsCharts";
import { TopAgentPerformance } from "@/components/officer-dashboard/reports/TopAgentPerformance";
import { IssuesBreakdown } from "@/components/officer-dashboard/reports/IssuesBreakdown";
import { RecentActivityTable } from "@/components/officer-dashboard/reports/RecentActivityTable";

export default function ReportsPage() {
    return (
        <div className="space-y-6">
            <ReportsHeader />

            <div className="p-6 space-y-6">
                <ReportsFilters />

            <div className="bg-white p-6 rounded-lg border shadow-sm text-center space-y-2">
                <h2 className="text-xl font-bold text-[#1e1b4b]">System Performance Report</h2>
                <p className="text-muted-foreground">Report Period: Jan 01, 2000 - Dec 04, 2025</p>
                <p className="text-xs text-muted-foreground">Generated on Dec 04, 2025 22:53 by Officer.Rock</p>
            </div>

            <ReportsMetrics />
            <ReportsCharts />
            <TopAgentPerformance />
            <IssuesBreakdown />
            <RecentActivityTable />
            </div>

        </div>
    );
}
