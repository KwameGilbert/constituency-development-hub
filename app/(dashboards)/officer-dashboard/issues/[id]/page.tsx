"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardHeader } from "../../dashboard-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  AlertCircle,
  Loader2,
  Send,
  CheckCircle,
} from "lucide-react";
import SanitizedHtml from "@/components/ui/SanitizedHtml";
import IssueDescription from "@/components/ui/IssueDescription";
import { issuesService, Issue } from "@/lib/services/issues-service";
import { toast } from "sonner";

export default function OfficerIssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function fetchIssue() {
      try {
        const id = params.id as string;
        const response = await issuesService.getIssueById(id);
        if (response?.success && response.data.report) {
          setIssue(response.data.report);
        }
      } catch (error) {
        console.error("Failed to fetch issue:", error);
        toast.error("Failed to load issue details");
      } finally {
        setLoading(false);
      }
    }
    fetchIssue();
  }, [params.id]);

  function getStatusColor(status: string) {
    const statusColors: Record<string, string> = {
      submitted: "bg-blue-100 text-blue-700",
      under_officer_review: "bg-purple-100 text-purple-700",
      forwarded_to_admin: "bg-indigo-100 text-indigo-700",
      assigned_to_task_force: "bg-cyan-100 text-cyan-700",
      assessment_in_progress: "bg-yellow-100 text-yellow-700",
      assessment_submitted: "bg-orange-100 text-orange-700",
      resources_allocated: "bg-teal-100 text-teal-700",
      resolution_in_progress: "bg-lime-100 text-lime-700",
      resolution_submitted: "bg-emerald-100 text-emerald-700",
      resolved: "bg-green-100 text-green-700",
      closed: "bg-gray-100 text-gray-700",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700";
  }

  function getPriorityColor(priority: string) {
    const priorityColors: Record<string, string> = {
      urgent: "bg-red-100 text-red-700",
      high: "bg-orange-100 text-orange-700",
      medium: "bg-yellow-100 text-yellow-700",
      low: "bg-gray-100 text-gray-700",
    };
    return priorityColors[priority] || "bg-gray-100 text-gray-700";
  }

  async function handleReviewAndForward() {
    if (!issue) return;
    setUpdating(true);
    try {
      // First mark as under review
      await issuesService.updateStatus(
        issue.id,
        "under_officer_review",
        "Issue taken under officer review",
      );
      // Then forward to admin
      const response = await issuesService.updateStatus(
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
      const response = await issuesService.updateStatus(
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

  if (loading) {
    return (
      <div>
        <DashboardHeader title="Issue Details" subtitle="Loading..." />
        <div className="flex items-center justify-center min-h-[400px] bg-gray-100">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (!issue) {
    return (
      <div>
        <DashboardHeader title="Issue Details" subtitle="Not Found" />
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-100 gap-4">
          <AlertCircle className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500">Issue not found</p>
          <Button asChild>
            <Link href="/officer-dashboard/issues">Back to Issues</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <DashboardHeader
        title="Issue Details"
        subtitle={`Case ID: ${issue.case_id || `#${issue.id}`}`}
      >
        <Button variant="outline" asChild>
          <Link href="/officer-dashboard/issues">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Issues
          </Link>
        </Button>
      </DashboardHeader>

      <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
        {/* Header with Title and Status */}
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {issue.title}
            </h1>
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor(issue.status)} border-0`}>
                {issue.status.replace(/_/g, " ")}
              </Badge>
              <Badge className={`${getPriorityColor(issue.priority)} border-0`}>
                {issue.priority}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {issue.category}
              </Badge>
            </div>
          </div>
        </div>

        {/* Issue Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-gray-600" />
              Issue Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Description
              </h3>
              <IssueDescription
                description={issue.description}
                className="text-gray-600 prose prose-sm max-w-none"
              />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Location</p>
                  <p className="text-gray-600">{issue.location}</p>
                  {issue.latitude && issue.longitude && (
                    <p className="text-xs text-gray-400 mt-1">
                      {issue.latitude}, {issue.longitude}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Date Submitted
                  </p>
                  <p className="text-gray-600">
                    {new Date(issue.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Reporter</p>
                  <p className="text-gray-600">
                    {issue.reporter_name || "Anonymous"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact</p>
                  <p className="text-gray-600">
                    {issue.reporter_phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Images */}
            {issue.images && issue.images.length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Images
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {issue.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={image}
                        alt={`Issue image ${index + 1}`}
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
            )}
          </CardContent>
        </Card>

        {/* Officer Actions */}
        {(issue.status === "submitted" ||
          issue.status === "under_officer_review") && (
          <Card>
            <CardHeader>
              <CardTitle>Officer Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Add Comment (Optional)
                </label>
                <Textarea
                  placeholder="Add notes or comments about this issue..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                {issue.status === "submitted" && (
                  <Button
                    onClick={handleMarkUnderReview}
                    disabled={updating}
                    variant="outline"
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
                  className="bg-indigo-700 hover:bg-indigo-800"
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
          <Card className="border-indigo-200 bg-indigo-50">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <p className="text-indigo-700 font-medium">
                  This issue has been forwarded to the admin for further
                  processing.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
