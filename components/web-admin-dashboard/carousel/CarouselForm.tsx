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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(slide?.image || "");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

    setSelectedFile(file);

    // Convert to data URL for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setSelectedFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function onSubmit(data: HeroSlideFormValues) {
    // Validate image requirement
    if (!isEditing && !selectedFile) {
        toast.error("Please select an image for the slide");
        return;
    }

    if (isEditing && !imagePreview) {
         toast.error("Slide must have an image");
         return;
    }

    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        subtitle: data.subtitle || undefined,
        image: imagePreview, // This will be ignored by createSlide/updateSlide in favor of file, but good for local optimistic UI if needed
        cta_text: data.cta_text || undefined,
        cta_link: data.cta_link || undefined,
        display_order: data.display_order,
        status: data.status,
      };

      console.log("Submitting hero slide:", payload);

      let response;
      if (isEditing && slide?.id) {
        response = await heroSlidesService.updateSlide(slide.id, payload, selectedFile || undefined);
      } else {
        // We verified key earlier, so selectedFile is safe here or we handle the type error
        if (selectedFile) {
             response = await heroSlidesService.createSlide(payload, selectedFile);
        } else {
            // Should not happen due to validation above
            toast.error("Image file is required");
            setIsLoading(false);
            return;
        }
      }

      if (response.success) {
        toast.success(isEditing ? "Hero slide updated successfully!" : "Hero slide created successfully!");
        router.push("/web-admin-dashboard/carousel");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to save hero slide");
      }
    } catch (error: unknown) {
      console.error("Error saving hero slide:", error);
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
          <Label htmlFor="title">Title *</Label>
          <Input 
            id="title" 
            placeholder="Welcome to Our Constituency" 
            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
            {...form.register("title")}
            disabled={isLoading}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
          )}
          <p className="text-xs text-slate-400">The main headline displayed on the slide</p>
        </div>

        {/* Subtitle */}
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Textarea 
            id="subtitle" 
            placeholder="Building a better community together" 
            className="border-slate-200 focus:border-purple-500 focus:ring-purple-500 min-h-[80px]"
            {...form.register("subtitle")}
            disabled={isLoading}
          />
          <p className="text-xs text-slate-400">A supporting message that appears below the title</p>
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Slide Image *</Label>
          <div className="space-y-4">
            <div className={`border-2 border-dashed rounded-lg p-6 hover:border-purple-300 transition-colors ${!imagePreview ? 'border-slate-200' : 'border-purple-200'}`}>
                {imagePreview ? (
                    <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={imagePreview} 
                            alt="Slide preview" 
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
                        <div className="p-3 bg-purple-50 rounded-full mb-3">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-700">Click to select image</p>
                        <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB (1920x600px)</p>
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
          </div>
        </div>

        {/* CTA Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="cta_text">Button Text</Label>
            <Input 
              id="cta_text" 
              placeholder="Learn More" 
              className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
              {...form.register("cta_text")}
              disabled={isLoading}
            />
            <p className="text-xs text-slate-400">Text shown on the call-to-action button</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="cta_link">Button Link</Label>
            <Input 
              id="cta_link" 
              placeholder="/about" 
              className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
              {...form.register("cta_link")}
              disabled={isLoading}
            />
            <p className="text-xs text-slate-400">Where users go when they click the button</p>
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
              className="border-slate-200 focus:border-purple-500 focus:ring-purple-500"
              {...form.register("display_order", { valueAsNumber: true })}
              disabled={isLoading}
            />
            <p className="text-xs text-slate-400">Lower numbers appear first</p>
          </div>
          <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
            <div>
              <Label htmlFor="status" className="cursor-pointer">Active</Label>
              <p className="text-sm text-slate-500">Show this slide on the homepage</p>
            </div>
            <Switch 
              id="status"
              checked={form.watch("status") === "active"}
              onCheckedChange={(checked) => form.setValue("status", checked ? "active" : "inactive")}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Link href="/web-admin-dashboard/carousel">
          <Button type="button" variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50" disabled={isLoading}>
            Cancel
          </Button>
        </Link>
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            isEditing ? "Update Hero Slide" : "Add Hero Slide"
          )}
        </Button>
      </div>
    </form>
  );
}
