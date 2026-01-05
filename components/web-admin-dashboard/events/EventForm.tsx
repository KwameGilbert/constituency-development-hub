"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarIcon, Clock, Loader2, Upload, X, ImageIcon, Link as LinkIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { eventsService, Event } from "@/lib/services/events-service";
import { toast } from "sonner";
import Link from "next/link";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  event_date: z.string().min(1, "Event date is required"),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  registration_required: z.boolean(),
  max_attendees: z.number().optional().nullable(),
  status: z.enum(["upcoming", "past", "cancelled"]),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  isEditing?: boolean;
}

export function EventForm({ event, isEditing = false }: EventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(event?.image || "");
  const [imagePreview, setImagePreview] = useState<string>(event?.image || "");
  const [imageInputType, setImageInputType] = useState<"upload" | "url">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      location: event?.location || "",
      event_date: event?.event_date || "",
      start_time: event?.start_time || "",
      end_time: event?.end_time || "",
      registration_required: event?.registration_required || false,
      max_attendees: event?.max_attendees ?? null,
      status: event?.status || "upcoming",
    },
  });

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Convert to data URL for preview and submission
    // Note: In production, you'd upload to a server
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      // For now, we'll just use the URL that's manually entered
      // since there's no upload endpoint
      toast.info("Image selected. Please enter the image URL after uploading to your server.");
    };
    reader.readAsDataURL(file);
  }

  function handleUrlChange(url: string) {
    setImageUrl(url);
    setImagePreview(url);
  }

  function removeImage() {
    setImageUrl("");
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(data: EventFormValues) {
    setIsLoading(true);
    try {
      // Build payload matching API expectations
      const payload = {
        name: data.title,
        title: data.title,
        description: data.description || undefined,
        image: imageUrl || undefined,
        location: data.location,
        event_date: data.event_date,
        start_time: data.start_time || undefined,
        end_time: data.end_time || undefined,
        registration_required: data.registration_required,
        max_attendees: data.max_attendees || undefined,
        status: data.status,
      };

      console.log("Submitting event:", payload);

      let response;
      if (isEditing && event?.id) {
        response = await eventsService.updateEvent(event.id, payload);
      } else {
        response = await eventsService.createEvent(payload);
      }

      if (response.success) {
        toast.success(isEditing ? "Event updated successfully!" : "Event created successfully!");
        router.push("/web-admin-dashboard/events");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to save event");
      }
    } catch (error: unknown) {
      console.error("Error saving event:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8">
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Event Title *</Label>
          <Input 
            id="title" 
            placeholder="Community Town Hall Meeting" 
            className="border-slate-200 focus:border-violet-500 focus:ring-violet-500"
            {...form.register("title")}
            disabled={isLoading}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input 
            id="location" 
            placeholder="Community Center, Main Street" 
            className="border-slate-200 focus:border-violet-500 focus:ring-violet-500"
            {...form.register("location")}
            disabled={isLoading}
          />
          {form.formState.errors.location && (
            <p className="text-red-500 text-sm">{form.formState.errors.location.message}</p>
          )}
        </div>

        {/* Date and Times */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="event_date">Event Date *</Label>
            <div className="relative">
              <Input 
                id="event_date" 
                type="date"
                className="border-slate-200 focus:border-violet-500 focus:ring-violet-500 pr-10" 
                {...form.register("event_date")}
                disabled={isLoading}
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            {form.formState.errors.event_date && (
              <p className="text-red-500 text-sm">{form.formState.errors.event_date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <div className="relative">
              <Input 
                id="start_time" 
                type="time"
                placeholder="08:00"
                className="border-slate-200 focus:border-violet-500 focus:ring-violet-500 pr-10" 
                {...form.register("start_time")}
                disabled={isLoading}
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_time">End Time</Label>
            <div className="relative">
              <Input 
                id="end_time" 
                type="time"
                placeholder="16:00"
                className="border-slate-200 focus:border-violet-500 focus:ring-violet-500 pr-10" 
                {...form.register("end_time")}
                disabled={isLoading}
              />
              <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Image Input */}
        <div className="space-y-2">
          <Label>Event Image</Label>
          <Tabs value={imageInputType} onValueChange={(v) => setImageInputType(v as "upload" | "url")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Image URL
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-2">
              <Input 
                type="url"
                placeholder="https://example.com/event-image.jpg" 
                className="border-slate-200 focus:border-violet-500 focus:ring-violet-500"
                value={imageUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-slate-500">Enter the URL of your event image</p>
            </TabsContent>
            
            <TabsContent value="upload" className="space-y-2">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-violet-300 transition-colors">
                {imagePreview && imageInputType === "upload" ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={imagePreview} 
                      alt="Event preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center cursor-pointer py-6"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="p-3 bg-violet-50 rounded-full mb-3">
                      <ImageIcon className="h-6 w-6 text-violet-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">Click to select image</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                ⚠️ Note: After selecting an image, upload it to your server and paste the URL above.
              </p>
            </TabsContent>
          </Tabs>
          
          {/* Image Preview for URL input */}
          {imagePreview && imageInputType === "url" && (
            <div className="relative mt-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={imagePreview} 
                alt="Event preview" 
                className="w-full h-48 object-cover rounded-lg border border-slate-200"
                onError={() => {
                  setImagePreview("");
                  toast.error("Failed to load image from URL");
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Event Description</Label>
          <Textarea 
            id="description"
            placeholder="Describe the event details, what attendees can expect, and any important information..."
            className="min-h-[150px] border-slate-200 focus:border-violet-500 focus:ring-violet-500"
            {...form.register("description")}
            disabled={isLoading}
          />
        </div>

        {/* Registration Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <Label htmlFor="registration_required" className="cursor-pointer">Registration Required</Label>
              <p className="text-sm text-slate-500">Enable if attendees need to register</p>
            </div>
            <Switch 
              id="registration_required"
              checked={form.watch("registration_required")}
              onCheckedChange={(checked) => form.setValue("registration_required", checked)}
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_attendees">Max Attendees</Label>
            <Input 
              id="max_attendees" 
              type="number"
              min="0"
              placeholder="Leave empty for unlimited" 
              className="border-slate-200 focus:border-violet-500 focus:ring-violet-500"
              onChange={(e) => {
                const val = e.target.value;
                form.setValue("max_attendees", val ? parseInt(val) : null);
              }}
              defaultValue={event?.max_attendees || ""}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={form.watch("status")} 
            onValueChange={(value: "upcoming" | "past" | "cancelled") => form.setValue("status", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="border-slate-200 focus:border-violet-500 focus:ring-violet-500">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Link href="/web-admin-dashboard/events">
          <Button type="button" variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50" disabled={isLoading}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditing ? "Update Event" : "Create Event"
          )}
        </Button>
      </div>
    </form>
  );
}
