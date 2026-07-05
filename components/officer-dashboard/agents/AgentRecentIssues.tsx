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
        return "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100";
      case "rejected":
        return "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100";
      case "pending":
      case "submitted":
        return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100";
    }
  };

  return (
    <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <CardTitle className="text-xs font-semibold text-slate-700">
          Recent Reports
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">
        {issues.length > 0 ? (
          <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="group border border-slate-100 rounded-md p-2 space-y-1.5 hover:border-indigo-100 hover:bg-slate-50/50 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {issue.title}
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(issue.status)} rounded-full px-2 py-0 text-[9px] font-semibold capitalize border transition-colors`}
                      >
                        {issue.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-indigo-50 text-indigo-700 border-indigo-100 rounded-full px-2 py-0 text-[9px] font-semibold capitalize"
                      >
                        {issue.priority}
                      </Badge>
                      <span className="text-[9px] font-semibold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0 rounded-full">
                        {issue.category}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/officer-dashboard/issues/${issue.id}`}
                    className="p-1.5 bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 rounded-lg transition-all"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <p className="text-xs text-slate-500 leading-normal line-clamp-2">
                  {cleanupHtml(issue.description)}
                </p>

                <div className="flex items-center gap-4 pt-1">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-amber-500" />
                    <span className="text-[10px] font-medium text-slate-500 truncate max-w-[120px]">
                      {issue.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-[10px] font-medium text-slate-500">
                      {new Date(issue.created_at).toLocaleDateString(
                        undefined,
                        { month: "short", day: "numeric" },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-400 flex flex-col items-center gap-2">
            <div>
              <h5 className="text-xs font-semibold text-slate-400">
                No Reports Submitted
              </h5>
              <p className="text-[10px] text-slate-300 mt-0.5">
                No reports have been logged by this agent yet.
              </p>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-center">
          <Link
            href="/officer-dashboard/issues"
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-100 transition-all h-8"
          >
            <span>View All Reports</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
