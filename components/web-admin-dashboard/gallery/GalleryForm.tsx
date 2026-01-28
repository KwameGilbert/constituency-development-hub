"use client";

import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Loader2,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { galleryService, Gallery } from "@/lib/services/gallery-service";
import { getImageUrl } from "@/lib/utils";

const gallerySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  category: z.string().min(1, "Please select a category"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  status: z.string(),
  gallery_items: z.array(
    z.object({
      file: z.any().optional(),
      caption: z.string().optional(),
      url: z.string().optional(), // For existing images during edit
    }),
  ),
});

type GalleryFormValues = z.infer<typeof gallerySchema>;

interface GalleryFormProps {
  gallery?: Gallery;
}

export default function GalleryForm({ gallery }: GalleryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    gallery?.cover_image ? getImageUrl(gallery.cover_image) : null,
  );

  const form = useForm<GalleryFormValues>({
    resolver: zodResolver(gallerySchema),
    defaultValues: {
      title: gallery?.title || "",
      description: gallery?.description || "",
      category: gallery?.category || "General",
      date: gallery?.date || new Date().toISOString().split("T")[0],
      location: gallery?.location || "",
      status: gallery?.status || "active",
      gallery_items:
        gallery?.images?.map((img) => ({
          url: img.url,
          caption: img.caption,
        })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "gallery_items",
  });

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: GalleryFormValues) => {
    try {
      setLoading(true);

      // Validation for new gallery
      if (!gallery && !coverImage) {
        toast.error("Please upload a cover image");
        setLoading(false);
        return;
      }

      const payload: Partial<GalleryFormValues> & { cover_image?: File } = {
        ...data,
      };

      if (coverImage) {
        payload.cover_image = coverImage;
      }

      if (gallery) {
        // Handle update logic for gallery items
        const newFiles: File[] = [];
        const newCaptions: string[] = [];
        const existingToKeep: { url: string; caption: string }[] = [];

        data.gallery_items.forEach((item) => {
          if (item.file) {
            newFiles.push(item.file);
            newCaptions.push(item.caption || "");
          } else if (item.url) {
            existingToKeep.push({ url: item.url, caption: item.caption || "" });
          }
        });

        const updatePayload = {
          ...data,
          cover_image: coverImage || undefined,
          gallery_images: newFiles.length > 0 ? newFiles : undefined,
          new_gallery_captions:
            newCaptions.length > 0 ? newCaptions : undefined,
          existing_images: existingToKeep,
        };

        const response = await galleryService.updateGallery(
          gallery.id,
          updatePayload,
        );
        if (response.success) {
          toast.success("Gallery album updated successfully");
          router.push("/web-admin-dashboard/gallery");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to update gallery");
        }
      } else {
        // Create Logic
        const files: File[] = [];
        const captions: string[] = [];

        data.gallery_items.forEach((item) => {
          if (item.file) {
            files.push(item.file);
            captions.push(item.caption || "");
          }
        });

        const createPayload = {
          ...data,
          cover_image: coverImage!,
          gallery_images: files.length > 0 ? files : undefined,
          gallery_captions: captions.length > 0 ? captions : undefined,
        };

        const response = await galleryService.createGallery(createPayload);
        if (response.success) {
          toast.success("Gallery album created successfully");
          router.push("/web-admin-dashboard/gallery");
          router.refresh();
        } else {
          toast.error(response.message || "Failed to create gallery");
        }
      }
    } catch (error: unknown) {
      console.error("Gallery submission error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Cover Image & Main Settings */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
              <h3 className="font-semibold text-slate-900 border-b pb-3 mb-4 flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-emerald-500" /> Cover Photo
              </h3>

              <div className="space-y-4">
                <div
                  className={`relative aspect-[4/3] rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center transition-all ${
                    coverPreview
                      ? "border-solid border-emerald-100"
                      : "border-slate-200 hover:border-emerald-300 bg-slate-50"
                  }`}
                >
                  {coverPreview ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCoverImage(null);
                          setCoverPreview(null);
                        }}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="mx-auto h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-3">
                        <Upload className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-xs font-medium text-slate-600">
                        Click to upload cover
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Recommended: 800x600px
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleCoverChange}
                  />
                </div>
                {!coverPreview && (
                  <p className="text-[11px] text-amber-600 flex items-center gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-100">
                    <AlertCircle className="h-3 w-3" /> Cover image is mandatory
                  </p>
                )}
              </div>

              <div className="pt-4 space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visibility Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Published</SelectItem>
                          <SelectItem value="inactive">
                            Draft (Hidden)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-slate-50 border-slate-200">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Events">Events</SelectItem>
                          <SelectItem value="Programs">Programs</SelectItem>
                          <SelectItem value="Community">Community</SelectItem>
                          <SelectItem value="Infrastructure">
                            Infrastructure
                          </SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Album Details & Gallery Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b pb-4 mb-2 flex items-center gap-2">
                Album Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Album Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter album title..."
                          {...field}
                          className="bg-slate-50 border-slate-200 h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />{" "}
                        Event Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="bg-slate-50 border-slate-200 h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5 text-slate-400" />{" "}
                        Location
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Sefwi Wiawso"
                          {...field}
                          className="bg-slate-50 border-slate-200 h-11"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Album Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Briefly describe what this album is about..."
                          className="bg-slate-50 border-slate-200 min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Gallery Images Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b pb-4 mb-2">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  Gallery Photos
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 h-9"
                  onClick={() => append({ file: null, caption: "" })}
                >
                  <Plus className="h-4 w-4 mr-1.5" /> Add Photo
                </Button>
              </div>

              <div className="space-y-4">
                {fields.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                    <ImageIcon className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400">
                      No gallery photos added yet
                    </p>
                    <Button
                      type="button"
                      variant="link"
                      className="text-emerald-600 mt-1"
                      onClick={() => append({ file: null, caption: "" })}
                    >
                      Click here to add the first one
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="relative group bg-slate-50 rounded-xl border border-slate-100 overflow-hidden p-3 pt-4"
                      >
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-lg shadow-sm border border-slate-100 opacity-0 group-hover:opacity-100 transition-all z-10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>

                        <div className="space-y-3">
                          {/* Image Preview / Upload */}
                          <div className="aspect-video bg-white rounded-lg border border-slate-200 overflow-hidden relative flex items-center justify-center group-hover:border-emerald-200 transition-colors">
                            {form.watch(`gallery_items.${index}.file`) ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={URL.createObjectURL(
                                  form.watch(`gallery_items.${index}.file`),
                                )}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : form.watch(`gallery_items.${index}.url`) ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={getImageUrl(
                                  form.watch(`gallery_items.${index}.url`)!,
                                )}
                                alt="Existing"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-center">
                                <Upload className="h-6 w-6 text-slate-300 mx-auto mb-1.5" />
                                <span className="text-[10px] font-medium text-slate-400">
                                  Upload Image
                                </span>
                              </div>
                            )}
                            <input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  form.setValue(
                                    `gallery_items.${index}.file`,
                                    file,
                                  );
                                }
                              }}
                            />
                          </div>

                          {/* Caption Input */}
                          <Input
                            placeholder="Photo caption..."
                            className="h-9 text-xs bg-white/70 border-slate-200 focus:bg-white transition-colors"
                            {...form.register(`gallery_items.${index}.caption`)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
                className="text-slate-500 hover:text-slate-900"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 h-11 px-8 min-w-[140px] shadow-lg shadow-emerald-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {gallery ? "Updating..." : "Creating..."}
                  </>
                ) : gallery ? (
                  "Update Album"
                ) : (
                  "Create Album"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
