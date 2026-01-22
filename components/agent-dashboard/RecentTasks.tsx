"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { agentService, AgentReport } from "@/lib/services/agent-service";
import Link from "next/link";
import { FileX } from "lucide-react";

// Status badge styling
const getStatusBadge = (status: string) => {
  const statusLower = status?.toLowerCase() || '';
  
  const statusConfig: Record<string, { className: string; label: string }> = {
    submitted: { className: "bg-blue-100 text-blue-700", label: "Submitted" },
    pending: { className: "bg-yellow-100 text-yellow-700", label: "Pending" },
    under_officer_review: { className: "bg-orange-100 text-orange-700", label: "Under Review" },
    forwarded_to_admin: { className: "bg-indigo-100 text-indigo-700", label: "Forwarded" },
    approved: { className: "bg-indigo-100 text-indigo-700", label: "Approved" },
    assigned_to_task_force: { className: "bg-purple-100 text-purple-700", label: "Assigned" },
    in_progress: { className: "bg-purple-100 text-purple-700", label: "In Progress" },
    resolved: { className: "bg-green-100 text-green-700", label: "Resolved" },
    closed: { className: "bg-gray-100 text-gray-700", label: "Closed" },
    rejected: { className: "bg-red-100 text-red-700", label: "Rejected" },
  };

  const config = statusConfig[statusLower] || { 
    className: "bg-gray-100 text-gray-700", 
    label: status || "Unknown" 
  };

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} border-none`}
    >
      {config.label}
    </Badge>
  );
};

export interface RecentTasksProps {
  reports?: AgentReport[];
  loading?: boolean;
}

export function RecentTasks({ reports: providedReports, loading: providedLoading }: RecentTasksProps) {
  const [tasks, setTasks] = useState<AgentReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (providedReports !== undefined) {
      setTasks(providedReports.slice(0, 5));
      setLoading(providedLoading || false);
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await agentService.getMyReports();
        
        if (response.success && response.data?.reports) {
          // Get the 5 most recent reports
          const recentReports = response.data.reports.slice(0, 5);
          setTasks(recentReports);
        }
      } catch (err) {
        console.error("Error fetching recent tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [providedReports, providedLoading]);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card className="shadow-sm border-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">Recent Activity</CardTitle>
        <Link 
          href="/agents-dashboard/issues" 
          className="text-sm text-blue-600 hover:underline"
        >
          View all →
        </Link>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <FileX className="h-10 w-10 mb-3" />
            <p className="text-sm">No recent activity</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ISSUE</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>CATEGORY</TableHead>
                <TableHead className="text-right">DATE</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">
                        {task.title}
                      </span>
                      <span className="text-xs text-slate-500">
                        {task.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(task.status)}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {task.category}
                  </TableCell>
                  <TableCell className="text-right text-slate-500">
                    {formatDate(task.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link 
                      href={`/agents-dashboard/issues/${task.id}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      View
                    </Link>
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
