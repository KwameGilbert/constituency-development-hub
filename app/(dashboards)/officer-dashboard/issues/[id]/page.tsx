"use client";

import React, { useState, useEffect, use } from "react";
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
  Loader2,
  Send,
  CheckCircle,
  Pencil,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { issuesService, Issue } from "@/lib/services/issues-service";
import { DashboardHeader } from "../../dashboard-header";
import IssueDescription from "@/components/ui/IssueDescription";
import { parseList } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

// Helper to format status names
const formatStatusLabel = (status: string) => {
  if (!status) return "";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Status badge styling - aligned with Officer indigo theme
const getStatusBadge = (status: string) => {
  const statusLower = status?.toLowerCase() || "";

  const statusConfig: Record<string, { className: string; label: string }> = {
    submitted: { className: "bg-blue-100 text-blue-700", label: "Submitted" },
    under_officer_review: {
      className: "bg-purple-100 text-purple-700",
      label: "Under Officer Review",
    },
    forwarded_to_admin: {
      className: "bg-indigo-100 text-indigo-700",
      label: "Forwarded To Admin",
    },
    assigned_to_task_force: {
      className: "bg-cyan-100 text-cyan-700",
      label: "Assigned To Task Force",
    },
    assessment_in_progress: {
      className: "bg-yellow-100 text-yellow-700",
      label: "Assessment In Progress",
    },
    assessment_submitted: {
      className: "bg-orange-100 text-orange-700",
      label: "Assessment Submitted",
    },
    resources_allocated: {
      className: "bg-teal-100 text-teal-700",
      label: "Resources Allocated",
    },
    resolution_in_progress: {
      className: "bg-lime-100 text-lime-700",
      label: "Resolution In Progress",
    },
    resolution_submitted: {
      className: "bg-emerald-100 text-emerald-700",
      label: "Resolution Submitted",
    },
    resolved: { className: "bg-green-100 text-green-700", label: "Resolved" },
    closed: { className: "bg-gray-100 text-gray-700", label: "Closed" },
  };

  const config = statusConfig[statusLower] || {
    className: "bg-gray-100 text-gray-700",
    label: formatStatusLabel(statusLower),
  };

  return (
    <Badge
      variant="secondary"
      className={`${config.className} hover:${config.className}/80 border-0 px-3 py-1 rounded-lg font-medium shadow-sm whitespace-nowrap`}
    >
      {config.label}
    </Badge>
  );
};

// Priority badge styling
const getPriorityBadge = (priority: string) => {
  const priorityLower = priority?.toLowerCase() || "";
  const config: Record<string, { className: string; label: string }> = {
    critical: {
      className: "bg-red-100 text-red-700 font-semibold",
      label: "Critical",
    },
    urgent: {
      className: "bg-red-100 text-red-700 font-semibold",
      label: "Urgent",
    },
    high: {
      className: "bg-orange-100 text-orange-700 font-semibold",
      label: "High",
    },
    medium: {
      className: "bg-yellow-100 text-yellow-700 font-semibold",
      label: "Medium",
    },
    low: { className: "bg-gray-100 text-gray-700 font-semibold", label: "Low" },
  };

  const badge = config[priorityLower] || {
    className: "bg-gray-100 text-gray-700",
    label: priority
      ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase()
      : "Unknown",
  };

  return (
    <Badge
      variant="outline"
      className={`${badge.className} border-0 rounded-lg px-2.5 py-0.5`}
    >
      {badge.label}
    </Badge>
  );
};

export default function OfficerIssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [issue, setIssue] = useState<any>(null); // Use any to gracefully allow generic extended backend fields like 'agent'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function fetchIssue() {
      try {
        setLoading(true);
        setError(null);
        const response = await issuesService.getOfficerIssueById(id);
        if (response?.success && response.data.report) {
          setIssue(response.data.report);
        } else {
          setError(response?.message || "Issue not found");
        }
      } catch (error) {
        console.error("Failed to fetch issue:", error);
        setError("Failed to load issue details");
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, [id]);

  async function handleReviewAndForward() {
    if (!issue) return;
    setUpdating(true);
    try {
      await issuesService.updateOfficerIssueStatus(
        issue.id,
        "under_officer_review",
        "Issue taken under officer review",
      );
      const response = await issuesService.updateOfficerIssueStatus(
        issue.id,
        "forwarded_to_admin",
        comment || "Forwarded to admin for further action",
      );
      if (response.success) {
        toast.success("Issue reviewed and forwarded to admin");
        router.push("/officer-dashboard/issues");
      }
    } catch (error) {
      console.error("Failed to update issue:", error);
      toast.error("Failed to forward issue");
    } finally {
      setUpdating(false);
    }
  }

  async function handleMarkUnderReview() {
    if (!issue) return;
    setUpdating(true);
    try {
      const response = await issuesService.updateOfficerIssueStatus(
        issue.id,
        "under_officer_review",
        comment || "Issue is now under officer review",
      );
      if (response.success) {
        toast.success("Issue marked as under review");
        setIssue(response.data.report);
        setComment("");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  }

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

  const isEditable =
    issue &&
    ["submitted", "rejected", "under_officer_review"].includes(issue.status);

  if (loading) {
    return (
      <div className="flex flex-col h-full w-full bg-slate-50">
        <DashboardHeader title="Issue Details" subtitle="Loading..." />
        <div className="flex-1 p-6 space-y-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="flex flex-col h-full w-full bg-slate-50">
        <DashboardHeader title="Issue Details" subtitle="Not Found" />
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
              <p className="text-sm">{error || "Issue not found"}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if system provided an agent or it's from current user
  const agentObject = issue.agent || issue.user;
  const isAgentSubmitted = issue.origin === "agent" || !!agentObject;

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar bg-slate-50/50">
      <DashboardHeader
        title="Issue Details"
        subtitle={`Case ID: ${issue.case_id || `#${issue.id}`}`}
      />
      <div className="flex-1 p-4 sm:p-6 space-y-6 pb-20">
        {/* Action Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="gap-2 border-slate-200 text-slate-600 font-semibold rounded-lg hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-all"
            >
              <ArrowLeft className="h-4 w-4" /> Back to List
            </Button>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                  {issue.case_id || `#${issue.id}`}
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

          <div className="flex gap-2">
            {isEditable && (
              <Button
                variant="outline"
                asChild
                className="gap-2 font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
              >
                <Link href={`/officer-dashboard/issues/${issue.id}/edit`}>
                  <Pencil className="h-4 w-4" /> Edit Details
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-transparent border-b border-slate-50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                  <div className="h-6 w-1 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
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
                    <label className="text-xs font-medium text-slate-500">
                      Description
                    </label>
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
                      <p className="text-sm text-slate-600 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50 whitespace-pre-wrap">
                        {issue.additional_notes}
                      </p>
                    </div>
                  )}

                  <Separator className="bg-slate-100" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">
                        Category
                      </label>
                      <p className="font-semibold text-slate-900 text-sm capitalize">
                        {issue.category || "Not Specified"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">
                        Impact Type
                      </label>
                      <p className="font-semibold text-slate-900 text-sm capitalize">
                        {issue.issue_type?.replace(/_/g, " ") ||
                          "Community Based"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">
                        Sector
                      </label>
                      <p className="font-semibold text-slate-900 text-sm">
                        {issue.sector || "Not Specified"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-500">
                        Subsector
                      </label>
                      <p className="font-semibold text-slate-900 text-sm">
                        {issue.subsector || "Not Specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-cyan-50/50 to-transparent border-b border-slate-50">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                  <div className="h-6 w-1 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">
                    Community
                  </label>
                  <p className="font-semibold text-slate-900 text-sm">
                    {issue.community || issue.location || "N/A"}
                  </p>
                </div>
                {issue.suburb && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">
                      Suburb
                    </label>
                    <p className="font-semibold text-slate-900 text-sm">
                      {issue.suburb}
                    </p>
                  </div>
                )}
                {issue.specific_location && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">
                      Specific Location
                    </label>
                    <p className="font-semibold italic text-slate-600 text-sm">
                      &quot;{issue.specific_location}&quot;
                    </p>
                  </div>
                )}
                {issue.latitude && issue.longitude && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">
                      Coordinates
                    </label>
                    <p className="font-semibold text-slate-600 text-sm font-mono">
                      {issue.latitude}, {issue.longitude}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Officer Actions Form */}
            {(issue.status === "submitted" ||
              issue.status === "under_officer_review") && (
              <Card className="shadow-sm border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-rose-50/50 to-transparent border-b border-slate-50">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                    <div className="h-6 w-1 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                    Officer Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-slate-700 mb-2 block">
                      Add Workflow Comment (Optional)
                    </label>
                    <Textarea
                      placeholder="Add notes or comments about this issue before forwarding..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="min-h-[100px] border-slate-200 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {issue.status === "submitted" && (
                      <Button
                        onClick={handleMarkUnderReview}
                        disabled={updating}
                        variant="outline"
                        className="bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 border-indigo-200"
                      >
                        {updating ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="mr-2 h-4 w-4" />
                        )}
                        Mark Under Review
                      </Button>
                    )}
                    <Button
                      onClick={handleReviewAndForward}
                      disabled={updating}
                      className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                    >
                      {updating ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Review & Forward to Admin
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Forwarded Notice */}
            {issue.status === "forwarded_to_admin" && (
              <Card className="border-indigo-200 bg-indigo-50/50 rounded-xl shadow-sm">
                <CardContent className="py-4 px-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-indigo-600 shrink-0" />
                    <p className="text-indigo-800 font-medium text-sm">
                      This issue has been forwarded to the administration unit
                      and is awaiting further assignment and processing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Images */}
            {(() => {
              const imgs = parseList<string>(issue.images);
              return imgs.length > 0 ? (
                <div className="pt-4">
                  <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                    <div className="h-4 w-1 bg-slate-400 rounded-full" />
                    Attached Images
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imgs.map((image: string, index: number) => (
                      <div
                        key={index}
                        className="aspect-video bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <img
                          src={image}
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/400x300?text=Image+Not+Available";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
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
                    <label className="text-[11px] font-medium text-slate-500">
                      Status
                    </label>
                    <div className="mt-0.5">{getStatusBadge(issue.status)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100/80">
                    <Tag className="h-4 w-4 text-slate-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">
                      Priority
                    </label>
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
                      <label className="text-[11px] font-medium text-slate-500">
                        People Affected
                      </label>
                      <p className="font-semibold text-slate-900 text-sm">
                        {Number(issue.people_affected).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {issue.estimated_budget != null && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-slate-100/80">
                      <div className="h-4 w-4 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                        GH₵
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-medium text-slate-500">
                        Estimated Budget
                      </label>
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
                    <label className="text-[11px] font-medium text-slate-500">
                      Created Date
                    </label>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formatDate(issue.created_at)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submitting Agent Target Component */}
            {isAgentSubmitted && agentObject && (
              <Card className="shadow-sm border-slate-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-amber-50/50 to-transparent border-b border-slate-50">
                  <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-900">
                    <div className="h-6 w-1 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                    Reporting Agent
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center border border-amber-200 shadow-sm shrink-0">
                      <Briefcase className="h-4 w-4 text-amber-700" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 text-sm truncate">
                        {agentObject.name ||
                          agentObject.user?.name ||
                          "Agent Name"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {agentObject.email ||
                          agentObject.user?.email ||
                          "Agent"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                      <Phone className="h-3 w-3" />
                      {agentObject.phone ||
                        agentObject.user?.phone ||
                        "No Phone"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                  <label className="text-[11px] font-medium text-slate-500">
                    Full Name
                  </label>
                  <p className="font-semibold text-slate-900 text-sm">
                    {issue.reporter_name || "Name Not Provided"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-50">
                    <Phone className="h-3.5 w-3.5 text-indigo-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">
                      Phone
                    </label>
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
                    <label className="text-[11px] font-medium text-slate-500">
                      Email
                    </label>
                    <p className="font-semibold text-slate-900 text-sm">
                      {issue.reporter_email || "Email Not Provided"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-500">
                    Gender
                  </label>
                  <p className="font-semibold text-slate-900 capitalize text-sm">
                    {issue.reporter_gender || "Not Specified"}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Home className="h-3.5 w-3.5 text-slate-600" />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-500">
                      Home Address
                    </label>
                    <p className="font-semibold text-slate-900 text-sm">
                      {issue.reporter_address || "Address Not Specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
