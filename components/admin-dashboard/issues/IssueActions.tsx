"use client";

import React, { useState } from "react";
import { Issue } from "@/lib/services/issues-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  CheckCircle,
  MessageSquare,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IssueActionModals } from "./IssueActionModals";
import { issuesService } from "@/lib/services/issues-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface IssueActionsProps {
  issue: Issue;
}

export function IssueActions({ issue }: IssueActionsProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAutoAssignTaskForce() {
    setLoading(true);
    try {
      const response = await issuesService.updateStatus(
        issue.id,
        "assigned_to_task_force",
        "Assigned to Task Force Dashboard"
      );
      if (response.success) {
        toast.success("Issue assigned to Task Force Dashboard");
        router.refresh();
      } else {
        toast.error("Failed to assign issue");
      }
    } catch (error) {
      console.error("Assign error:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  // Determine which actions are available based on status
  const canAssignTaskForce = issue.status === "forwarded_to_admin";
  
  // Review Assessment: Only available if submitted and NOT yet approved? 
  // Actually, UI should probably allow re-review or just show it's done. 
  // If we want to force flow: Review -> Approve -> Allocate, then we check assessment status too.
  const isAssessmentApproved = issue.assessment?.status === "approved";
  const canReviewAssessment = issue.status === "assessment_submitted" && !isAssessmentApproved;
  
  // Allocate Resources: STRICT backend requirement: status MUST be "assessment_submitted"
  // Logically, we only want to allocate if the assessment is APPROVED.
  const canAllocateResources = issue.status === "assessment_submitted" && isAssessmentApproved;
  
  const canReviewResolution = issue.status === "resolution_submitted";

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Admin Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Assign to Task Force */}
            <Button
              variant={canAssignTaskForce ? "default" : "secondary"}
              disabled={!canAssignTaskForce || loading}
              className={
                canAssignTaskForce ? "bg-indigo-600 hover:bg-indigo-700" : ""
              }
              onClick={handleAutoAssignTaskForce}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Users className="h-4 w-4 mr-2" />
              )}
              Assign Task Force
            </Button>

            {/* Allocate Resources - Primary Action when approved */}
            <Button
              variant={canAllocateResources ? "default" : "secondary"}
              disabled={!canAllocateResources}
              className={
                canAllocateResources ? "bg-green-600 hover:bg-green-700 shadow-md ring-2 ring-green-100" : ""
              }
              onClick={() => setActiveAction("allocate")}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Allocate Resources
            </Button>

            {/* Review Assessment */}
            {isAssessmentApproved ? (
               <Button
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 cursor-default"
                disabled
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Assessment Approved
              </Button>
            ) : (
              <Button
                variant={canReviewAssessment ? "default" : "secondary"}
                disabled={!canReviewAssessment}
                className={
                  canReviewAssessment ? "bg-blue-600 hover:bg-blue-700" : ""
                }
                onClick={() => setActiveAction("review-assessment")}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Review Assessment
              </Button>
            )}

            {/* Review Resolution */}
            <Button
              variant={canReviewResolution ? "default" : "secondary"}
              disabled={!canReviewResolution}
              className={
                canReviewResolution ? "bg-purple-600 hover:bg-purple-700" : ""
              }
              onClick={() => setActiveAction("review-resolution")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Review Resolution
            </Button>

            {/* Update Status */}
            <Button variant="outline" onClick={() => setActiveAction("status")}>
              <Settings className="h-4 w-4 mr-2" />
              Update Status
            </Button>

            {/* Add Comment */}
            <Button
              variant="outline"
              onClick={() => setActiveAction("comment")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Add Comment
            </Button>
          </div>

          {/* Action Status Info */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Current Status:</strong>{" "}
              <Badge className="ml-2" variant="outline">
                {issue.status.replace(/_/g, " ")}
              </Badge>
            </p>
            <div className="text-sm text-gray-500">
              {canAssignTaskForce && (
                <p className="text-green-600">
                  ✓ Ready to assign to task force
                </p>
              )}
              {canReviewAssessment && (
                <p className="text-blue-600">
                  ✓ Assessment awaiting admin review
                </p>
              )}
              {canAllocateResources && (
                 <p className="text-green-600 font-medium">
                  ✓ Assessment Approved. Ready to Allocate Resources.
                </p>
              )}
              {canReviewResolution && (
                <p className="text-purple-600">
                  ✓ Resolution awaiting admin review
                </p>
              )}
              {!canAssignTaskForce &&
                !canReviewAssessment &&
                !canReviewResolution && (
                  <p className="text-gray-400">No immediate actions required</p>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Modals */}
      <IssueActionModals
        issue={issue}
        activeAction={activeAction}
        onClose={() => setActiveAction(null)}
      />
    </>
  );
}
