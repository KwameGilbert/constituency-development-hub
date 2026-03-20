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
    <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 pb-4">
        <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest pl-1 font-mono">
          Intelligence Log
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {issues.length > 0 ? (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                    key={issue.id}
                    className="group border border-slate-100 rounded-2xl p-5 space-y-3 hover:border-indigo-100 hover:bg-slate-50/50 transition-all cursor-pointer relative overflow-hidden"
                >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-1">
                        <h4 className="font-bold text-slate-800 text-base leading-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{issue.title}</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge
                              variant="outline"
                              className={`${getStatusColor(issue.status)} rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors`}
                          >
                              {issue.status}
                          </Badge>
                          <Badge
                              variant="outline"
                              className="bg-indigo-50 text-indigo-700 border-indigo-100 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          >
                              {issue.priority}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                              {issue.category}
                          </span>
                        </div>
                    </div>
                    <Link href={`/officer-dashboard/issues/${issue.id}`} className="p-2 bg-slate-50 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 rounded-xl transition-all shadow-sm">
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                    </div>
                    
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">{cleanupHtml(issue.description)}</p>
                    
                    <div className="flex items-center gap-6 pt-2">
                      <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="h-3.5 w-3.5 text-amber-500" />
                          <span className="text-[11px] font-bold uppercase tracking-wide truncate max-w-[150px]">{issue.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                          <span className="text-[11px] font-bold uppercase tracking-wide">{new Date(issue.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                </div>
              ))}
            </div>
        ) : (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-4">
                <div className="p-4 bg-slate-50 rounded-full">
                   <AlertCircle className="h-10 w-10 text-slate-200" />
                </div>
                <div>
                   <h5 className="text-sm font-bold uppercase tracking-widest font-mono text-slate-400">Zero Intelligence Found</h5>
                   <p className="text-[11px] font-medium text-slate-300 mt-1">No reports have been logged by this operative yet.</p>
                </div>
            </div>
        )}
        
        <div className="pt-4 flex justify-center">
          <Link
            href="/officer-dashboard/issues"
            className="group inline-flex items-center gap-2 px-6 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100"
          >
            Access Full Database <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
