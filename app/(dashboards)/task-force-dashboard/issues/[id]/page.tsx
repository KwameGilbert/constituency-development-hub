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

  TrendingUp,
  DollarSign,
  Users,
  CheckCircle,
  Target,
  Search,
  Loader2,
} from "lucide-react";
import SanitizedHtml from "@/components/ui/SanitizedHtml";
import IssueDescription from "@/components/ui/IssueDescription";

import { Issue as ApiIssue } from "@/lib/services/issues-service";
import { taskForceService } from "@/lib/services/task-force-service";

// UI Type definition for detailed issue display
interface UiIssue extends Omit<ApiIssue, "assessment_report"> {
  assessment_report?: RawAssessmentData;
  community: string;
  submitter: {
    name: string;
    role: string;
    phone: string;
    email: string;
    gender?: string;
    address?: string;
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
    summary?: string;
    findings?: string;
    recommendations?: string;
    requiredResources?: {
      item: string;
      quantity: number;
      estimatedCost?: number;
      justification?: string;
    }[];
  };
  attachments: {
    name: string;
    type: string;
    size: string;
    uploadDate: string;
    url?: string;
  }[];
  timeline: { id: string; date: string; event: string; type: string }[];
  relatedIssues: { id: number; title: string; status: string }[];
  sector?: string;
  detailedDescription?: string;
  submissionDate: string;
  lastUpdated: string;
}

// Interface for the raw assessment data that might come from the API
interface RawAssessmentData {
  images?: string | string[];
  documents?: string | string[];
  created_at?: string;
  estimated_cost?: string | number;
  severity?: string;
  assessment_summary?: string;
  findings?: string;
  recommendations?: string;
  required_resources?: {
    item: string;
    quantity: number;
    estimatedCost?: number;
    justification?: string;
  }[];
  review_notes?: string; // Admin feedback
}

// Helper to adapt API response to UI shape
const adaptIssueToUi = (
  apiIssue: Omit<ApiIssue, "assessment_report"> & {
    assessment_report?: RawAssessmentData;
    assessment?: RawAssessmentData;
  }
): UiIssue => {
    const toDisplayName = (value: unknown): string | undefined => {
      if (typeof value === "string") return value;
      if (value && typeof value === "object" && "name" in value) {
        const name = (value as { name?: unknown }).name;
        return typeof name === "string" ? name : undefined;
      }
      return undefined;
    };

    const apiIssueAny = apiIssue as Record<string, unknown>;

    // Helper to safely parse file fields which might be JSON strings or arrays
  const parseFiles = (field: string | string[] | undefined | null): string[] => {
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
          try { 
              const parsed = JSON.parse(field);
              return Array.isArray(parsed) ? parsed : [];
          } catch { return []; }
      }
      return [];
  }
  
    // Fallback to check both 'assessment_report' (new) and 'assessment' (legacy/potential backend mismatch)
    const assessment = apiIssue.assessment_report || apiIssue.assessment;
    
    console.log("DEBUG: Raw API Issue:", apiIssue);
    console.log("DEBUG: Raw Assessment:", assessment);
    console.log("DEBUG: apiIssue.images:", apiIssue.images, typeof apiIssue.images);
    if (assessment) {
        console.log("DEBUG: assessment.images:", assessment.images, typeof assessment.images);
        console.log("DEBUG: assessment.documents:", assessment.documents, typeof assessment.documents);
    }
    
    // Parse assessment attachments
    let assessmentImages: string[] = [];
    let assessmentDocs: string[] = [];
    
    if (assessment) {
        assessmentImages = parseFiles(assessment.images);
        assessmentDocs = parseFiles(assessment.documents);
    }
  
    // Parse issue images safely
    const issueImagesList = parseFiles(apiIssue.images);
  
    const issueAttachments = issueImagesList.map((img: string, i: number) => ({
        name: `Issue Image ${i + 1}`,
        type: "image",
        size: "N/A",
        uploadDate: apiIssue.created_at,
        url: img 
      }));
  
    const assessmentAttachments = [
        ...assessmentImages.map((img: string, i: number) => ({
            name: `Assessment Image ${i + 1}`,
            type: "image",
            size: "N/A",
            uploadDate: assessment?.created_at || apiIssue.created_at,
            url: img
        })),
        ...assessmentDocs.map((doc: string, i: number) => ({
            name: `Assessment Doc ${i + 1}`,
            type: "document",
            size: "N/A",
            uploadDate: assessment?.created_at || apiIssue.created_at,
            url: doc
        }))
    ];
  
    return {
      ...apiIssue,
      community: apiIssue.location || "Unknown Community",
      submissionDate: apiIssue.created_at,
      lastUpdated: apiIssue.updated_at || apiIssue.created_at,
      sector: toDisplayName(apiIssueAny.sector) || "General",
      subsector:
        toDisplayName(apiIssueAny.subsector) ||
        toDisplayName(apiIssueAny.sub_sector) ||
        undefined,
      detailedDescription: apiIssue.description, 
      submitter: {
        name:
          apiIssue.reporter_name ||
          (typeof apiIssueAny.constituent_name === "string"
            ? apiIssueAny.constituent_name
            : "Anonymous"),
        role: "Community Member",
        phone:
          apiIssue.reporter_phone ||
          (typeof apiIssueAny.constituent_contact === "string"
            ? apiIssueAny.constituent_contact
            : "N/A"),
        email:
          (typeof apiIssueAny.reporter_email === "string"
            ? apiIssueAny.reporter_email
            : undefined) ||
          (typeof apiIssueAny.constituent_email === "string"
            ? apiIssueAny.constituent_email
            : "N/A"),
        gender:
          (typeof apiIssueAny.reporter_gender === "string"
            ? apiIssueAny.reporter_gender
            : undefined) ||
          (typeof apiIssueAny.constituent_gender === "string"
            ? apiIssueAny.constituent_gender
            : undefined),
        address:
          (typeof apiIssueAny.reporter_address === "string"
            ? apiIssueAny.reporter_address
            : undefined) ||
          (typeof apiIssueAny.constituent_address === "string"
            ? apiIssueAny.constituent_address
            : undefined),
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
      impactAssessment: assessment ? {
        affectedPopulation: 0, // Not currently in assessment report
        householdsAffected: 0, // Not currently in assessment report
        estimatedCost: Number(assessment.estimated_cost) || 0,
        urgencyLevel: assessment.severity || apiIssue.priority,
        environmentalImpact: "See Findings", // Not structurally in report
        economicImpact: "See Findings",
        socialImpact: "See Findings",
        summary: assessment.assessment_summary,
        findings: assessment.findings,
        recommendations: assessment.recommendations,
        requiredResources: assessment.required_resources
      } : {
        affectedPopulation: 0,
        householdsAffected: 0,
        estimatedCost: 0,
        urgencyLevel: "N/A",
        environmentalImpact: "Not Assessed",
        economicImpact: "Not Assessed",
        socialImpact: "Not Assessed",
      },
      // Map review notes from assessment report if available
      assessment_report: assessment ? { ...assessment, review_notes: assessment.review_notes } : undefined, 
      status: apiIssue.status, // Ensure status is passed through
      attachments: [...issueAttachments, ...assessmentAttachments],
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
  
            {[
              "resources_allocated",
              "resolution_in_progress",
            ].includes(issue.status) && (
              <Link href={`/task-force-dashboard/resolve/${issue.id}`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve Issue
                </Button>
              </Link>
            )}
  
            {/* {[
              "resources_allocated",
              "resolution_in_progress",
            ].includes(issue.status) && (
              <Link href={`/task-force-dashboard/resolve/${issue.id}`}>
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve Issue
                </Button>
              </Link>
            )} */}
          </div>
        </div>
  
        {/* Review Feedback Alert */}
        {issue.assessment_report?.review_notes && 
         (issue.status === 'assessment_in_progress' || issue.status === 'pending_assessment') && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm animate-pulse">
              <div className="flex items-start">
                 <AlertTriangle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                 <div>
                    <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">
                       Attention Needed: Admin Feedback
                    </h3>
                    <p className="text-sm text-red-700 mt-1 whitespace-pre-wrap font-medium">
                       {issue.assessment_report.review_notes}
                    </p>
                    <p className="text-xs text-red-500 mt-2">
                       Please review the feedback above and re-submit your assessment.
                    </p>
                 </div>
              </div>
          </div>
        )}
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="assessment">Assessment</TabsTrigger>
              <TabsTrigger value="allocation">Allocation</TabsTrigger>
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
                      <IssueDescription
                        description={issue.description}
                        className="leading-relaxed mb-4 prose prose-sm max-w-none text-slate-700"
                      />

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
                        Sub-Sector
                      </Label>
                      <p className="font-medium">{issue.subsector || "N/A"}</p>
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
            </TabsContent>

            <TabsContent value="assessment" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Impact Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  {issue.impactAssessment && issue.impactAssessment.summary ? ( 
                    <>
                      {/* Assessment Summary & Findings */}
                      {(issue.impactAssessment.summary || issue.impactAssessment.findings) && (
                          <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                             <div className="mb-4">
                               <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-purple-600"/> Assessment Summary
                               </h4>
                               <p className="text-sm text-gray-700 whitespace-pre-wrap">{issue.impactAssessment.summary || "No summary provided."}</p>
                             </div>
                             
                             {issue.impactAssessment.findings && (
                                 <div className="pt-4 border-t border-slate-200">
                                   <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                      <Search className="h-4 w-4 text-blue-600"/> Findings
                                   </h4>
                                   <p className="text-sm text-gray-700 whitespace-pre-wrap">{issue.impactAssessment.findings}</p>
                                 </div>
                             )}

                             {issue.impactAssessment.recommendations && (
                                 <div className="pt-4 mt-4 border-t border-slate-200">
                                   <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                      <CheckCircle className="h-4 w-4 text-green-600"/> Recommendations
                                   </h4>
                                   <p className="text-sm text-gray-700 whitespace-pre-wrap">{issue.impactAssessment.recommendations}</p>
                                 </div>
                             )}
                          </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-blue-600">
                            {issue.impactAssessment.affectedPopulation || "-"}
                          </p>
                          <p className="text-xs text-gray-600">
                            People Affected
                          </p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <Target className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <p className="text-2xl font-bold text-green-600">
                            {issue.impactAssessment.householdsAffected || "-"}
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
                    <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                      <FileText className="h-12 w-12 text-gray-300 mb-2" />
                      <p className="text-lg font-medium">No assessment report available yet.</p>
                      <p className="text-sm">Once the task force submits their assessment, the details will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="allocation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Resource Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {issue.allocated_budget || (issue.allocated_resources && issue.allocated_resources.length > 0) ? (
                    <>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Allocated Budget</h3>
                        <p className="text-2xl font-bold text-green-700">
                          {issue.allocated_budget ? `GHS ${Number(issue.allocated_budget).toLocaleString()}` : "N/A"}
                        </p>
                      </div>

                      {issue.allocated_resources && issue.allocated_resources.length > 0 && (
                        <div>
                          <h3 className="text-sm font-semibold text-gray-700 mb-3">Allocated Materials & Resources</h3>
                          <div className="border rounded-md divide-y">
                            {issue.allocated_resources.map((res, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 bg-white">
                                <div>
                                  <p className="font-medium text-gray-900">{res.item}</p>
                                  <p className="text-xs text-gray-500 capitalize">{res.type}</p>
                                </div>
                                <Badge variant="secondary">Qty: {res.quantity}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                       )}

                       {/* New: Required Resources (Materials) */}
                       {issue.impactAssessment?.requiredResources && issue.impactAssessment.requiredResources.length > 0 && (
                          <div className="mb-6">
                             <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-green-600"/> Required Materials (Requested)
                             </h4>
                             <div className="border rounded-md divide-y border-slate-200 bg-white">
                                {issue.impactAssessment.requiredResources.map((res, idx) => (
                                   <div key={idx} className="flex justify-between items-center p-3">
                                      <div>
                                         <p className="font-medium text-gray-900 text-sm">{res.item}</p>
                                         <p className="text-xs text-gray-500">{res.justification || "No justification"}</p>
                                      </div>
                                      <div className="flex items-center gap-3">
                                         {res.estimatedCost && <span className="text-xs text-gray-600">Est: {res.estimatedCost}</span>}
                                         <Badge variant="secondary" className="text-xs">Qty: {res.quantity}</Badge>
                                      </div>
                                    </div>
                                ))}
                             </div>
                          </div>
                       )}
                    </>
                  ) : (
                    <div className="p-8 text-center border rounded-lg bg-gray-50 border-dashed">
                      <p className="text-gray-500 italic">No resources allocated yet.</p>
                      <p className="text-xs text-gray-400 mt-1">Pending admin approval and allocation.</p>
                    </div>
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
                  <IssueDescription
                    description={issue.detailedDescription || issue.description}
                    className="leading-relaxed prose prose-sm max-w-none text-slate-700"
                  />
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
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${attachment.type === 'image' ? 'bg-blue-100' : 'bg-red-100'}`}>
                                {attachment.type === "image" ? (
                                  <Camera className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <FileText className="h-5 w-5 text-red-600" />
                                )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{attachment.name}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                {new Date(attachment.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          {attachment.url ? (
                              <a 
                                href={attachment.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center h-9 px-3 rounded-md border border-gray-200 bg-white hover:bg-gray-100 text-sm font-medium transition-colors"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </a>
                          ) : (
                              <Button size="sm" variant="outline" disabled>
                                <Download className="h-4 w-4 mr-2" />
                                Unavailable
                              </Button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                        <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500 italic">No attachments found.</p>
                      </div>
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
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Phone
                </Label>
                <p>{issue.submitter.phone || "N/A"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-500">
                  Email
                </Label>
                <p>{issue.submitter.email || "N/A"}</p>
              </div>
              {issue.submitter.gender && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Gender
                  </Label>
                  <p className="capitalize">{issue.submitter.gender}</p>
                </div>
              )}
              {issue.submitter.address && (
                <div>
                  <Label className="text-sm font-medium text-gray-500">
                    Address
                  </Label>
                  <p>{issue.submitter.address}</p>
                </div>
              )}

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
