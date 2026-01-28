"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  employmentService,
  CreateJobData,
  JobPosting,
} from "@/lib/services/employment-service";

const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  company: z.string().optional(),
  location: z.string().min(3, "Location is required"),
  job_type: z.enum(["full_time", "part_time", "contract", "internship"]),
  salary_range: z.string().optional(),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  application_deadline: z.string().min(1, "Application deadline is required"),
  status: z.enum(["draft", "published", "closed"]),
  category: z.string().optional(),
  experience_level: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobSchema>;

interface JobFormProps {
  job?: JobPosting;
}

export function NewJobForm({ job }: JobFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!job;

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job?.title || "",
      description: job?.description || "",
      company: job?.company || "",
      location: job?.location || "",
      job_type: job?.job_type || "full_time",
      salary_range: job?.salary_range || "",
      requirements: job?.requirements || "",
      responsibilities: job?.responsibilities || "",
      application_deadline: job?.application_deadline || "",
      status: job?.status || "draft",
      category: job?.category || "",
      experience_level: job?.experience_level || "",
    },
  });

  async function onSubmit(data: JobFormValues) {
    setIsSubmitting(true);

    try {
      const jobData: CreateJobData = {
        title: data.title,
        description: data.description,
        company: data.company || undefined,
        location: data.location,
        job_type: data.job_type,
        salary_range: data.salary_range || undefined,
        requirements: data.requirements || undefined,
        responsibilities: data.responsibilities || undefined,
        application_deadline: data.application_deadline,
        status: data.status,
        category: data.category || undefined,
        experience_level: data.experience_level || undefined,
      };

      let response;
      if (isEditMode && job) {
        response = await employmentService.updateJob(job.id, jobData);
      } else {
        response = await employmentService.createJob(jobData);
      }

      if (response.success) {
        toast.success(
          isEditMode ? "Job updated successfully" : "Job posted successfully",
        );
        router.push("/admin-dashboard/employment");
        router.refresh();
      } else {
        toast.error(
          response.message ||
            `Failed to ${isEditMode ? "update" : "create"} job`,
        );
      }
    } catch (error: any) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} job:`,
        error,
      );
      toast.error(
        error.message ||
          `An error occurred while ${isEditMode ? "updating" : "creating"} the job`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Community Development Officer"
                  {...form.register("title")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="company">Company/Organization</Label>
                <Input
                  id="company"
                  placeholder="e.g., District Office"
                  {...form.register("company")}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Central Office, Accra"
                  {...form.register("location")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="job_type">Job Type *</Label>
                <Select
                  onValueChange={(value: any) =>
                    form.setValue("job_type", value)
                  }
                  defaultValue={form.getValues("job_type")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.job_type && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.job_type.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) => form.setValue("category", value)}
                  defaultValue={form.getValues("category")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administration">
                      Administration
                    </SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="social_services">
                      Social Services
                    </SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="communications">
                      Communications
                    </SelectItem>
                    <SelectItem value="monitoring_evaluation">
                      Monitoring & Evaluation
                    </SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Job Description
            </h3>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the position..."
                rows={4}
                {...form.register("description")}
                disabled={isSubmitting}
              />
              {form.formState.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="responsibilities">Key Responsibilities</Label>
              <Textarea
                id="responsibilities"
                placeholder="List the main responsibilities of this role..."
                rows={4}
                {...form.register("responsibilities")}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <Label htmlFor="requirements">
                Requirements & Qualifications
              </Label>
              <Textarea
                id="requirements"
                placeholder="List the required qualifications, skills, and experience..."
                rows={4}
                {...form.register("requirements")}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              Employment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary_range">Salary Range</Label>
                <Input
                  id="salary_range"
                  placeholder="e.g., GHS 3,000 - 5,000 per month"
                  {...form.register("salary_range")}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("experience_level", value)
                  }
                  defaultValue={form.getValues("experience_level")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="application_deadline">
                  Application Deadline *
                </Label>
                <Input
                  id="application_deadline"
                  type="date"
                  {...form.register("application_deadline")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.application_deadline && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.application_deadline.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="status">Publication Status *</Label>
                <Select
                  onValueChange={(value: any) => form.setValue("status", value)}
                  defaultValue={form.getValues("status")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
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
          className="bg-red-600 hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditMode ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? "Update Job" : "Post Job"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
