"use client";

import React, { useState } from "react";
import { issuesService, ResourceItem, Issue } from "@/lib/services/issues-service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, FileText, DollarSign, MapPin, CheckCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ActionModalsProps {
  issue: Issue;
  activeAction: string | null;
  onClose: () => void;
}

export function IssueActionModals({
  issue,
  activeAction,
  onClose,
}: ActionModalsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Assign Task Force state
  const [taskForceId, setTaskForceId] = useState("");

  // Allocate Resources state
  const [budget, setBudget] = useState("");
  const [resources, setResources] = useState<ResourceItem[]>([
    { type: "equipment", item: "", quantity: 1 },
  ]);

  // Review Assessment state
  const [assessmentAction, setAssessmentAction] = useState<
    "approve" | "reject" | "revision"
  >("approve");
  const [assessmentNotes, setAssessmentNotes] = useState("");

  // Review Resolution state
  const [resolutionAction, setResolutionAction] = useState<
    "approve" | "reject"
  >("approve");
  const [resolutionNotes, setResolutionNotes] = useState("");

  // Update Status state
  const [newStatus, setNewStatus] = useState("");
  const [statusComment, setStatusComment] = useState("");
  
  const issueId = issue.id;

  function addResource() {
    setResources([...resources, { type: "equipment", item: "", quantity: 1 }]);
  }

  function removeResource(index: number) {
    setResources(resources.filter((_, i) => i !== index));
  }

  function updateResource(
    index: number,
    field: keyof ResourceItem,
    value: string | number,
  ) {
    const updated = [...resources];
    updated[index] = { ...updated[index], [field]: value };
    setResources(updated);
  }

  async function handleAssignTaskForce() {
    if (!taskForceId) {
      toast.error("Please select a task force");
      return;
    }

    setLoading(true);
    try {
      const response = await issuesService.assignTaskForce(
        issueId,
        parseInt(taskForceId),
      );
      if (response.success) {
        toast.success("Task force assigned successfully");
        router.refresh();
        onClose();
      } else {
        toast.error("Failed to assign task force");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleAllocateResources() {
    if (!budget || parseFloat(budget) <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }

    const validResources = resources.filter((r) => r.item.trim() !== "");
    if (validResources.length === 0) {
      toast.error("Please add at least one resource");
      return;
    }

    setLoading(true);
    try {
      const response = await issuesService.allocateResources(issueId, {
        budget: parseFloat(budget),
        resources: validResources,
      });
      if (response.success) {
        toast.success("Resources allocated successfully");
        router.refresh();
        onClose();
      } else {
        toast.error("Failed to allocate resources");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleReviewAssessment() {
    if (!assessmentNotes.trim()) {
      toast.error("Please provide review notes");
      return;
    }

    setLoading(true);
    try {
      const response = await issuesService.reviewAssessment(
        issueId,
        assessmentAction,
        assessmentNotes,
      );
      if (response.success) {
        toast.success(`Assessment ${assessmentAction}d successfully`);
        router.refresh();
        onClose();
      } else {
        toast.error("Failed to review assessment");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleReviewResolution() {
    if (!resolutionNotes.trim()) {
      toast.error("Please provide review notes");
      return;
    }

    setLoading(true);
    try {
      const response = await issuesService.reviewResolution(
        issueId,
        resolutionAction,
        resolutionNotes,
      );
      if (response.success) {
        toast.success(`Resolution ${resolutionAction}d successfully`);
        router.refresh();
        onClose();
      } else {
        toast.error("Failed to review resolution");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus() {
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }

    setLoading(true);
    try {
      const response = await issuesService.updateStatus(
        issueId,
        newStatus,
        statusComment,
      );
      if (response.success) {
        toast.success("Status updated successfully");
        router.refresh();
        onClose();
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Assign Task Force Modal */}
      <Dialog open={activeAction === "assign"} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign to Task Force</DialogTitle>
            <DialogDescription>
              Select a task force to handle this issue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taskforce">Task Force</Label>
              <Select value={taskForceId} onValueChange={setTaskForceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select task force" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Task Force Alpha</SelectItem>
                  <SelectItem value="2">Task Force Beta</SelectItem>
                  <SelectItem value="3">Task Force Gamma</SelectItem>
                  <SelectItem value="4">Emergency Response Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAssignTaskForce} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Allocate Resources Modal */}
      <Dialog open={activeAction === "allocate"} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Allocate Resources</DialogTitle>
            <DialogDescription>
              Set budget and allocate resources for this issue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="budget">Budget (GHS)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="5000.00"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Resources</Label>
                <Button size="sm" variant="outline" onClick={addResource}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resource
                </Button>
              </div>

              {resources.map((resource, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-3">
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={resource.type}
                      onValueChange={(value) =>
                        updateResource(index, "type", value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="equipment">Equipment</SelectItem>
                        <SelectItem value="personnel">Personnel</SelectItem>
                        <SelectItem value="material">Material</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-6">
                    <Label className="text-xs">Item</Label>
                    <Input
                      placeholder="Item name"
                      className="h-9"
                      value={resource.item}
                      onChange={(e) =>
                        updateResource(index, "item", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-xs">Qty</Label>
                    <Input
                      type="number"
                      className="h-9"
                      min="1"
                      value={resource.quantity}
                      onChange={(e) =>
                        updateResource(
                          index,
                          "quantity",
                          parseInt(e.target.value) || 1,
                        )
                      }
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9"
                      onClick={() => removeResource(index)}
                      disabled={resources.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAllocateResources} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Allocate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Assessment Modal */}
      <Dialog
        open={activeAction === "review-assessment"}
        onOpenChange={onClose}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle>Review Task Force Assessment</DialogTitle>
            <DialogDescription>
              Review the detailed assessment and approve or request changes
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 pb-6">
              {/* Assessment Details View */}
              {issue.assessment ? (
                <div className="space-y-6">
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border">
                    <div>
                      <span className="text-xs text-slate-500 font-medium uppercase">Severity</span>
                      <p className="font-semibold capitalize text-slate-900">{issue.assessment.severity}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-medium uppercase">Confirmed</span>
                       <Badge variant={issue.assessment.issue_confirmed ? "default" : "destructive"} className="mt-1">
                        {issue.assessment.issue_confirmed ? "Yes" : "No"}
                       </Badge>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-medium uppercase">Est. Cost</span>
                      <p className="font-semibold text-slate-900">{issue.assessment.estimated_cost || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-medium uppercase">Duration</span>
                      <p className="font-semibold text-slate-900">{issue.assessment.estimated_duration || "N/A"}</p>
                    </div>
                  </div>

                  {/* Summary & Findings */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" /> Assessment Summary
                      </h4>
                      <div className="p-3 bg-white border rounded-md text-sm text-slate-700 whitespace-pre-wrap">
                        {issue.assessment.assessment_summary}
                      </div>
                    </div>

                    {issue.assessment.findings && (
                       <div>
                        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-orange-600" /> Findings & Observations
                        </h4>
                        <div className="p-3 bg-white border rounded-md text-sm text-slate-700 whitespace-pre-wrap">
                          {issue.assessment.findings}
                        </div>
                      </div>
                    )}

                    {issue.assessment.recommendations && (
                       <div>
                        <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" /> Recommendations
                        </h4>
                        <div className="p-3 bg-green-50 border border-green-100 rounded-md text-sm text-green-800 whitespace-pre-wrap">
                          {issue.assessment.recommendations}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Required Resources */}
                  {issue.assessment.required_resources && issue.assessment.required_resources.length > 0 && (
                     <div>
                      <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-purple-600" /> Required Resources
                      </h4>
                      <div className="border rounded-md divide-y">
                        {issue.assessment.required_resources.map((res: ResourceItem, idx: number) => (
                           <div key={idx} className="flex justify-between p-2 text-sm">
                             <span>{res.item || res.name} <span className="text-slate-500 text-xs capitalize">({res.type})</span></span>
                             <span className="font-medium">Qty: {res.quantity}</span>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                 <div className="p-8 text-center bg-gray-50 rounded-lg border border-dashed">
                   <p className="text-gray-500 italic">No detailed assessment report found.</p>
                 </div>
              )}

              <Separator className="my-4" />

              {/* Review Controls */}
              <div className="space-y-4 pt-2">
                <div className="space-y-3">
                  <Label>Decision</Label>
                  <RadioGroup
                    value={assessmentAction}
                    onValueChange={(v) =>
                      setAssessmentAction(v as "approve" | "reject" | "revision")
                    }
                    className="grid grid-cols-1 md:grid-cols-3 gap-2"
                  >
                    <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50">
                      <RadioGroupItem value="approve" id="approve-assessment" />
                      <Label htmlFor="approve-assessment" className="font-medium cursor-pointer flex-1">
                        Approve
                        <span className="block text-xs font-normal text-slate-500">Prcced to Allocation</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50">
                      <RadioGroupItem value="revision" id="revision-assessment" />
                      <Label htmlFor="revision-assessment" className="font-medium cursor-pointer flex-1">
                        Request Revision
                        <span className="block text-xs font-normal text-slate-500">Ask for changes</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 border p-3 rounded-md hover:bg-slate-50">
                      <RadioGroupItem value="reject" id="reject-assessment" />
                      <Label htmlFor="reject-assessment" className="font-medium cursor-pointer flex-1">
                        Reject
                        <span className="block text-xs font-normal text-slate-500">Decline Assessment</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessment-notes">Review Notes *</Label>
                  <Textarea
                    id="assessment-notes"
                    placeholder="Provide justification for your decision..."
                    rows={3}
                    value={assessmentNotes}
                    onChange={(e) => setAssessmentNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t bg-gray-50">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleReviewAssessment} disabled={loading} className={
                assessmentAction === "approve" ? "bg-green-600 hover:bg-green-700" :
                assessmentAction === "reject" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            }>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm {assessmentAction === "revision" ? "Revision Request" : assessmentAction === "approve" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Resolution Modal */}
      <Dialog
        open={activeAction === "review-resolution"}
        onOpenChange={onClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Resolution</DialogTitle>
            <DialogDescription>
              Review the resolution report and close the issue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Action</Label>
              <RadioGroup
                value={resolutionAction}
                onValueChange={(v) =>
                  setResolutionAction(v as "approve" | "reject")
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="approve" id="approve-resolution" />
                  <Label
                    htmlFor="approve-resolution"
                    className="font-normal cursor-pointer"
                  >
                    Approve - Mark issue as resolved
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject-resolution" />
                  <Label
                    htmlFor="reject-resolution"
                    className="font-normal cursor-pointer"
                  >
                    Reject - Resolution not satisfactory
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution-notes">Notes *</Label>
              <Textarea
                id="resolution-notes"
                placeholder="Provide feedback and notes..."
                rows={4}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleReviewResolution} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={activeAction === "status"} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Issue Status</DialogTitle>
            <DialogDescription>
              Change the current status of this issue
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">New Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="under_officer_review">
                    Under Officer Review
                  </SelectItem>
                  <SelectItem value="forwarded_to_admin">
                    Forwarded to Admin
                  </SelectItem>
                  <SelectItem value="assigned_to_task_force">
                    Assigned to Task Force
                  </SelectItem>
                  <SelectItem value="assessment_in_progress">
                    Assessment In Progress
                  </SelectItem>
                  <SelectItem value="assessment_submitted">
                    Assessment Submitted
                  </SelectItem>
                  <SelectItem value="resources_allocated">
                    Resources Allocated
                  </SelectItem>
                  <SelectItem value="resolution_in_progress">
                    Resolution In Progress
                  </SelectItem>
                  <SelectItem value="resolution_submitted">
                    Resolution Submitted
                  </SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-comment">Comment (Optional)</Label>
              <Textarea
                id="status-comment"
                placeholder="Add a note about this status change..."
                rows={3}
                value={statusComment}
                onChange={(e) => setStatusComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
