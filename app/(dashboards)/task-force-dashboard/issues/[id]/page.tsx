"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Camera,
  Download,
  MessageSquare,
  Clock,
  AlertTriangle,
  Phone,
  Mail,
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Target,
  Loader2,
} from "lucide-react";

import { Issue as ApiIssue } from "@/lib/services/issues-service";
import { taskForceService } from "@/lib/services/task-force-service";

// UI Type definition matching the previous mock structure
interface UiIssue extends ApiIssue {
  community: string;
  submitter: {
    name: string;
    role: string;
    phone: string;
    email: string;
    alternateContact?: string;
  };
  location_details: {
    // Renamed from location to avoid conflict with string location in ApiIssue
    address: string;
    gps: string;
    nearestLandmark?: string;
    accessRoute?: string;
  };
  impactAssessment?: {
    affectedPopulation: number;
    householdsAffected: number;
    estimatedCost: number;
    urgencyLevel: string;
    environmentalImpact: string;
    economicImpact: string;
    socialImpact: string;
  };
  attachments: {
    name: string;
    type: string;
    size: string;
    uploadDate: string;
  }[];
  timeline: { id: string; date: string; event: string; type: string }[];
  relatedIssues: { id: number; title: string; status: string }[];
  sector?: string;
  detailedDescription?: string;
  submissionDate: string;
  lastUpdated: string;
}

// Helper to adapt API response to UI shape
const adaptIssueToUi = (apiIssue: ApiIssue): UiIssue => {
  return {
    ...apiIssue,
    community: apiIssue.location || "Unknown Community",
    submissionDate: apiIssue.created_at,
    lastUpdated: apiIssue.updated_at || apiIssue.created_at,
    sector: "General", // Default
    detailedDescription: apiIssue.description, // Reusing description if detailed not available
    submitter: {
      name: apiIssue.reporter_name || "Anonymous",
      role: "Community Member",
      phone: apiIssue.reporter_phone || "N/A",
      email: "N/A",
    },
    location_details: {
      address: apiIssue.location || "",
      gps:
        apiIssue.latitude && apiIssue.longitude
          ? `${apiIssue.latitude}, ${apiIssue.longitude}`
          : "N/A",
      nearestLandmark: "N/A",
      accessRoute: "N/A",
    },
    impactAssessment: {
      affectedPopulation: 0,
      householdsAffected: 0,
      estimatedCost: apiIssue.allocated_budget || 0,
      urgencyLevel: apiIssue.priority,
      environmentalImpact: "Not Assessed",
      economicImpact: "Not Assessed",
      socialImpact: "Not Assessed",
    },
    attachments: (apiIssue.images || []).map((img, i) => ({
      name: `Image ${i + 1}`,
      type: "image",
      size: "N/A",
      uploadDate: apiIssue.created_at,
    })),
    timeline:
      (apiIssue.timeline || []).length > 0
        ? apiIssue.timeline!
        : [
            {
              id: "1",
              date: apiIssue.created_at,
              event: "Issue Submitted",
              type: "submission",
            },
          ],
    relatedIssues: [],
  };
};

const getStatusColor = (status: string) => {
  // Reuse specific logic or fallback to lib/data
  switch (status) {
    case "pending_assessment":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "assigned_to_task_force":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "under_assessment":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "assessment_in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
    case "urgent":
      return "bg-red-100 text-red-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "low":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function IssueDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [issue, setIssue] = useState<UiIssue | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await taskForceService.getIssue(id);
        if (response.success && response.data.issue) {
          // Cast to ApiIssue as API returns full object similar to Issue
          setIssue(adaptIssueToUi(response.data.issue as unknown as ApiIssue));
        }
      } catch (error) {
        console.error("Failed to fetch issue:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Issue Not Found</h2>
        <Button className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
            <Badge className={getStatusColor(issue.status)}>
              {issue.status
                .replace(/_/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          </div>
          <p className="text-gray-600">
            Issue #{issue.id} • {issue.community}
          </p>
        </div>
        <div className="flex gap-2">
          {[
            "submitted",
            "pending_assessment",
            "assigned_to_task_force",
            "assessment_in_progress",
            "under_review",
          ].includes(issue.status) && (
            <Link href={`/task-force-dashboard/assess/${issue.id}`}>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="h-4 w-4 mr-2" />
                Assess Issue
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Issue Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {issue.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Category
                      </Label>
                      <p className="font-medium">{issue.category}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Sector
                      </Label>
                      <p className="font-medium">{issue.sector}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">
                        Priority
                      </Label>
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority.charAt(0).toUpperCase() +
                          issue.priority.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Impact Assessment */}
              <Card>
                <CardHeader>
                  <CardTitle>Impact Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  {issue.impactAssessment ? (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-600">
                            {issue.impactAssessment.affectedPopulation}
                          </p>
                          <p className="text-xs text-gray-600">
                            People Affected
                          </p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">
                            {issue.impactAssessment.householdsAffected}
                          </p>
                          <p className="text-xs text-gray-600">Households</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-purple-600">
                            ₵
                            {issue.impactAssessment.estimatedCost.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600">Est. Cost</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-red-600 capitalize">
                            {issue.impactAssessment.urgencyLevel}
                          </p>
                          <p className="text-xs text-gray-600">Urgency</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Social Impact
                          </Label>
                          <p className="font-medium capitalize">
                            {issue.impactAssessment.socialImpact}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Economic Impact
                          </Label>
                          <p className="font-medium capitalize">
                            {issue.impactAssessment.economicImpact}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Environmental Impact
                          </Label>
                          <p className="font-medium capitalize">
                            {issue.impactAssessment.environmentalImpact}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">
                      No impact assessment available yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {issue.detailedDescription || issue.description}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Address
                    </Label>
                    <p className="font-medium">
                      {issue.location_details.address}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      GPS Coordinates
                    </Label>
                    <p className="font-medium">{issue.location_details.gps}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Nearest Landmark
                    </Label>
                    <p className="font-medium">
                      {issue.location_details.nearestLandmark}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">
                      Access Route
                    </Label>
                    <p className="font-medium">
                      {issue.location_details.accessRoute}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attachments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                  <CardDescription>
                    Files and evidence provided with this issue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {issue.attachments.length > 0 ? (
                      issue.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            {attachment.type === "image" ? (
                              <Camera className="h-6 w-6 text-blue-600" />
                            ) : (
                              <FileText className="h-6 w-6 text-gray-600" />
                            )}
                            <div>
                              <p className="font-medium">{attachment.name}</p>
                              <p className="text-sm text-gray-500">
                                {attachment.size} • Uploaded{" "}
                                {new Date(
                                  attachment.uploadDate,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No attachments found.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Issue Timeline</CardTitle>
                  <CardDescription>
                    Chronological history of this issue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {issue.timeline.length > 0 ? (
                      issue.timeline.map((event, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              event.type === "issue"
                                ? "bg-red-100"
                                : event.type === "action"
                                  ? "bg-blue-100"
                                  : event.type === "assessment"
                                    ? "bg-yellow-100"
                                    : event.type === "submission"
                                      ? "bg-purple-100"
                                      : "bg-green-100"
                            }`}
                          >
                            {event.type === "issue" ? (
                              <AlertTriangle className="h-4 w-4 text-red-600" />
                            ) : event.type === "action" ? (
                              <TrendingUp className="h-4 w-4 text-blue-600" />
                            ) : event.type === "assessment" ? (
                              <FileText className="h-4 w-4 text-yellow-600" />
                            ) : event.type === "submission" ? (
                              <MessageSquare className="h-4 w-4 text-purple-600" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{event.event}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No timeline events available.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submitter Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submitted By</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Name
                </Label>
                <p className="font-medium">{issue.submitter.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Role
                </Label>
                <p>{issue.submitter.role}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{issue.submitter.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{issue.submitter.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Submitted</p>
                  <p className="text-gray-600">
                    {new Date(issue.submissionDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p className="text-gray-600">
                    {new Date(issue.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Issues */}
          {issue.relatedIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {issue.relatedIssues.map((relatedIssue) => (
                  <Link
                    key={relatedIssue.id}
                    href={`/task-force-dashboard/issues/${relatedIssue.id}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <p className="font-medium text-sm line-clamp-2">
                      {relatedIssue.title}
                    </p>
                    <Badge
                      className={`mt-1 text-xs ${getStatusColor(relatedIssue.status)}`}
                    >
                      {relatedIssue.status.replace(/_/g, " ")}
                    </Badge>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
