"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { officerReportsService, RecentActivity } from "@/lib/services/officer-reports-service";

// Map status to badge styling
const statusStyles: Record<string, { bg: string; text: string }> = {
    submitted: { bg: "bg-blue-100", text: "text-blue-700" },
    under_officer_review: { bg: "bg-yellow-100", text: "text-yellow-700" },
    forwarded_to_admin: { bg: "bg-purple-100", text: "text-purple-700" },
    assigned_to_task_force: { bg: "bg-cyan-100", text: "text-cyan-700" },
    assessment_in_progress: { bg: "bg-orange-100", text: "text-orange-700" },
    assessment_submitted: { bg: "bg-gray-100", text: "text-gray-700" },
    resources_allocated: { bg: "bg-lime-100", text: "text-lime-700" },
    resolution_in_progress: { bg: "bg-amber-100", text: "text-amber-700" },
    resolution_submitted: { bg: "bg-pink-100", text: "text-pink-700" },
    resolved: { bg: "bg-green-100", text: "text-green-700" },
    closed: { bg: "bg-emerald-100", text: "text-emerald-700" },
    rejected: { bg: "bg-red-100", text: "text-red-700" },
};

function formatStatus(status: string): string {
    return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

export function RecentActivityTable() {
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<RecentActivity[]>([]);

    useEffect(() => {
        async function fetchActivities() {
            try {
                const response = await officerReportsService.getRecentActivity(10);
                if (response.success) {
                    setActivities(response.data.activities);
                }
            } catch (error) {
                console.error("Failed to fetch recent activity:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchActivities();
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold text-[#1e1b4b]">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : activities.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Issue</TableHead>
                                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Status</TableHead>
                                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Agent</TableHead>
                                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Category</TableHead>
                                <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activities.map((activity) => {
                                const style = statusStyles[activity.status] || { bg: "bg-gray-100", text: "text-gray-700" };
                                return (
                                    <TableRow key={activity.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium text-[#1e1b4b]">{activity.title}</p>
                                                <p className="text-xs text-muted-foreground">ID: {activity.id}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant="secondary" 
                                                className={`${style.bg} ${style.text} hover:${style.bg}`}
                                            >
                                                {formatStatus(activity.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {activity.agent_name || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {activity.category || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {activity.formatted_date || "N/A"}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}
