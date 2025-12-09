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
import { Badge } from "@/components/ui/badge";

export function RecentActivityTable() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base font-semibold text-[#1e1b4b]">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
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
                        <TableRow>
                            <TableCell>
                                <div>
                                    <p className="font-medium text-[#1e1b4b]">aeda</p>
                                    <p className="text-xs text-muted-foreground">ID: 2</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">Agent.Rock</TableCell>
                            <TableCell className="text-muted-foreground">Health</TableCell>
                            <TableCell className="text-muted-foreground">Oct 01, 2025 10:45</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <div>
                                    <p className="font-medium text-[#1e1b4b]">t6r6</p>
                                    <p className="text-xs text-muted-foreground">ID: 1</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">Approved</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">Agent.Rock</TableCell>
                            <TableCell className="text-muted-foreground">Economic Empowerment</TableCell>
                            <TableCell className="text-muted-foreground">Sep 28, 2025 17:18</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
