import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, User } from "lucide-react";
import Link from "next/link";

const recentIssues = [
    {
        id: 1,
        title: "aeda",
        description: "asfsd",
        status: "Rejected",
        priority: "Medium",
        category: "Health",
        location: "Sefwi Asawinso > Sefwi Asafo",
        date: "Oct 01, 2025",
    },
    {
        id: 2,
        title: "t6r6",
        description: "yfy",
        status: "Approved",
        priority: "Medium",
        category: "Economic Empowerment",
        location: "Sefwi Boako",
        date: "Sep 28, 2025",
    },
];

export function AgentRecentIssues() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Recent Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {recentIssues.map((issue) => (
                    <div key={issue.id} className="border rounded-lg p-4 space-y-2 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-semibold text-sm">{issue.title}</h4>
                                <div className="flex gap-2 mt-1">
                                    <Badge variant={issue.status === "Approved" ? "default" : "destructive"} className={issue.status === "Approved" ? "bg-green-100 text-green-700 hover:bg-green-100 border-0" : "bg-red-100 text-red-700 hover:bg-red-100 border-0"}>
                                        {issue.status}
                                    </Badge>
                                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0">
                                        {issue.priority}
                                    </Badge>
                                    <Badge variant="outline" className="text-muted-foreground">
                                        {issue.category}
                                    </Badge>
                                </div>
                            </div>
                            <Link href="#" className="text-blue-600 hover:text-blue-800">
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {issue.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                A
                            </div>
                            <div className="flex items-center gap-1">
                                <span>{issue.date}</span>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    <Link href="#" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        View All Issues by This Agent <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
