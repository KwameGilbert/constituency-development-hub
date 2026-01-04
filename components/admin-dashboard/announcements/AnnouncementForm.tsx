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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { announcementsService, CreateAnnouncementData, Announcement } from "@/lib/services/announcements-service";

const announcementSchema = z.object({
  title: z.string().min(3, "Title required"),
  content: z.string().min(10, "Content required"),
  category: z.string().min(1, "Category required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["draft", "published", "archived"]),
  publish_date: z.string().optional(),
  expiry_date: z.string().optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

interface AnnouncementFormProps {
  announcement?: Announcement;
}

export function NewAnnouncementForm({ announcement }: AnnouncementFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!announcement;

  const form = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: announcement?.title || "",
      content: announcement?.content || "",
      category: announcement?.category || "",
      priority: announcement?.priority || "medium",
      status: announcement?.status || "draft",
      publish_date: announcement?.publish_date || "",
      expiry_date: announcement?.expiry_date || "",
    },
  });

  async function onSubmit(data: AnnouncementFormValues) {
    setIsSubmitting(true);
    try {
      const announcementData: CreateAnnouncementData = {
        title: data.title,
        content: data.content,
        category: data.category,
        priority: data.priority,
        status: data.status,
        publish_date: data.publish_date || undefined,
        expiry_date: data.expiry_date || undefined,
      };

      let response;
      if (isEditMode && announcement) {
        response = await announcementsService.updateAnnouncement(announcement.id, announcementData);
      } else {
        response = await announcementsService.createAnnouncement(announcementData);
      }

      if (response.success) {
        toast.success(isEditMode ? "Announcement updated" : "Announcement created");
        router.push("/admin-dashboard/announcements");
        router.refresh();
      } else {
        toast.error("Failed to save");
      }
    } catch (error: unknown) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input id="title" {...form.register("title")} disabled={isSubmitting} />
                {form.formState.errors.title && <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea id="content" rows={6} {...form.register("content")} disabled={isSubmitting} />
                {form.formState.errors.content && <p className="text-red-500 text-sm mt-1">{form.formState.errors.content.message}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => form.setValue("category", value)} defaultValue={form.getValues("category")} disabled={isSubmitting}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="events">Events</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.category && <p className="text-red-500 text-sm mt-1">{form.formState.errors.category.message}</p>}
                </div>
                <div>
                  <Label htmlFor="priority">Priority *</Label>
                  <Select onValueChange={(value: "low" | "medium" | "high" | "urgent") => form.setValue("priority", value)} defaultValue={form.getValues("priority")} disabled={isSubmitting}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={(value: "draft" | "published" | "archived") => form.setValue("status", value)} defaultValue={form.getValues("status")} disabled={isSubmitting}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="publish_date">Publish Date</Label>
                  <Input id="publish_date" type="date" {...form.register("publish_date")} disabled={isSubmitting} />
                </div>
                <div>
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input id="expiry_date" type="date" {...form.register("expiry_date")} disabled={isSubmitting} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
        <Button type="submit" className="bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
          {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{isEditMode ? "Updating..." : "Creating..."}</> : <><Save className="mr-2 h-4 w-4" />{isEditMode ? "Update" : "Create"}</>}
        </Button>
      </div>
    </form>
  );
}
