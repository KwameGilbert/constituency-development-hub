import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function TopAgentPerformance() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold text-[#1e1b4b]">Top Agent Performance</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Agent</TableHead>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Issues Submitted</TableHead>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Resolved</TableHead>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Resolution Rate</TableHead>
                            <TableHead className="font-semibold text-xs text-muted-foreground uppercase">Avg Resolution Time</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium text-[#1e1b4b]">Agent.Rock</TableCell>
                            <TableCell>2</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>0%</TableCell>
                            <TableCell>N/A</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
