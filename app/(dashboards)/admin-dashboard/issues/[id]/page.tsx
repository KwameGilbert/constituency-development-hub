import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { issuesService, Issue, ResourceItem } from "@/lib/services/issues-service";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Phone,
  AlertCircle,
  CheckCircle,
  Camera,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IssueActions } from "@/components/admin-dashboard/issues/IssueActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sanitizeHtml } from "@/lib/utils";

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let issue: Issue | null = null;

  try {
    const response = await issuesService.getIssueById(id);
    if (response && response.success && response.data.report) {
      issue = response.data.report;
      
      // Map backend fields to frontend expectations if necessary
      if (issue.resolution_report && !issue.resolution) {
        issue.resolution = issue.resolution_report;
        
        // Ensure images are arrays (handle potential JSON strings from backend)
        if (issue.resolution) {
          const rawResolution = issue.resolution as unknown as { before_images?: unknown; after_images?: unknown };

          if (typeof rawResolution.before_images === 'string') {
            try {
              issue.resolution.before_images = JSON.parse(rawResolution.before_images);
            } catch (e) {
              issue.resolution.before_images = [];
            }
          }
          
          if (typeof rawResolution.after_images === 'string') {
            try {
              issue.resolution.after_images = JSON.parse(rawResolution.after_images);
            } catch (e) {
              issue.resolution.after_images = [];
            }
          }
        }
      }
      if (issue.assessment_report && !issue.assessment) {
        issue.assessment = issue.assessment_report;
      }
    } else {
      issue = null;
    }
  } catch (error) {
    console.error("Failed to fetch issue details:", error);
    issue = null;
  }

  if (!issue) return notFound();

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

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Issue Details" />
      <div className="flex-1 p-8 space-y-6 max-w-6xl mx-auto w-full">
        {/* Back Button & Header */}
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard/issues">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-900">
                {issue.title}
              </h1>
              <Badge className={`${getStatusColor(issue.status)} border-0`}>
                {issue.status.replace(/_/g, " ")}
              </Badge>
              <Badge className={`${getPriorityColor(issue.priority)} border-0`}>
                {issue.priority}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm">
              Case ID: {issue.case_id || `#${issue.id}`}
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="assessment">Assessment</TabsTrigger>
            <TabsTrigger value="resolution">Resolution</TabsTrigger>
            <TabsTrigger value="allocation">Allocation</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* ... keeping existing overview content ... */}
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
                  <div
                    className="text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(issue.description) }}
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

                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Category</p>
                      <p className="text-gray-600 capitalize">{issue.category}</p>
                    </div>
                  </div>
                </div>

                {/* Images - Hidden in Overview since they are in Attachments now, or keep them? Keeping them for quick view */}
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
          </TabsContent>

          <TabsContent value="assessment" className="space-y-6">
            {/* Assessment Details (if assessment exists) */}
            {(() => {
              // Normalized access to handle potential API inconsistencies (assessment_report vs assessment)
              const assessment = issue.assessment_report || issue.assessment;
              
              return assessment ? (
              <Card className={`
                transition-all duration-300
                ${assessment.status === 'rejected' ? 'border-red-500 border-2 shadow-red-100' : ''}
                ${assessment.status === 'needs_revision' ? 'border-orange-500 border-2 shadow-orange-100' : ''}
                ${assessment.status === 'approved' ? 'border-green-500 border-2 shadow-green-100' : ''}
              `}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className={`h-5 w-5 ${
                      assessment.status === 'rejected' ? 'text-red-600' : 
                      assessment.status === 'approved' ? 'text-green-600' : 
                      'text-blue-600'
                    }`} />
                    Task Force Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   {/* Status Badge */}
                   <div className="flex justify-end items-center gap-2">
                      <span className="text-xs text-gray-400 font-mono">DEBUG_STATUS: [{assessment.status}]</span>
                      <Badge variant={assessment.status === 'approved' ? 'default' : assessment.status === 'rejected' ? 'destructive' : 'secondary'}>
                        Status: {assessment.status ? assessment.status.toUpperCase() : 'SUBMITTED'}
                      </Badge>
                   </div>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <h3 className="text-sm font-semibold text-gray-700 mb-2">Assessment Summary</h3>
                       <p className="text-sm text-gray-600 whitespace-pre-wrap border p-3 rounded-md bg-slate-50">{assessment.assessment_summary}</p>
                    </div>
                    <div>
                       <h3 className="text-sm font-semibold text-gray-700 mb-2">Findings</h3>
                       <p className="text-sm text-gray-600 whitespace-pre-wrap border p-3 rounded-md bg-slate-50">{assessment.findings || "No specific findings recorded."}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                     <div>
                        <span className="text-xs text-gray-500 font-medium uppercase">Severity</span>
                        <p className="font-semibold capitalize text-gray-900">{assessment.severity}</p>
                     </div>
                     <div>
                        <span className="text-xs text-gray-500 font-medium uppercase">Issue Confirmed</span>
                        <p className={`font-semibold ${assessment.issue_confirmed ? 'text-green-600' : 'text-red-600'}`}>
                          {assessment.issue_confirmed ? "YES" : "NO"}
                        </p>
                     </div>
                     <div>
                        <span className="text-xs text-gray-500 font-medium uppercase">Est. Cost</span>
                        <p className="font-semibold text-gray-900">{assessment.estimated_cost || "N/A"}</p>
                     </div>
                     <div>
                        <span className="text-xs text-gray-500 font-medium uppercase">Est. Duration</span>
                        <p className="font-semibold text-gray-900">{assessment.estimated_duration || "N/A"}</p>
                     </div>
                  </div>

                  {assessment.recommendations && (
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Recommendations</h3>
                      <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-800 whitespace-pre-wrap">
                        {assessment.recommendations}
                      </div>
                    </div>
                  )}

                  {assessment.required_resources && assessment.required_resources.length > 0 && (
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">Required Resources</h3>
                      <div className="border rounded-md divide-y">
                         {assessment.required_resources.map((res: ResourceItem, idx: number) => (
                               <div key={idx} className="flex justify-between p-2 text-sm">
                                 <span>{res.item} <span className="text-slate-500 text-xs capitalize">({res.type})</span></span>
                                 <span className="font-medium">Qty: {res.quantity}</span>
                               </div>
                            ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
                <div className="p-8 text-center border rounded-lg bg-gray-50 border-dashed">
                  <p className="text-gray-500 italic">No assessment report available yet.</p>
                </div>
            );
            })()}
          </TabsContent>

          <TabsContent value="resolution" className="space-y-6">
            {/* Resolution Report (if submitted) */}
            {issue.resolution ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Task Force Resolution Report
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex justify-end">
                      <Badge variant={issue.resolution.status === 'approved' ? 'default' : issue.resolution.status === 'rejected' ? 'destructive' : 'secondary'}>
                        Status: {issue.resolution.status ? issue.resolution.status.toUpperCase() : 'SUBMITTED'}
                      </Badge>
                   </div>

                   <div className="space-y-4">
                      <div>
                         <h3 className="text-sm font-semibold text-gray-700 mb-2">Resolution Summary</h3>
                         <p className="text-sm text-gray-600 border p-3 rounded-md bg-slate-50">{issue.resolution.resolution_summary}</p>
                      </div>
                      <div>
                         <h3 className="text-sm font-semibold text-gray-700 mb-2">Detailed Work Description</h3>
                         <p className="text-sm text-gray-600 whitespace-pre-wrap border p-3 rounded-md bg-slate-50">{issue.resolution.work_description}</p>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                      <div>
                         <span className="text-xs text-gray-500 font-medium uppercase">Actual Cost</span>
                         <p className="font-semibold text-gray-900">
                             {issue.resolution.actual_cost ? `₵${issue.resolution.actual_cost.toLocaleString()}` : "N/A"}
                         </p>
                      </div>
                      <div>
                         <span className="text-xs text-gray-500 font-medium uppercase">Start Date</span>
                         <p className="font-semibold text-gray-900">
                           {issue.resolution.start_date 
                             ? new Date(issue.resolution.start_date).toLocaleDateString() 
                             : "N/A"}
                         </p>
                      </div>
                      <div>
                         <span className="text-xs text-gray-500 font-medium uppercase">Completion Date</span>
                         <p className="font-semibold text-gray-900">
                           {issue.resolution.completion_date 
                             ? new Date(issue.resolution.completion_date).toLocaleDateString() 
                             : "N/A"}
                         </p>
                      </div>
                   </div>

                   {/* Before/After Images */}
                   {(issue.resolution.before_images?.length ?? 0) > 0 || (issue.resolution.after_images?.length ?? 0) > 0 ? (
                     <div className="pt-4 border-t grid md:grid-cols-2 gap-6">
                        {(issue.resolution.before_images?.length ?? 0) > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Before Photos</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {issue.resolution.before_images?.map((img, i) => (
                                        <div key={i} className="aspect-square bg-gray-100 rounded border overflow-hidden">
                                            <img src={img} alt="Before" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {(issue.resolution.after_images?.length ?? 0) > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">After Photos</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {issue.resolution.after_images?.map((img, i) => (
                                        <div key={i} className="aspect-square bg-gray-100 rounded border overflow-hidden">
                                            <img src={img} alt="After" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                     </div>
                   ) : null}

                   {issue.resolution.challenges_faced && (
                      <div className="pt-4 border-t">
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">Challenges Faced</h3>
                          <p className="text-sm text-gray-600 italic">{issue.resolution.challenges_faced}</p>
                      </div>
                   )}
                </CardContent>
              </Card>
            ) : (
                <div className="p-8 text-center border rounded-lg bg-gray-50 border-dashed">
                  <p className="text-gray-500 italic">No resolution report available yet.</p>
                </div>
            )}
          </TabsContent>

          <TabsContent value="allocation" className="space-y-6">
            {/* Resource Allocation (if allocated) */}
            {issue.allocated_budget || issue.allocated_resources ? (
              <Card>
                <CardHeader>
                  <CardTitle>Resource Allocation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Allocated Budget
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      GHS {(issue.allocated_budget || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Resources
                    </p>
                    <div className="space-y-2">
                      {issue.allocated_resources && issue.allocated_resources.length > 0 ? (
                          issue.allocated_resources.map((resource, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {resource.item}
                                </p>
                                <p className="text-sm text-gray-500 capitalize">
                                  {resource.type}
                                </p>
                              </div>
                              <Badge variant="secondary">
                                Qty: {resource.quantity}
                              </Badge>
                            </div>
                          ))
                      ) : (
                          <p className="text-sm text-gray-500">No specific items allocated other than budget.</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
                <div className="p-8 text-center border rounded-lg bg-gray-50 border-dashed">
                  <p className="text-gray-500 italic">No resources allocated yet.</p>
                </div>
            )}
          </TabsContent>

          <TabsContent value="attachments" className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Supporting Documents & Files</CardTitle>
                </CardHeader>
                <CardContent>
                    {(() => {
                        // Helper to parse lists safely
                        const parseList = (field: any) => {
                             if (Array.isArray(field)) return field;
                             if (typeof field === 'string') {
                                 try { return JSON.parse(field); } catch { return []; }
                             }
                             return [];
                         };

                        const issueImages = parseList(issue?.images).map((url: any) => ({ type: 'image', url, name: 'Issue Image', date: issue?.created_at }));
                        const assessment = issue?.assessment_report || issue?.assessment;
                        
                        let assessmentFiles = [];
                        if (assessment) {
                             const aImages = parseList(assessment.images).map((url: any) => ({ type: 'image', url, name: 'Assessment Image', date: assessment.created_at }));
                             const aDocs = parseList(assessment.documents).map((url: any) => ({ type: 'document', url, name: 'Assessment Document', date: assessment.created_at }));
                             assessmentFiles = [...aImages, ...aDocs];
                        }
                        
                        const allAttachments = [...issueImages, ...assessmentFiles];

                        if (allAttachments.length === 0) {
                            return (
                                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
                                    <p className="text-gray-500 italic">No attachments found.</p>
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-3">
                                {allAttachments.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${file.type === 'image' ? 'bg-blue-100' : 'bg-red-100'}`}>
                                                {file.type === 'image' ? (
                                                  <Camera className="h-5 w-5 text-blue-600" />
                                                ) : (
                                                  <FileText className="h-5 w-5 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{file.name} {idx + 1}</p>
                                                <p className="text-xs text-gray-500">
                                                    Uploaded {file.date ? new Date(file.date).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <a 
                                            href={file.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center h-9 px-3 rounded-md border border-gray-200 bg-white hover:bg-gray-100 text-sm font-medium transition-colors"
                                        >
                                            View / Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        );
                    })()}
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Admin Actions */}
        <IssueActions issue={issue} />
      </div>
    </div>
  );
}
