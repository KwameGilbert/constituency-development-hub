"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  Clock,
  Tag,
  Calendar,
  Phone,
  Mail,
  Home,
  Users,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { agentService, IssueDetail } from "@/lib/services/agent-service";
import AgentDashboardHeader from "@/components/agent-dashboard/AgentDashboardHeader";
import IssueDescription from "@/components/ui/IssueDescription";

// Helper to format status names
const formatStatusLabel = (status: string) => {
  if (!status) return "";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Status badge styling
const getStatusBadge = (status: string) => {
  const statusLower = status?.toLowerCase() || "";

  const statusConfig: Record<string, { className: string; label: string }> = {
    submitted: { className: "bg-blue-100 text-blue-700", label: "Submitted" },
    pending: { className: "bg-yellow-100 text-yellow-700", label: "Pending" },
    under_officer_review: {
      className: "bg-orange-100 text-orange-700",
      label: "Under Officer Review",
    },
    forwarded_to_admin: {
      className: "bg-indigo-100 text-indigo-700",
      label: "Forwarded To Admin",
    },
    approved: { className: "bg-indigo-100 text-indigo-700", label: "Approved" },
    assigned_to_task_force: {
      className: "bg-purple-100 text-purple-700",
      label: "Assigned To Task Force",
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
    label: formatStatusLabel(statusLower),
  };

  return (
    <Badge
      variant="secondary"
      className={`${config.className} hover:${config.className}/80 border-0 px-3 py-1 rounded-lg font-medium shadow-sm`}
    >
      {config.label}
    </Badge>
  );
};

// Priority badge styling
const getPriorityBadge = (priority: string) => {
  const priorityLower = priority?.toLowerCase() || "";
  const config: Record<string, { className: string; label: string }> = {
    critical: { className: "bg-red-100 text-red-700 font-semibold", label: "Critical" },
    urgent: { className: "bg-red-100 text-red-700 font-semibold", label: "Urgent" },
    high: { className: "bg-orange-100 text-orange-700 font-semibold", label: "High" },
    medium: { className: "bg-amber-100 text-amber-700 font-semibold", label: "Medium" },
    low: { className: "bg-green-100 text-green-700 font-semibold", label: "Low" },
  };

  const badge = config[priorityLower] || {
    className: "bg-gray-100 text-gray-700",
    label: priority ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase() : "Unknown",
  };

  return (
    <Badge variant="outline" className={`${badge.className} border-0 rounded-lg px-2.5 py-0.5`}>
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
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar">
      <AgentDashboardHeader />
      <div className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2 border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back to List
            </Button>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                  {issue.case_id}
                </h1>
                <div className="flex gap-2">
                  {getStatusBadge(issue.status)}
                  {getPriorityBadge(issue.priority)}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Submitted on {formatDate(issue.created_at)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Issue Details Card */}
            <Card className="shadow-sm border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-amber-50/50 to-transparent border-b border-slate-50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                  <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  Issue Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 text-lg leading-snug">
                    {issue.title}
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Description</label>
                    <div className="bg-slate-50/30 rounded-lg p-1">
                      <IssueDescription
                        description={issue.description}
                        className="text-slate-700 prose prose-sm max-w-none"
                      />
                    </div>
                  </div>

                  {issue.additional_notes && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-slate-500">
                        Additional Notes
                      </label>
                      <p className="text-sm text-slate-600 bg-amber-50/50 p-4 rounded-lg border border-amber-100/50 whitespace-pre-wrap">
                        {issue.additional_notes}
                      </p>
                    </div>
                  )}

                  <Separator className="bg-slate-100" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Category</label>
                      <p className="font-semibold text-slate-900 text-sm">
                        {issue.category || "Not Specified"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Impact Type</label>
                      <p className="font-semibold text-slate-900 text-sm capitalize">
                        {issue.issue_type?.replace(/_/g, ' ') || "Community Based"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Sector</label>
                      <p className="font-semibold text-slate-900 text-sm">
                        {issue.sector || "Not Specified"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">Subsector</label>
                      <p className="font-semibold text-slate-900 text-sm">
                        {issue.subsector || "Not Specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="shadow-sm border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-transparent border-b border-slate-50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                  <div className="h-6 w-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">
                    Community
                  </label>
                  <p className="font-semibold text-slate-900 text-sm">
                    {issue.community}
                  </p>
                </div>
                {issue.suburb && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Suburb</label>
                    <p className="font-semibold text-slate-900 text-sm">
                      {issue.suburb}
                    </p>
                  </div>
                )}
                {issue.specific_location && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Specific Location</label>
                    <p className="font-semibold italic text-slate-600 text-sm">
                      &quot;{issue.specific_location}&quot;
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card className="shadow-sm border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent border-b border-slate-50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                   <div className="h-6 w-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                   Quick Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100/80">
                    <Clock className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Status</label>
                    <div className="mt-0.5">
                      {getStatusBadge(issue.status)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100/80">
                    <Tag className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Priority</label>
                    <div className="mt-0.5">
                      {getPriorityBadge(issue.priority)}
                    </div>
                  </div>
                </div>

                {issue.people_affected != null && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100/80">
                      <Users className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">People Affected</label>
                      <p className="font-semibold text-slate-900 text-sm">
                        {Number(issue.people_affected).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {issue.estimated_budget != null && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100/80">
                      <div className="h-4 w-4 flex items-center justify-center font-bold text-slate-600 text-[10px]">GH₵</div>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">Estimated Budget</label>
                      <p className="font-semibold text-slate-900 text-sm">
                        GH₵ {Number(issue.estimated_budget).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100/80">
                    <Calendar className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Created Date</label>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formatDate(issue.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reporter Info */}
            <Card className="shadow-sm border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-50/50 to-transparent border-b border-slate-50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                  <div className="h-6 w-1 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  Constituent Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">Full Name</label>
                  <p className="font-semibold text-slate-900 text-sm">
                    {issue.reporter_name || "Name Not Provided"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <Phone className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Phone</label>
                    <p className="font-semibold text-slate-900 text-sm">
                      {issue.reporter_phone || "Phone Not Provided"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <Mail className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Email</label>
                    <p className="font-semibold text-slate-900 text-sm">
                      {issue.reporter_email || "Email Not Provided"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">Gender</label>
                  <p className="font-semibold text-slate-900 capitalize text-sm">
                    {issue.reporter_gender || "Not Specified"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Home className="h-3.5 w-3.5 text-slate-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">Home Address</label>
                    <p className="font-semibold text-slate-900 text-sm">
                      {issue.reporter_address || "Address Not Specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Assigned Officer */}
            {issue.assigned_officer && (
              <Card className="shadow-sm border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-purple-50/50 to-transparent border-b border-slate-50">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                    <div className="h-6 w-1 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
                    Assigned Officer
                  </CardTitle>
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
