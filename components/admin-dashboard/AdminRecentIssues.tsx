"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox, ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  dashboardService,
  RecentIssue,
} from "@/lib/services/dashboard-service";
import { cleanupHtml } from "@/lib/utils";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "resolved":
      return "bg-emerald-100 text-emerald-800";
    case "in progress":
      return "bg-amber-100 text-amber-800";
    case "pending review":
      return "bg-indigo-100 text-indigo-800";
    case "approved":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
    case "urgent":
      return "bg-red-50 text-red-600 border-red-100";
    case "high":
      return "bg-orange-50 text-orange-600 border-orange-100";
    case "medium":
      return "bg-amber-50 text-amber-600 border-amber-100";
    case "low":
      return "bg-emerald-50 text-emerald-600 border-emerald-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-100";
  }
};

export function AdminRecentIssues() {
  const [issues, setIssues] = useState<RecentIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await dashboardService.getRecentIssues(10);

        if (response.success && response.data?.recentIssues) {
          setIssues(response.data.recentIssues);
        } else {
          setError(response.message || "Failed to load recent issues");
        }
      } catch (err) {
        setError("Failed to load recent issues");
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) {
    return (
      <Card className="flex-1 border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/60 p-5 bg-white/50">
          <CardTitle className="text-lg font-semibold text-slate-800 tracking-tight">
            Recent Issues
          </CardTitle>
          <div className="h-4 bg-slate-100 rounded animate-pulse w-24"></div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mb-3"></div>
            <p className="text-sm text-slate-500 font-medium">Syncing issues...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1 border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/60 p-5 bg-white/50">
        <CardTitle className="text-lg font-semibold text-slate-800 tracking-tight">
          Recent Issues
        </CardTitle>
        <Link
          href="/admin-dashboard/issues"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-white">
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50 border-b border-slate-100/60">
            <div>Issue Detail</div>
            <div>Field Agent</div>
            <div>Current Status</div>
            <div className="col-span-1 grid grid-cols-2">
              <span>Severity</span>
              <span className="text-right">Reported</span>
            </div>
          </div>

          {issues.length > 0 ? (
            <div className="divide-y divide-slate-100/60">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex flex-col md:grid md:grid-cols-4 gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex flex-col overflow-hidden">
                    <div className="flex justify-between items-start md:block">
                      <span className="text-sm font-semibold text-slate-900 truncate block transition-colors group-hover:text-amber-600" title={issue.title}>
                        {issue.title}
                      </span>
                      <div className="md:hidden">
                        <Badge className={`text-[10px] font-bold uppercase ${getStatusColor(issue.status)} border-none`}>
                          {issue.status}
                        </Badge>
                      </div>
                    </div>
                    <span className="text-xs font-normal text-muted-foreground truncate mt-0.5 leading-relaxed" title={cleanupHtml(issue.description)}>
                      {cleanupHtml(issue.description)}
                    </span>
                  </div>

                  <div className="hidden md:flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                        {issue.agent.charAt(0)}
                      </div>
                      <span className="text-sm text-slate-700 font-medium">{issue.agent}</span>
                    </div>
                  </div>

                  <div className="hidden md:flex items-center">
                    <Badge className={`text-[10px] font-bold uppercase tracking-wider ${getStatusColor(issue.status)} border-none px-2 py-0.5`}>
                      {issue.status}
                    </Badge>
                  </div>

                  <div className="hidden md:grid grid-cols-2 items-center gap-2">
                    <Badge className={`text-[10px] font-bold uppercase border justify-center ${getSeverityColor(issue.severity)}`}>
                      {issue.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground text-right font-normal">
                      {new Date(issue.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500 font-semibold">No recent issues found</p>
              <p className="text-[11px] text-slate-400 mt-1">Check back later for field updates</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
