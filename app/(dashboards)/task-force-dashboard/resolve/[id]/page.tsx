"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  taskForceService,
  TaskForceIssue,
} from "@/lib/services/task-force-service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Upload, X, CheckCircle } from "lucide-react";
import Image from "next/image";

export default function ResolveIssuePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [issue, setIssue] = useState<TaskForceIssue | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    resolution_summary: "",
    work_description: "",
    start_date: "",
    completion_date: "",
    actual_cost: "",
    challenges_faced: "",
  });

  // Image Upload State
  const [beforeImages, setBeforeImages] = useState<File[]>([]);
  const [afterImages, setAfterImages] = useState<File[]>([]);
  const [beforePreviews, setBeforePreviews] = useState<string[]>([]);
  const [afterPreviews, setAfterPreviews] = useState<string[]>([]);

  useEffect(() => {
    async function fetchIssue() {
      if (!id) return;
      try {
        const response = await taskForceService.getIssue(id);
        if (response.success) {
          setIssue(response.data.issue);
          // Pre-fill if already started? For now assume fresh start or continue logic handled by backend state
        } else {
          toast.error("Failed to load issue details");
        }
      } catch (error) {
        toast.error("An error occurred while fetching details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchIssue();
  }, [id]);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "before" | "after",
  ) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (type === "before") {
        setBeforeImages((prev) => [...prev, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setBeforePreviews((prev) => [...prev, ...newPreviews]);
      } else {
        setAfterImages((prev) => [...prev, ...files]);
        const newPreviews = files.map((file) => URL.createObjectURL(file));
        setAfterPreviews((prev) => [...prev, ...newPreviews]);
      }
    }
  };

  const removeImage = (index: number, type: "before" | "after") => {
    if (type === "before") {
      setBeforeImages((prev) => prev.filter((_, i) => i !== index));
      setBeforePreviews((prev) => prev.filter((_, i) => i !== index));
    } else {
      setAfterImages((prev) => prev.filter((_, i) => i !== index));
      setAfterPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issue) return;

    if (
      !formData.resolution_summary ||
      !formData.work_description ||
      !formData.completion_date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("resolution_summary", formData.resolution_summary);
      submitData.append("work_description", formData.work_description);
      submitData.append("start_date", formData.start_date);
      submitData.append("completion_date", formData.completion_date);
      if (formData.actual_cost)
        submitData.append("actual_cost", formData.actual_cost);
      if (formData.challenges_faced)
        submitData.append("challenges_faced", formData.challenges_faced);

      beforeImages.forEach((file) => {
        submitData.append("before_images[]", file);
      });

      afterImages.forEach((file) => {
        submitData.append("after_images[]", file);
      });

      const response = await taskForceService.submitResolution(
        parseInt(id),
        submitData,
      );

      if (response.success) {
        toast.success("Resolution report submitted successfully!");
        router.push(`/task-force-dashboard/issues/${id}?tab=resolution`);
      } else {
        toast.error("Failed to submit resolution report");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Issue Not Found</h2>
          <Button variant="link" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <main className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full">
        <div className="mb-6">
          <Link href={`/task-force-dashboard/issues/${id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="pl-0 hover:bg-transparent text-slate-500 hover:text-slate-800"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Issue Details
            </Button>
          </Link>
          <div className="mt-2">
            <h1 className="text-2xl font-bold text-slate-900">
              Resolved Issue Report
            </h1>
            <p className="text-slate-500">
              Submit your findings and work completion details for Case #
              {issue.case_id}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Resolution Details
              </CardTitle>
              <CardDescription>
                Describe the work done to resolve the issue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="summary">Resolution Summary *</Label>
                <Input
                  id="summary"
                  placeholder="Brief overview of the resolution (e.g. Broken pipe replaced and tested)"
                  value={formData.resolution_summary}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resolution_summary: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Work Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Step-by-step meaningful description of the work carried out..."
                  className="min-h-[120px]"
                  value={formData.work_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      work_description: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline & Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="completion_date">Completion Date *</Label>
                  <Input
                    id="completion_date"
                    type="date"
                    value={formData.completion_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        completion_date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Actual Cost (GHS)</Label>
                <Input
                  id="cost"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.actual_cost}
                  onChange={(e) =>
                    setFormData({ ...formData, actual_cost: e.target.value })
                  }
                />
                <p className="text-xs text-gray-500">
                  Total cost incurred during resolution. Leave blank if N/A.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completion Evidence (Photos)</CardTitle>
              <CardDescription>
                Upload photos showing the work before and after completion
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Before Images */}
              <div className="space-y-3">
                <Label>Conditions Before Work (Optional)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {beforePreviews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-md overflow-hidden border bg-gray-100 group"
                    >
                      <Image
                        src={src}
                        alt={`Before ${idx}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx, "before")}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Upload Before</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "before")}
                    />
                  </label>
                </div>
              </div>

              {/* After Images */}
              <div className="space-y-3">
                <Label>Conditions After Work (Results)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {afterPreviews.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-square rounded-md overflow-hidden border bg-gray-100 group"
                    >
                      <Image
                        src={src}
                        alt={`After ${idx}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx, "after")}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-slate-50 transition-colors">
                    <Upload className="h-8 w-8 text-green-500 mb-2" />
                    <span className="text-xs text-gray-500">Upload After</span>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, "after")}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Challenges & Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges Faced (Optional)</Label>
                <Textarea
                  id="challenges"
                  placeholder="Any difficulties encountered during the process?"
                  value={formData.challenges_faced}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      challenges_faced: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" /> Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
