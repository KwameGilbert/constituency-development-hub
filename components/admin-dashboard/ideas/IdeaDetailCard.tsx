"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ThumbsUp,
  Mail,
  Phone,
  Calendar,
  Tag,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { Idea } from "@/lib/services/ideas-service";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface IdeaDetailCardProps {
  idea: Idea;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "under_review":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "approved":
      return "bg-green-100 text-green-800 border-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 border-red-200";
    case "implemented":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatStatus = (status: string) => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export function IdeaDetailCard({ idea }: IdeaDetailCardProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState(idea.status);
  const [adminNotes, setAdminNotes] = useState(idea.admin_notes || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      // In real implementation, call ideasService.updateIdeaStatus
      toast.success("Status updated successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Content Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  {idea.title}
                </h2>
                <Badge className={getStatusColor(idea.status)}>
                  {formatStatus(idea.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <ThumbsUp className="w-5 h-5" />
                <span className="text-2xl font-bold">{idea.votes || 0}</span>
                <span className="text-sm text-slate-500">votes</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
              <div
                className="text-slate-700 leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: idea.description }}
              />
            </div>

            <Separator />

            {/* Submitter Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Submitted By</p>
                  <p className="font-medium text-slate-900">
                    {idea.submitter_name}
                  </p>
                  <p className="text-sm text-slate-600">
                    {idea.submitter_email}
                  </p>
                </div>
              </div>

              {idea.submitter_contact && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Phone className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Contact</p>
                    <p className="font-medium text-slate-900">
                      {idea.submitter_contact}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Tag className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Category</p>
                  <p className="font-medium text-slate-900 capitalize">
                    {idea.category}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Submitted On</p>
                  <p className="font-medium text-slate-900">
                    {formatDate(idea.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {idea.reviewed_at && (
              <>
                <Separator />
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  <span>Reviewed on {formatDate(idea.reviewed_at)}</span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Management Card */}
      <Card>
        <CardHeader>
          <CardTitle>Administrative Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="status">Update Status</Label>
            <Select
              value={selectedStatus}
              onValueChange={(value: any) => setSelectedStatus(value)}
              disabled={isUpdating}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="implemented">Implemented</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Admin Notes</Label>
            <Textarea
              id="notes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes about this idea..."
              rows={4}
              disabled={isUpdating}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleStatusUpdate}
              disabled={isUpdating || selectedStatus === idea.status}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedStatus(idea.status);
                setAdminNotes(idea.admin_notes || "");
              }}
              disabled={isUpdating}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>

          {idea.admin_notes && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-700 mb-1">
                Previous Notes:
              </p>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">
                {idea.admin_notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
