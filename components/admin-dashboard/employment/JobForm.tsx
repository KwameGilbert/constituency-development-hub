"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { EMPLOYMENT_CATEGORIES } from "@/lib/data/employment-categories";

const jobSchema = z.object({
  title: z.string().min(3, "Position is required"),
  company: z.string().min(3, "Organization/Beneficiary info is required"),
  location: z.string().min(3, "Location is required"),
  job_type: z.enum(["full_time", "part_time", "contract", "internship"]),
  category: z.string().min(1, "Category is required"),
  sector: z.string().min(1, "Sector is required"),
  description: z.string().optional(),
  salary_range: z.string().optional(),
  requirements: z.string().optional(),
  responsibilities: z.string().optional(),
  application_deadline: z.string().optional(),
  status: z.enum(["draft", "published", "closed"]).default("published"),
  experience_level: z.string().optional(),
  // Personal Info
  beneficiary_name: z.string().min(3, "Beneficiary Name is required"),
  contact_phone: z.string().min(10, "Phone number is required"),
  application_email: z.string().email("Invalid email address").optional().or(z.literal("")),
  beneficiary_gender: z.enum(["male", "female", "other"]).optional(),
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
      job_type: (job?.job_type as "full_time" | "part_time" | "contract" | "internship") || "full_time",
      salary_range: job?.salary_range || "",
      requirements: job?.requirements || "",
      responsibilities: job?.responsibilities || "",
      application_deadline: job?.application_deadline || "",
      status: (job?.status as any) || "published",
      category: job?.category || "",
      sector: job?.description?.startsWith("Sector: ") 
        ? job.description.replace("Sector: ", "") 
        : (job?.sector || ""), // Fallback to sector column if available
      experience_level: job?.experience_level || "",
      // Personal Info Defaults
      beneficiary_name: job?.beneficiary_name || "",
      contact_phone: job?.contact_phone || "",
      application_email: job?.application_email || "",
      beneficiary_gender: job?.beneficiary_gender as "male" | "female" | "other" | undefined,
    },
  });

  const selectedCategory = form.watch("category");
  const availableSectors =
    EMPLOYMENT_CATEGORIES.find((c) => c.name === selectedCategory)?.sectors ||
    [];

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);

    try {
      // Store Category as just the name to avoid truncation
      const formattedCategory = data.category;
      
      const jobData: CreateJobData = {
        title: data.title,
        description: `Sector: ${data.sector}`, // Store sector in description
        company: data.company,
        location: data.location,
        job_type: data.job_type,
        salary_range: data.salary_range || undefined,
        requirements: data.requirements || "N/A",
        responsibilities: data.responsibilities || "N/A",
        application_deadline:
          data.application_deadline ||
          new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            .toISOString()
            .split("T")[0], // Default 1 year from now
        status: data.status,
        category: formattedCategory, 
        experience_level: data.experience_level || undefined,
        // Personal Info Mapping
        beneficiary_name: data.beneficiary_name,
        contact_phone: data.contact_phone,
        application_email: data.application_email || undefined,
        beneficiary_gender: data.beneficiary_gender || undefined,
        sector: data.sector, // Also send sector explicitly if backend supports it now
      };

      console.log("Submitting Job Data:", jobData);

      let response;
      if (isEditMode && job) {
        response = await employmentService.updateJob(job.id, jobData);
      } else {
        response = await employmentService.createJob(jobData);
      }

      console.log("Job Submission Response:", response);

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
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Beneficiary Information */}
          <div className="space-y-4">
             <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">
              Beneficiary Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="beneficiary_name">Beneficiary Name *</Label>
                <Input
                  id="beneficiary_name"
                  placeholder="e.g., John Doe"
                  {...form.register("beneficiary_name")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.beneficiary_name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.beneficiary_name.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="beneficiary_gender">Gender</Label>
                <Select
                  onValueChange={(value: "male" | "female" | "other") =>
                    form.setValue("beneficiary_gender", value)
                  }
                  defaultValue={form.getValues("beneficiary_gender")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                 {form.formState.errors.beneficiary_gender && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.beneficiary_gender.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="contact_phone">Phone Number *</Label>
                <Input
                  id="contact_phone"
                  placeholder="e.g., 024XXXXXXX"
                  {...form.register("contact_phone")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.contact_phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.contact_phone.message}
                  </p>
                )}
              </div>

               <div>
                <Label htmlFor="application_email">Email Address (Optional)</Label>
                <Input
                  id="application_email"
                  type="email"
                  placeholder="e.g., applicant@example.com"
                  {...form.register("application_email")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.application_email && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.application_email.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 pt-4">
              Employment Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Job Position *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Community Health Nurse"
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
                <Label htmlFor="company">Organization / Agency *</Label>
                <Input
                  id="company"
                  placeholder="e.g., Ghana Health Service"
                  {...form.register("company")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.company && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.company.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., District Hospital"
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
                <Label htmlFor="category">Category *</Label>
                <Select
                  onValueChange={(value) => {
                    form.setValue("category", value);
                    form.setValue("sector", ""); // Reset sector when category changes
                  }}
                  defaultValue={form.getValues("category")?.split(" - ")[0]} // Handle edit mode splitting if needed
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_CATEGORIES.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.category.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="sector">Sector *</Label>
                <Select
                  onValueChange={(value) => form.setValue("sector", value)}
                  defaultValue={form.getValues("sector")} // Logic to extract sector if edit mode is complex, but for new simple.
                  disabled={isSubmitting || !selectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.sector && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.sector.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="job_type">Job Type *</Label>
                <Select
                  onValueChange={(value: "full_time" | "part_time" | "contract" | "internship") =>
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
            </div>
          </div>
          
          {/* Hidden fields or reduced detail */}
          {/* We are hiding Description, Responsibilities, Requirements, etc. based on request */}
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
