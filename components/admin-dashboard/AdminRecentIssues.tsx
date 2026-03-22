"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox } from "lucide-react";
import Link from "next/link";
import {
  dashboardService,
  RecentIssue,
} from "@/lib/services/dashboard-service";
import { cleanupHtml } from "@/lib/utils";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "resolved":
      return "bg-green-100 text-green-800";
    case "in progress":
      return "bg-blue-100 text-blue-800";
    case "pending review":
      return "bg-yellow-100 text-yellow-800";
    case "approved":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
    case "urgent":
      return "bg-red-100 text-red-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
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
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Recent Issues
          </CardTitle>
          <Link
            href="/admin-dashboard/issues"
            className="text-sm text-blue-600 hover:underline"
          >
            View All Issues →
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
              <div>Issue</div>
              <div>Agent</div>
              <div>Status</div>
              <div className="col-span-1 grid grid-cols-2">
                <span>Severity</span>
                <span className="text-right">Date</span>
              </div>
            </div>

            {/* Loading State */}
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-sm text-gray-500">Loading recent issues...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex-1">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Recent Issues
          </CardTitle>
          <Link
            href="/admin-dashboard/issues"
            className="text-sm text-blue-600 hover:underline"
          >
            View All Issues →
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
              <div>Issue</div>
              <div>Agent</div>
              <div>Status</div>
              <div className="col-span-1 grid grid-cols-2">
                <span>Severity</span>
                <span className="text-right">Date</span>
              </div>
            </div>

            {/* Error State */}
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Recent Issues
        </CardTitle>
        <Link
          href="/admin-dashboard/issues"
          className="text-sm text-blue-600 hover:underline"
        >
          View All Issues →
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-white">
          {/* Table Header (Desktop Only) */}
          <div className="hidden md:grid grid-cols-4 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
            <div>Issue</div>
            <div>Agent</div>
            <div>Status</div>
            <div className="col-span-1 grid grid-cols-2">
              <span>Severity</span>
              <span className="text-right">Date</span>
            </div>
          </div>

          {/* Issues List */}
          {issues.length > 0 ? (
            <div className="overflow-hidden">
              <div className="divide-y divide-gray-100">
                {issues.map((issue) => (
                  <div
                    key={issue.id}
                    className="flex flex-col md:grid md:grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    {/* Issue Title & Desc */}
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start md:block">
                        <span
                          className="text-sm font-medium text-gray-900 truncate block max-w-[200px] md:max-w-none"
                          title={issue.title}
                        >
                          {issue.title}
                        </span>
                        {/* Mobile Status Badge */}
                        <div className="md:hidden">
                          <Badge
                            className={`text-xs ${getStatusColor(issue.status)}`}
                          >
                            {issue.status}
                          </Badge>
                        </div>
                      </div>
                      <span
                        className="text-xs text-gray-500 truncate mt-1"
                        title={cleanupHtml(issue.description)}
                      >
                        {cleanupHtml(issue.description)}
                      </span>
                    </div>

                    {/* Desktop: Agent */}
                    <div className="hidden md:flex items-center">
                      <span className="text-sm text-gray-900">
                        {issue.agent}
                      </span>
                    </div>

                    {/* Desktop: Status */}
                    <div className="hidden md:flex items-center">
                      <Badge
                        className={`text-xs ${getStatusColor(issue.status)}`}
                      >
                        {issue.status}
                      </Badge>
                    </div>

                    {/* Desktop: Severity & Date */}
                    <div className="hidden md:grid grid-cols-2 gap-2">
                      <Badge
                        className={`text-xs justify-center ${getSeverityColor(
                          issue.severity,
                        )}`}
                      >
                        {issue.severity}
                      </Badge>
                      <span className="text-sm text-gray-500 text-right">
                        {new Date(issue.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>

                    {/* Mobile Details Row */}
                    <div className="flex md:hidden items-center justify-between mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">
                          {issue.agent}
                        </span>
                        <span>•</span>
                        <span
                          className={`${getSeverityColor(issue.severity).replace("bg-", "text-").replace("text-", "bg-transparent ")} font-medium`}
                        >
                          {issue.severity}
                        </span>
                      </div>
                      <span>
                        {new Date(issue.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <Inbox className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No recent issues found.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
