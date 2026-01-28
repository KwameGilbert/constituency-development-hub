import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Calendar,
  User,
  Phone,
  Mail,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Edit2,
  FileText,
} from "lucide-react";
import type { Issue } from "@/lib/data";
import { getMetadata } from "@/lib/data";

interface IssueDetailModalProps {
  issue: Issue | null;
  isOpen: boolean;
  onClose: () => void;
  onAssess?: (issueId: string) => void;
  onEdit?: (issueId: string) => void;
}

export function IssueDetailModal({
  issue,
  isOpen,
  onClose,
  onAssess,
  onEdit,
}: IssueDetailModalProps) {
  if (!issue) return null;

  const metadata = getMetadata();

  const priority = metadata.priorities.find((p) => p.level === issue.priority);
  const status = metadata.statuses.find((s) => s.value === issue.status);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />;
      case "medium":
        return <Clock className="h-4 w-4" />;
      case "low":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "under_assessment":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-start justify-between">
            <div className="flex-1 pr-4">
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {issue.title}
              </h2>
              <p className="text-sm text-gray-600 mt-1">Issue ID: {issue.id}</p>
            </div>
            <div className="flex items-center gap-2">
              {status && (
                <Badge
                  className={`bg-${status.color}-100 text-${status.color}-800 border-${status.color}-200`}
                >
                  <div className="flex items-center gap-1">
                    {getStatusIcon(issue.status)}
                    {status.label}
                  </div>
                </Badge>
              )}
              {priority && (
                <Badge
                  className={`bg-${priority.color}-100 text-${priority.color}-800 border-${priority.color}-200`}
                >
                  <div className="flex items-center gap-1">
                    {getPriorityIcon(issue.priority)}
                    {priority.label}
                  </div>
                </Badge>
              )}
            </div>
          </DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(issue.submissionDate)} • {issue.community}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Issue Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {issue.description}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Location
                  </h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{issue.location.address}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Category
                  </h3>
                  <Badge variant="outline">{issue.category}</Badge>
                </div>

                {issue.impactAssessment?.estimatedCost && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Estimated Cost
                    </h3>
                    <p className="text-lg font-semibold text-gray-900">
                      ${issue.impactAssessment.estimatedCost.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Submitted By
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{issue.submitter.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{issue.submitter.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{issue.submitter.phone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Community
                  </h3>
                  <p className="text-gray-700">{issue.community}</p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">
                    Submission Date
                  </h3>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDate(issue.submissionDate)}</span>
                  </div>
                </div>

                {issue.assignedTo && issue.assignedTo.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Assigned To
                    </h3>
                    <div className="space-y-1">
                      {issue.assignedTo.map((assigneeId, index) => (
                        <Badge key={index} variant="outline">
                          Assessor {assigneeId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            {issue.timeline && issue.timeline.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Activity Timeline
                </h3>
                <div className="space-y-4">
                  {issue.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                        {index < issue.timeline!.length - 1 && (
                          <div className="w-px h-8 bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {event.event}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {formatDate(event.date)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          User ID: {event.userId}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Assessment Decision */}
            {issue.assessment && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Assessment Decision
                </h3>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      className={
                        issue.assessment.decision === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {issue.assessment.decision === "approved"
                        ? "Approved"
                        : "Rejected"}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {formatDate(issue.assessment.assessmentDate)}
                    </span>
                  </div>
                  {issue.assessment.comments && (
                    <p className="text-gray-700 mb-2">
                      {issue.assessment.comments}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Assessed by {issue.assessment.assessorName}
                  </p>
                </div>
              </div>
            )}

            {/* Supporting Documents */}
            {issue.attachments && issue.attachments.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Supporting Documents
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {issue.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg"
                    >
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attachment.size} • {attachment.type}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <Separator />
        <div className="flex justify-between items-center pt-4">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(issue.id.toString())}
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Issue
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {onAssess && issue.status === "pending_assessment" && (
              <Button
                onClick={() => onAssess(issue.id.toString())}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Start Assessment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
