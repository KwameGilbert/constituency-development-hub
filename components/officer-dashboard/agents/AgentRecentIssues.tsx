"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Calendar, AlertCircle } from "lucide-react";
import { cleanupHtml } from "@/lib/utils";
import Link from "next/link";
import { RecentIssue } from "@/lib/services/agent-service";

interface AgentRecentIssuesProps {
  issues?: RecentIssue[];
}

export function AgentRecentIssues({ issues = [] }: AgentRecentIssuesProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
        case "resolved":
            return "bg-green-100 text-green-700 hover:bg-green-100 border-0";
        case "rejected":
            return "bg-red-100 text-red-700 hover:bg-red-100 border-0";
        case "pending":
        case "submitted":
            return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-0";
        default:
            return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-0";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Issues</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {issues.length > 0 ? (
            issues.map((issue) => (
            <div
                key={issue.id}
                className="border rounded-lg p-4 space-y-2 hover:bg-slate-50 transition-colors"
            >
                <div className="flex justify-between items-start">
                <div>
                    <h4 className="font-semibold text-sm line-clamp-1">{issue.title}</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                    <Badge
                        variant="secondary"
                        className={getStatusColor(issue.status)}
                    >
                        {issue.status}
                    </Badge>
                    <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-0"
                    >
                        {issue.priority}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground">
                        {issue.category}
                    </Badge>
                    </div>
                </div>
                {/* Link to specific issue detail page if available, for now to issues list or specific detail */}
                <Link href={`/officer-dashboard/issues/${issue.id}`} className="text-blue-600 hover:text-blue-800">
                    <ArrowRight className="h-4 w-4" />
                </Link>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{cleanupHtml(issue.description)}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="line-clamp-1">{issue.location}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(issue.created_at).toLocaleDateString()}</span>
                </div>
                </div>
            </div>
            ))
        ) : (
            <div className="text-center py-6 text-muted-foreground text-sm flex flex-col items-center">
                <AlertCircle className="h-8 w-8 mb-2 text-slate-300" />
                No reported issues found
            </div>
        )}
        
        {/* We can hide this link if no issues, or keep it to allow viewing empty list filter */}
        <div className="flex justify-end">
          <Link
            href="/officer-dashboard/issues" /* Ideally filtered by agent ID */
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            View All Issues <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
