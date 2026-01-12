"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { issuesService, Issue } from "@/lib/services/issues-service";

export function RecentIssuesSummary() {
    const [recentIssues, setRecentIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecentIssues() {
            try {
                const response = await issuesService.getAllIssues({ limit: 5 });
                if (response.success && response.data.reports) {
                    setRecentIssues(response.data.reports);
                }
            } catch (error) {
                console.error("Failed to fetch recent issues:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecentIssues();
    }, []);

    function getStatusColor(status: string) {
        const statusColors: Record<string, string> = {
            submitted: "bg-blue-100 text-blue-700 hover:bg-blue-100",
            under_officer_review: "bg-purple-100 text-purple-700 hover:bg-purple-100",
            forwarded_to_admin: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
            resolved: "bg-green-100 text-green-700 hover:bg-green-100",
            closed: "bg-gray-100 text-gray-700 hover:bg-gray-100",
        };
        return statusColors[status] || "bg-gray-100 text-gray-700";
    }

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                    Recent Issues Submitted
                </CardTitle>
                <Link
                    href="/officer-dashboard/issues"
                    className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                >
                    View All Issues <ArrowRight className="w-4 h-4" />
                </Link>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                        <span className="ml-2 text-gray-500">Loading...</span>
                    </div>
                ) : recentIssues.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>No recent issues found</p>
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent border-none">
                                <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Case ID
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Title
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Category
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Status
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Date Submitted
                                </TableHead>
                                <TableHead className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentIssues.map((issue) => (
                                <TableRow key={issue.id} className="hover:bg-muted/50 border-b-0">
                                    <TableCell className="font-medium">{issue.case_id || `#${issue.id}`}</TableCell>
                                    <TableCell>{issue.title}</TableCell>
                                    <TableCell className="text-muted-foreground capitalize">
                                        {issue.category}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="secondary"
                                            className={`rounded-full px-3 py-0.5 font-normal ${getStatusColor(issue.status)}`}
                                        >
                                            {issue.status.replace(/_/g, " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {new Date(issue.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                                            asChild
                                        >
                                            <Link href={`/officer-dashboard/issues/${issue.id}`}>
                                                Review
                                            </Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}

