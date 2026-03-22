"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Loader2, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { heroSlidesService, HeroSlide } from "@/lib/services/carousel-service";
import { toast } from "sonner";
import Link from "next/link";

const heroSlideSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  display_order: z.number().min(0),
  status: z.enum(["active", "inactive"]),
});

type HeroSlideFormValues = z.infer<typeof heroSlideSchema>;

interface CarouselFormProps {
  slide?: HeroSlide;
  isEditing?: boolean;
}

export function CarouselForm({ slide, isEditing = false }: CarouselFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(slide?.image || "");
  const [imagePreview, setImagePreview] = useState<string>(slide?.image || "");
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<HeroSlideFormValues>({
    resolver: zodResolver(heroSlideSchema) as any, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues: {
      title: slide?.title || "",
      subtitle: slide?.subtitle || "",
      cta_text: slide?.cta_text || "",
      cta_link: slide?.cta_link || "",
      display_order: slide?.display_order ?? 0,
      status: slide?.status || "active",
    },
  });

  function removeImage() {
    setImageUrl("");
    setImagePreview("");
    setFile(null);
    // Reset file input value if possible (requires ref)
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  async function onSubmit(data: HeroSlideFormValues) {
    if (!file && !imageUrl) {
      toast.error("Please select an image");
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append("title", data.title);
      if (data.subtitle) formData.append("subtitle", data.subtitle);
      if (data.cta_text) formData.append("cta_text", data.cta_text);
      if (data.cta_link) formData.append("cta_link", data.cta_link);
      formData.append("display_order", data.display_order.toString());
      formData.append("status", data.status);

      // Append image
      if (file) {
        formData.append("image", file);
      } else if (imageUrl) {
        // Keeps existing URL if no new file
        formData.append("image", imageUrl);
      }

      console.log("Submitting hero slide via FormData");

      let response;
      if (isEditing && slide?.id) {
        response = await heroSlidesService.updateSlide(slide.id, formData);
      } else {
        response = await heroSlidesService.createSlide(formData);
      }

      if (response.success) {
        toast.success(
          isEditing
            ? "Hero slide updated successfully!"
            : "Hero slide created successfully!",
        );
        router.push("/web-admin-dashboard/carousel");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to save hero slide");
      }
    } catch (error: unknown) {
      console.error("Error saving hero slide:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8"
    >
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Welcome to Our Constituency"
            className="border-slate-200 focus:border-amber-500 focus:ring-amber-500"
            {...form.register("title")}
            disabled={isLoading}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.title.message}
            </p>
          )}
          <p className="text-xs text-slate-400">
            The main headline displayed on the slide
          </p>
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Controller
            name="subtitle"
            control={form.control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Building a better community together"
                disabled={isLoading}
                height={200}
              />
            )}
          />
          <p className="text-xs text-slate-400">
            A supporting message that appears below the title
          </p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Slide Image *</Label>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      toast.error("File size must be less than 5MB");
                      return;
                    }
                    setFile(file);
                    const objectUrl = URL.createObjectURL(file);
                    setImagePreview(objectUrl);
                    setImageUrl(""); // Clear URL input if file is selected
                  }
                }}
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-slate-400">
              Supported formats: JPG, PNG, WEBP (Max 5MB). Recommended size:
              1920x600 pixels
            </p>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full aspect-21/9 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Slide preview"
                  className="w-full h-full object-cover"
                  onError={() => {
                    // Only clear if it's not a blob URL (which implies a real load error vs initial state)
                    if (!imagePreview.startsWith("blob:")) {
                      setImagePreview("");
                      toast.error("Failed to load image");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cta_text">Button Text</Label>
            <Input
              id="cta_text"
              placeholder="Learn More"
              className="border-slate-200 focus:border-amber-500 focus:ring-amber-500"
              {...form.register("cta_text")}
              disabled={isLoading}
            />
            <p className="text-xs text-slate-400">
              Text shown on the call-to-action button
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta_link">Button Link</Label>
            <Input
              id="cta_link"
              placeholder="/about"
              className="border-slate-200 focus:border-amber-500 focus:ring-amber-500"
              {...form.register("cta_link")}
              disabled={isLoading}
            />
            <p className="text-xs text-slate-400">
              Where users go when they click the button
            </p>
          </div>
        </div>

        {/* Display Order and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="display_order">Display Order</Label>
            <Input
              id="display_order"
              type="number"
              min="0"
              className="border-slate-200 focus:border-amber-500 focus:ring-amber-500"
              {...form.register("display_order", { valueAsNumber: true })}
              disabled={isLoading}
            />
            <p className="text-xs text-slate-400">Lower numbers appear first</p>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <Label htmlFor="status" className="cursor-pointer">
                Active
              </Label>
              <p className="text-sm text-slate-500">
                Show this slide on the homepage
              </p>
            </div>
            <Switch
              id="status"
              checked={form.watch("status") === "active"}
              onCheckedChange={(checked) =>
                form.setValue("status", checked ? "active" : "inactive")
              }
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Link href="/web-admin-dashboard/carousel">
          <Button
            type="button"
            variant="outline"
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : isEditing ? (
            "Update Hero Slide"
          ) : (
            "Add Hero Slide"
          )}
        </Button>
      </div>
    </form>
  );
}
