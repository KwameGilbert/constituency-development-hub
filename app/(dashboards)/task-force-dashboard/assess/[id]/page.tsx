"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  FileText,
  Download,
  Save,
  Send,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  User,
  Upload,
  X,
  FileImage,
  Loader2,
} from "lucide-react";
import {
  getStatusColor,
  getPriorityColor,
  formatDate,
  getMetadata,
  getCurrentUser,
} from "@/lib/data";
import { cleanupHtml } from "@/lib/utils";
import { useAssessmentStore } from "@/lib/stores/assessment-store";
import {
  Issue as ApiIssue,
  TimelineEvent,
} from "@/lib/services/issues-service";
import { taskForceService } from "@/lib/services/task-force-service";
import { toast } from "sonner";

// --- Adapter Logic (Client Side View Model) ---

interface UiIssue extends ApiIssue {
  community: string;
  submittedBy: string; // for compatibility with existing UI
  submitter: {
    name: string;
    role: string;
    phone: string;
    email: string;
    alternateContact?: string;
  };
  impactAssessment: {
    affectedPopulation: number;
    householdsAffected: number;
    estimatedCost: number;
    urgencyLevel: string;
    environmentalImpact: string;
    economicImpact: string;
    socialImpact: string;
  };
  review_notes?: string; // Added field
  attachments: {
    id: number;
    name: string;
    type: string;
    size: string;
    uploadDate: string;
  }[];
  timeline: TimelineEvent[];
  sector?: string;
  submissionDate: string;
}

const adaptIssueToUi = (apiIssue: ApiIssue): UiIssue => {
  return {
    ...apiIssue,
    community: apiIssue.location || "Unknown Community",
    submittedBy: apiIssue.reporter_name || "Anonymous",
    submissionDate: apiIssue.created_at,
    sector: "General",
    submitter: {
      name: apiIssue.reporter_name || "Anonymous",
      role: "Community Member",
      phone: apiIssue.reporter_phone || "N/A",
      email: "N/A",
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
    review_notes:
      apiIssue.assessment?.review_notes ||
      apiIssue.assessment_report?.review_notes, // Map from either source
    attachments: (apiIssue.images || []).map((img, i) => ({
      id: i,
      name: `Image ${i + 1}`,
      type: "image",
      size: "N/A",
      uploadDate: apiIssue.created_at,
    })),
    timeline: [
      {
        id: "1",
        date: apiIssue.created_at,
        event: "Issue Submitted",
        type: "submitted",
      },
    ],
  };
};

export default function AssessIssue() {
  const router = useRouter();
  const params = useParams();
  const idRaw = Array.isArray(params.id) ? params.id[0] : params.id;
  const issueId = idRaw ? parseInt(idRaw) : undefined;

  const [issue, setIssue] = useState<UiIssue | null>(null);
  const [loading, setLoading] = useState(true);

  const metadata = getMetadata();
  const currentUser = getCurrentUser();

  // Zustand store
  const {
    assessment,
    files,
    isSubmitting,
    errors,
    touched,
    setCurrentIssue,
    updateAssessment,
    addFile,
    removeFile,
    setError,
    clearError,
    setTouched,
    setSubmitting,
    resetAssessment,
    saveDraft,
    loadDraft,
    clearDraft,
  } = useAssessmentStore();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize and Fetch Issue
  useEffect(() => {
    if (issueId) {
      setCurrentIssue(issueId);

      // Load any saved draft
      const hasDraft = loadDraft(issueId);
      if (hasDraft) {
        toast.info("Draft restored from your previous session.");
      }

      const fetchIssue = async () => {
        setLoading(true);
        try {
          const response = await taskForceService.getIssue(issueId);
          if (response.success && response.data.issue) {
            setIssue(
              adaptIssueToUi(response.data.issue as unknown as ApiIssue),
            );
          }
        } catch (error) {
          console.error("Failed to fetch issue for assessment:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchIssue();
    }
    return () => {
      // Clean up when leaving the page
      resetAssessment();
    };
  }, [issueId, setCurrentIssue, resetAssessment]);

  // Validation functions (Kept from original)
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "decision":
        return !value ? "Assessment decision is required" : "";
      case "comments":
        if (!value.trim()) return "Comments are required";
        if (value.trim().length < 20)
          return "Comments must be at least 20 characters long";
        if (value.trim().length > 1000)
          return "Comments must not exceed 1000 characters";
        return "";
      case "recommendations":
        if (assessment.decision === "approve" && !value.trim()) {
          return "Recommendations are required for approved issues";
        }
        if (value && value.length > 500)
          return "Recommendations must not exceed 500 characters";
        return "";
      case "estimatedBudget":
        if (assessment.decision === "approve" && !value) {
          return "Budget estimate is required for approved issues";
        }
        if (value && (isNaN(Number(value)) || Number(value) < 0)) {
          return "Budget must be a valid positive number";
        }
        if (value && Number(value) > 10000000) {
          return "Budget seems unreasonably high, please verify";
        }
        return "";
      case "startDate":
        if (assessment.decision === "approve" && !value) {
          return "Start date is required for approved issues";
        }
        if (
          value &&
          assessment.endDate &&
          new Date(value) >= new Date(assessment.endDate)
        ) {
          return "Start date must be before end date";
        }
        return "";
      case "endDate":
        if (assessment.decision === "approve" && !value) {
          return "End date is required for approved issues";
        }
        if (
          value &&
          assessment.startDate &&
          new Date(value) <= new Date(assessment.startDate)
        ) {
          return "End date must be after start date";
        }
        return "";
      default:
        return "";
    }
  };

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    Object.keys(assessment).forEach((key) => {
      const error = validateField(
        key,
        assessment[key as keyof typeof assessment],
      );
      if (error) {
        setError(key, error);
        newErrors[key] = error;
      } else {
        clearError(key);
      }
    });
    return newErrors;
  };

  const handleFieldChange = (name: string, value: string) => {
    updateAssessment(name, value);
  };

  const handleFieldBlur = (name: string) => {
    setTouched(name);
    const error = validateField(
      name,
      assessment[name as keyof typeof assessment],
    );
    if (error) {
      setError(name, error);
    } else {
      clearError(name);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;

    Array.from(selectedFiles).forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        setError(
          "files",
          `File ${file.name} is too large. Maximum size is 10MB.`,
        );
        return;
      }
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("files", `File ${file.name} is not a supported file type.`);
        return;
      }
      addFile(file);
      clearError("files");
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmitAssessment = async () => {
    if (!issueId) return;

    Object.keys(assessment).forEach((key) => {
      setTouched(key);
    });

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.log("Validation failed", validationErrors);
      toast.error("Please fix the form errors before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("assessment_summary", assessment.comments); // specific field name expected by backend
      formData.append("decision", assessment.decision as string); // though backend uses this to derive status/logic potentially

      // Map frontend fields to backend expected fields
      if (assessment.recommendations)
        formData.append("recommendations", assessment.recommendations);
      if (assessment.estimatedBudget)
        formData.append(
          "estimated_cost",
          assessment.estimatedBudget.toString(),
        );
      if (assessment.startDate)
        formData.append("start_date", assessment.startDate);
      if (assessment.endDate) formData.append("end_date", assessment.endDate);

      // Additional fields that might be needed/supported
      formData.append(
        "issue_confirmed",
        assessment.decision !== "reject" ? "1" : "0",
      );

      // Handle file uploads
      files.forEach((file) => {
        if (file.file) {
          if (file.type.startsWith("image/")) {
            formData.append("images[]", file.file);
          } else {
            formData.append("documents[]", file.file);
          }
        }
      });

      await taskForceService.submitAssessment(issueId, formData);

      clearDraft(issueId);
      toast.success("Assessment submitted successfully!");
      router.push("/task-force-dashboard/issues");
    } catch (error: unknown) {
      console.error("Error submitting assessment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Please try again.";
      toast.error(`Error submitting assessment: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "approve":
        return "bg-green-100 text-green-800 border-green-200";
      case "reject":
        return "bg-red-100 text-red-800 border-red-200";
      case "request_more_info":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const assessmentProgress = () => {
    let progress = 0;
    if (assessment.decision) progress += 40;
    if (assessment.comments) progress += 30;
    if (assessment.recommendations) progress += 20;
    if (assessment.estimatedBudget && assessment.decision === "approve")
      progress += 5;
    if (assessment.startDate && assessment.decision === "approve")
      progress += 5;
    return Math.min(progress, 100);
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  // Not Found State
  if (!issue) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Issue Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The issue you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/task-force-dashboard/issues">
            <Button>Back to Issues</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/task-force-dashboard/issues">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Issues
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Assess Issue #{issue.id}
            </h1>
            <p className="text-gray-600">Review and make assessment decision</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={getStatusColor(issue.status)}>
            {metadata.statuses.find((s) => s.value === issue.status)?.label ||
              issue.status}
          </Badge>
          <Badge className={getPriorityColor(issue.priority)}>
            {issue.priority} Priority
          </Badge>
        </div>
      </div>

      {/* Admin Feedback Alert */}
      {issue.review_notes && (
        <Card className="border-red-500 bg-red-50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600 shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 text-lg mb-1">
                  Revision Requested
                </h3>
                <p className="text-red-800 font-medium whitespace-pre-wrap">
                  &ldquo;{issue.review_notes}&rdquo;
                </p>
                <p className="text-sm text-red-600 mt-2">
                  The admin has returned this assessment for the reasons above.
                  Please update the necessary fields and submit again.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress Indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assessment Progress</CardTitle>
          <CardDescription>
            Complete all sections for comprehensive assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion</span>
              <span>{assessmentProgress()}%</span>
            </div>
            <Progress value={assessmentProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issue Details Sidebar Reuse */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {issue.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {cleanupHtml(issue.description)}
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{issue.community}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{issue.submittedBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {formatDate(issue.submissionDate)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium text-gray-900 mb-2">
                  Impact Assessment
                </h4>
                <div className="space-y-2 text-sm">
                  {/* Fallback zeros if missing */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Affected Population:</span>
                    <span className="font-medium">
                      {issue.impactAssessment.affectedPopulation}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Households:</span>
                    <span className="font-medium">
                      {issue.impactAssessment.householdsAffected}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Cost:</span>
                    <span className="font-medium">
                      ₵{issue.impactAssessment.estimatedCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {issue.attachments.length > 0 && (
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Attachments
                  </h4>
                  <div className="space-y-2">
                    {issue.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{attachment.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {attachment.size}
                          </span>
                          <Button size="sm" variant="outline">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Assessment Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assessment Form</CardTitle>
              <CardDescription>
                Provide your assessment and decision for this issue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="assessment" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="assessment">Assessment</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="assessment" className="space-y-6">
                  {/* Decision */}
                  <div className="space-y-2">
                    <Label htmlFor="decision" className="text-sm font-medium">
                      Assessment Decision *
                    </Label>
                    <Select
                      value={assessment.decision}
                      onValueChange={(value) =>
                        handleFieldChange("decision", value)
                      }
                    >
                      <SelectTrigger
                        className={
                          errors.decision && touched.decision
                            ? "border-red-500"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select your decision" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approve">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            Approve for Implementation
                          </div>
                        </SelectItem>
                        <SelectItem value="reject">
                          <div className="flex items-center gap-2">
                            <XCircle className="h-4 w-4 text-red-600" />
                            Reject Request
                          </div>
                        </SelectItem>
                        <SelectItem value="request_more_info">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            Request More Information
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.decision && touched.decision && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.decision}
                      </p>
                    )}
                    {assessment.decision && !errors.decision && (
                      <Badge className={getDecisionColor(assessment.decision)}>
                        {assessment.decision === "approve" && "Approved"}
                        {assessment.decision === "reject" && "Rejected"}
                        {assessment.decision === "request_more_info" &&
                          "More Info Required"}
                      </Badge>
                    )}
                  </div>

                  {/* Comments and other fields remain the same logic... */}
                  <div className="space-y-2">
                    <Label htmlFor="comments" className="text-sm font-medium">
                      Assessment Comments *
                    </Label>
                    <Textarea
                      id="comments"
                      placeholder="Provide detailed comments about your assessment decision..."
                      value={assessment.comments}
                      onChange={(e) =>
                        handleFieldChange("comments", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("comments")}
                      className={`min-h-[120px] ${errors.comments && touched.comments ? "border-red-500" : ""}`}
                    />
                    {/* ... error display ... */}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="recommendations"
                      className="text-sm font-medium"
                    >
                      Recommendations {assessment.decision === "approve" && "*"}
                    </Label>
                    <Textarea
                      id="recommendations"
                      placeholder="Provide recommendations for implementation or next steps..."
                      value={assessment.recommendations}
                      onChange={(e) =>
                        handleFieldChange("recommendations", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("recommendations")}
                      className={`min-h-20 ${errors.recommendations && touched.recommendations ? "border-red-500" : ""}`}
                    />
                    {/* ... error display ... */}
                  </div>

                  {assessment.decision === "approve" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="budget" className="text-sm font-medium">
                          Estimated Budget (₵) *
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="budget"
                            type="number"
                            placeholder="0.00"
                            value={assessment.estimatedBudget}
                            onChange={(e) =>
                              handleFieldChange(
                                "estimatedBudget",
                                e.target.value,
                              )
                            }
                            onBlur={() => handleFieldBlur("estimatedBudget")}
                            className={`pl-10 ${errors.estimatedBudget && touched.estimatedBudget ? "border-red-500" : ""}`}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="startDate"
                          className="text-sm font-medium"
                        >
                          Start Date *
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={assessment.startDate}
                          onChange={(e) =>
                            handleFieldChange("startDate", e.target.value)
                          }
                          onBlur={() => handleFieldBlur("startDate")}
                          className={
                            errors.startDate && touched.startDate
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.startDate && touched.startDate && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.startDate}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="endDate"
                          className="text-sm font-medium"
                        >
                          End Date *
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={assessment.endDate}
                          onChange={(e) =>
                            handleFieldChange("endDate", e.target.value)
                          }
                          onBlur={() => handleFieldBlur("endDate")}
                          min={assessment.startDate || undefined}
                          className={
                            errors.endDate && touched.endDate
                              ? "border-red-500"
                              : ""
                          }
                        />
                        {errors.endDate && touched.endDate && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.endDate}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* File Upload Section - Visual Only for now */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Supporting Documents
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        id="file-upload"
                        multiple
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Files
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        Max 10MB per file. Supported: JPG, PNG, PDF, DOC, DOCX
                      </p>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Uploaded Files ({files.length})
                        </Label>
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded"
                          >
                            <div className="flex items-center gap-2">
                              <FileImage className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{file.name}</span>
                              <span className="text-xs text-gray-500">
                                ({(file.size / 1024 / 1024).toFixed(2)} MB)
                              </span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-6 border-t">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="h-4 w-4" />
                      <span>Assessor: {currentUser.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => {
                          saveDraft();
                          toast.success("Draft saved successfully.");
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save Draft
                      </Button>
                      <Button
                        onClick={handleSubmitAssessment}
                        disabled={isSubmitting}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Clock className="h-4 w-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Submit Assessment
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <div className="space-y-4">
                    {issue.timeline.map((event) => (
                      <div
                        key={event.id}
                        className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="p-2 rounded-full bg-white">
                          <Clock className="h-4 w-4 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {event.event}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(event.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
