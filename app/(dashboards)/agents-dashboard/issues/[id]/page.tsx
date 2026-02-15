"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  AlertCircle,
  Loader2,
  FileText,
  Users,
  Tag,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { agentService, IssueDetail } from "@/lib/services/agent-service";
import AgentDashboardHeader from "@/components/agent-dashboard/AgentDashboardHeader";
import SanitizedHtml from "@/components/ui/SanitizedHtml";

// Status badge styling
const getStatusBadge = (status: string) => {
  const statusLower = status?.toLowerCase() || "";

  const statusConfig: Record<string, { className: string; label: string }> = {
    submitted: { className: "bg-blue-100 text-blue-700", label: "Submitted" },
    pending: { className: "bg-yellow-100 text-yellow-700", label: "Pending" },
    under_officer_review: {
      className: "bg-orange-100 text-orange-700",
      label: "Under Review",
    },
    forwarded_to_admin: {
      className: "bg-indigo-100 text-indigo-700",
      label: "Forwarded to Admin",
    },
    approved: { className: "bg-indigo-100 text-indigo-700", label: "Approved" },
    assigned_to_task_force: {
      className: "bg-purple-100 text-purple-700",
      label: "Assigned to Task Force",
    },
    in_progress: {
      className: "bg-purple-100 text-purple-700",
      label: "In Progress",
    },
    resolved: { className: "bg-green-100 text-green-700", label: "Resolved" },
    closed: { className: "bg-gray-100 text-gray-700", label: "Closed" },
    rejected: { className: "bg-red-100 text-red-700", label: "Rejected" },
  };

  const config = statusConfig[statusLower] || {
    className: "bg-gray-100 text-gray-700",
    label: status || "Unknown",
  };

  return (
    <Badge
      variant="secondary"
      className={`${config.className} hover:${config.className}/80 border-0 px-3 py-1`}
    >
      {config.label}
    </Badge>
  );
};

// Priority badge styling
const getPriorityBadge = (priority: string) => {
  const priorityLower = priority?.toLowerCase() || "";
  const config: Record<string, { className: string; label: string }> = {
    critical: { className: "bg-red-100 text-red-700", label: "Critical" },
    high: { className: "bg-orange-100 text-orange-700", label: "High" },
    medium: { className: "bg-yellow-100 text-yellow-700", label: "Medium" },
    low: { className: "bg-green-100 text-green-700", label: "Low" },
  };

  const badge = config[priorityLower] || {
    className: "bg-gray-100 text-gray-700",
    label: priority || "Unknown",
  };

  return (
    <Badge variant="outline" className={`${badge.className} border-0`}>
      {badge.label}
    </Badge>
  );
};

export default function AgentIssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [issue, setIssue] = useState<IssueDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await agentService.getIssueById(parseInt(id));

        if (response.success && response.data?.issue) {
          setIssue(response.data.issue);
        } else {
          setError(response.message || "Issue not found");
        }
      } catch (err) {
        console.error("Error fetching issue:", err);
        setError("Failed to load issue details");
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full bg-slate-50">
        <AgentDashboardHeader />
        <div className="flex-1 p-6 space-y-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full w-full bg-slate-50">
        <AgentDashboardHeader />
        <div className="flex-1 p-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="rounded-lg border bg-red-50 p-6 text-red-600 flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!issue) return null;

  return (
    <div className="flex flex-col h-full w-full bg-slate-50">
      <AgentDashboardHeader />
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Back Button & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">
                  {issue.case_id}
                </h1>
                {getStatusBadge(issue.status)}
                {getPriorityBadge(issue.priority)}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Submitted on {formatDate(issue.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Details Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  Issue Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg">
                    {issue.title}
                  </h3>
                </div>

                <div>
                  <label className="text-sm text-slate-500">Description</label>
                  <SanitizedHtml
                    className="mt-1 text-slate-700 prose prose-sm max-w-none"
                    html={issue.description}
                  />
                </div>

                {issue.additional_notes && (
                  <div>
                    <label className="text-sm text-slate-500">
                      Additional Notes
                    </label>
                    <p className="mt-1 text-slate-700">
                      {issue.additional_notes}
                    </p>
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-slate-500">Category</label>
                    <p className="mt-1 font-medium text-slate-900">
                      {issue.category}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-slate-500">Type</label>
                    <p className="mt-1 font-medium text-slate-900">
                      {issue.type || "N/A"}
                    </p>
                  </div>
                  {issue.sector && (
                    <div>
                      <label className="text-sm text-slate-500">Sector</label>
                      <p className="mt-1 font-medium text-slate-900">
                        {issue.sector}
                      </p>
                    </div>
                  )}
                  {issue.subsector && (
                    <div>
                      <label className="text-sm text-slate-500">
                        Subsector
                      </label>
                      <p className="mt-1 font-medium text-slate-900">
                        {issue.subsector}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-slate-600" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-500">
                      Main Community
                    </label>
                    <p className="mt-1 font-medium text-slate-900">
                      {issue.location}
                    </p>
                  </div>
                  {issue.smaller_community && (
                    <div>
                      <label className="text-sm text-slate-500">
                        Smaller Community
                      </label>
                      <p className="mt-1 font-medium text-slate-900">
                        {issue.smaller_community}
                      </p>
                    </div>
                  )}
                  {issue.suburb && (
                    <div>
                      <label className="text-sm text-slate-500">Suburb</label>
                      <p className="mt-1 font-medium text-slate-900">
                        {issue.suburb}
                      </p>
                    </div>
                  )}
                  {issue.cottage && (
                    <div>
                      <label className="text-sm text-slate-500">Cottage</label>
                      <p className="mt-1 font-medium text-slate-900">
                        {issue.cottage}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Clock className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Status</p>
                    <p className="font-medium">
                      {getStatusBadge(issue.status)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Tag className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Priority</p>
                    <p className="font-medium">
                      {getPriorityBadge(issue.priority)}
                    </p>
                  </div>
                </div>

                {issue.people_affected && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100">
                      <Users className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">People Affected</p>
                      <p className="font-medium">
                        {issue.people_affected.toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Created</p>
                    <p className="font-medium text-sm">
                      {formatDate(issue.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reporter Info */}
            {issue.reporter_name && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-slate-600" />
                    Constituent Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm text-slate-500">Name</label>
                    <p className="font-medium text-slate-900">
                      {issue.reporter_name}
                    </p>
                  </div>
                  {issue.reporter_phone && (
                    <div>
                      <label className="text-sm text-slate-500">Phone</label>
                      <p className="font-medium text-slate-900">
                        {issue.reporter_phone}
                      </p>
                    </div>
                  )}
                  {issue.reporter_email && (
                    <div>
                      <label className="text-sm text-slate-500">Email</label>
                      <p className="font-medium text-slate-900">
                        {issue.reporter_email}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Assigned Officer */}
            {issue.assigned_officer && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Assigned Officer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-slate-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {issue.assigned_officer.user.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {issue.assigned_officer.user.email}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
