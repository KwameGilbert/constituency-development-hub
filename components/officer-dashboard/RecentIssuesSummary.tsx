import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

const recentIssues = [
    {
        id: "#ISU00002",
        title: "aeda",
        agent: "Agent.Rock",
        status: "Rejected",
        date: "2025-10-01",
    },
    {
        id: "#ISU00001",
        title: "t6r6",
        agent: "Agent.Rock",
        status: "Approved",
        date: "2025-09-28",
    },
];

export function RecentIssuesSummary() {
    return (
        <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-semibold">
                    Recent Issues Submitted
                </CardTitle>
                <Link
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1"
                >
                    View All Issues <ArrowRight className="w-4 h-4" />
                </Link>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent border-none">
                            <TableHead className="w-[100px] text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Issue ID
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Title
                            </TableHead>
                            <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Agent
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
                                <TableCell className="font-medium">{issue.id}</TableCell>
                                <TableCell>{issue.title}</TableCell>
                                <TableCell className="text-muted-foreground">
                                    {issue.agent}
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant="secondary"
                                        className={`rounded-full px-3 py-0.5 font-normal ${issue.status === "Approved"
                                                ? "bg-indigo-100 text-indigo-700 hover:bg-indigo-100"
                                                : "bg-red-100 text-red-700 hover:bg-red-100"
                                            }`}
                                    >
                                        {issue.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {issue.date}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium"
                                    >
                                        Review
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
