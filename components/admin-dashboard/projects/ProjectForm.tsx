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
import { projectsService, CreateProjectData, Project } from "@/lib/services/projects-service";
import { Checkbox } from "@/components/ui/checkbox";

const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sector_id: z.string().min(1, "Please select a sector"),
  location: z.string().min(3, "Location is required"),
  status: z.enum(["planning", "ongoing", "completed", "on_hold"]),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  budget: z.string().min(1, "Budget is required"),
  contractor: z.string().optional(),
  contact_person: z.string().optional(),
  contact_phone: z.string().optional(),
  is_featured: z.boolean().optional(),
  progress_percent: z.string().optional(),
  spent: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project?: Project;
}

export function NewProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!project;

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
      sector_id: project?.sector?.id.toString() || "",
      location: project?.location || "",
      status: project?.status || "planning",
      start_date: project?.start_date || "",
      end_date: project?.end_date || "",
      budget: project?.budget?.toString() || "",
      contractor: project?.contractor || "",
      contact_person: project?.contact_person || "",
      contact_phone: project?.contact_phone || "",
      is_featured: project?.is_featured || false,
      progress_percent: project?.progress_percent?.toString() || "",
      spent: project?.spent?.toString() || "",
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    setIsSubmitting(true);

    try {
      const projectData: CreateProjectData | any = {
        title: data.title,
        description: data.description,
        sector_id: parseInt(data.sector_id),
        location: data.location,
        status: data.status,
        start_date: data.start_date,
        end_date: data.end_date,
        budget: parseFloat(data.budget),
        contractor: data.contractor || undefined,
        contact_person: data.contact_person || undefined,
        contact_phone: data.contact_phone || undefined,
        is_featured: data.is_featured || false,
      };

      // Add update-specific fields if editing
      if (isEditMode) {
        if (data.progress_percent) {
          projectData.progress_percent = parseInt(data.progress_percent);
        }
        if (data.spent) {
          projectData.spent = parseFloat(data.spent);
        }
      }

      let response;
      if (isEditMode && project) {
        response = await projectsService.updateProject(project.id, projectData);
      } else {
        response = await projectsService.createProject(projectData);
      }

      if (response.success) {
        toast.success(isEditMode ? "Project updated successfully" : "Project created successfully");
        router.push("/admin-dashboard/projects");
        router.refresh();
      } else {
        toast.error(response.message || `Failed to ${isEditMode ? "update" : "create"} project`);
      }
    } catch (error: any) {
      console.error(`Error ${isEditMode ? "updating" : "creating"} project:`, error);
      toast.error(error.message || `An error occurred while ${isEditMode ? "updating" : "creating"} the project`);
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
            <h3 className="text-lg font-semibold text-slate-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Road Rehabilitation Project"
                  {...form.register("title")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the project..."
                  rows={4}
                  {...form.register("description")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="sector_id">Sector *</Label>
                <Select 
                  onValueChange={(value) => form.setValue("sector_id", value)}
                  defaultValue={form.getValues("sector_id")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Education</SelectItem>
                    <SelectItem value="2">Healthcare</SelectItem>
                    <SelectItem value="3">Infrastructure</SelectItem>
                    <SelectItem value="4">Agriculture</SelectItem>
                    <SelectItem value="5">Water & Sanitation</SelectItem>
                    <SelectItem value="6">Environment</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.sector_id && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.sector_id.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Central District"
                  {...form.register("location")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.location && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Status and Progress */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Status & Progress</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select 
                  onValueChange={(value: any) => form.setValue("status", value)}
                  defaultValue={form.getValues("status")}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on_hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.status.message}</p>
                )}
              </div>

              {isEditMode && (
                <div>
                  <Label htmlFor="progress_percent">Progress (%)</Label>
                  <Input
                    id="progress_percent"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    {...form.register("progress_percent")}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Financial Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget (₵) *</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register("budget")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.budget && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.budget.message}</p>
                )}
              </div>

              {isEditMode && (
                <div>
                  <Label htmlFor="spent">Amount Spent (₵)</Label>
                  <Input
                    id="spent"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...form.register("spent")}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...form.register("start_date")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.start_date && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.start_date.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="end_date">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...form.register("end_date")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.end_date && (
                  <p className="text-red-500 text-sm mt-1">{form.formState.errors.end_date.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contractor Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">Contractor Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="contractor">Contractor Name</Label>
                <Input
                  id="contractor"
                  placeholder="e.g., Ghana Construction Ltd"
                  {...form.register("contractor")}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  placeholder="e.g., John Mensah"
                  {...form.register("contact_person")}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  placeholder="e.g., +233249973054"
                  {...form.register("contact_phone")}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={form.watch("is_featured")}
                onCheckedChange={(checked) => form.setValue("is_featured", checked as boolean)}
                disabled={isSubmitting}
              />
              <Label htmlFor="is_featured" className="text-sm font-normal cursor-pointer">
                Feature this project on the public website
              </Label>
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
              {isEditMode ? "Update Project" : "Create Project"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
