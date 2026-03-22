"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, X, ChevronsUpDown, Check, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  projectsService,
  Project,
  CreateProjectData,
  UpdateProjectData,
} from "@/lib/services/projects-service";
import { sectorsService, Sector } from "@/lib/services/sectors-service";
import { locationsService, Location } from "@/lib/services/locations-service";
import { uploadService } from "@/lib/services/upload-service";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

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
  redirectPath?: string;
}

export function ProjectForm({ project, redirectPath = "/web-admin-dashboard/projects" }: ProjectFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    project?.image || null,
  );
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [sectorOpen, setSectorOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    project?.gallery || [],
  );

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      try {
        const [sectorsResponse, locationsResponse] = await Promise.all([
          sectorsService.getSectors(),
          locationsService.getLocations({ limit: 100 }),
        ]);

        if (sectorsResponse.success) {
          setSectors(sectorsResponse.data.sectors);
        }

        if (locationsResponse.success) {
          setLocations(locationsResponse.data.locations);
        }
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        toast.error("Failed to load sectors and locations");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedGalleryImages((prev) => [...prev, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGalleryPreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    const previewToRemove = galleryPreviews[index];
    
    // Check if it's a new upload (will be a data URL or blob)
    const isNewUpload = previewToRemove.startsWith('data:') || previewToRemove.startsWith('blob:');
    
    if (isNewUpload) {
      // Find the file index in selectedGalleryImages
      // Note: This relies on the order being preserved, which it should be since we append to both
      // However, to be safer, we can count how many new uploads were before this one
      let newUploadIndex = 0;
      for (let i = 0; i < index; i++) {
        if (galleryPreviews[i].startsWith('data:') || galleryPreviews[i].startsWith('blob:')) {
          newUploadIndex++;
        }
      }
      setSelectedGalleryImages((prev) => prev.filter((_, i) => i !== newUploadIndex));
    }
    
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(data: ProjectFormValues) {
    setIsSubmitting(true);

    try {
      let imageUrl = project?.image;

      if (selectedImage) {
        try {
          const uploadResponse = await uploadService.uploadFile(
            selectedImage,
            "projects",
          );
          imageUrl = uploadResponse.data.url;
        } catch (uploadError: unknown) {
          const message =
            uploadError instanceof Error
              ? uploadError.message
              : "Unknown error";
          throw new Error("Failed to upload image: " + message);
        }
      }

      // Handle gallery uploads
      let galleryUrls: string[] = galleryPreviews.filter(
        (url) => !url.startsWith("data:") && !url.startsWith("blob:"),
      );

      if (selectedGalleryImages.length > 0) {
        try {
          const uploadPromises = selectedGalleryImages.map((file) =>
            uploadService.uploadFile(file, "projects/gallery"),
          );
          const uploadResponses = await Promise.all(uploadPromises);
          const newUrls = uploadResponses.map((res) => res.data.url);
          galleryUrls = [...galleryUrls, ...newUrls];
        } catch (uploadError: unknown) {
          const message =
            uploadError instanceof Error
              ? uploadError.message
              : "Unknown error";
          throw new Error("Failed to upload gallery images: " + message);
        }
      }

      const baseData = {
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
        image: imageUrl,
        gallery: galleryUrls,
      };

      let response;
      if (isEditMode && project) {
        const updateData: UpdateProjectData = {
          ...baseData,
          progress_percent: data.progress_percent ? parseInt(data.progress_percent) : undefined,
          spent: data.spent ? parseFloat(data.spent) : undefined,
        };
        response = await projectsService.updateProject(project.id, updateData);
      } else {
        response = await projectsService.createProject(baseData as CreateProjectData);
      }

      if (response.success) {
        toast.success(
          isEditMode
            ? "Project updated successfully"
            : "Project created successfully",
        );
        router.push(redirectPath);
        router.refresh();
      } else {
        toast.error(
          response.message ||
            `Failed to ${isEditMode ? "update" : "create"} project`,
        );
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unknown error occurred";
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} project:`,
        error,
      );
      toast.error(
        message ||
          `An error occurred while ${isEditMode ? "updating" : "creating"} the project`,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-slate-200/60 shadow-sm">
        <CardContent className="pt-6 space-y-8">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-l-4 border-amber-500 pl-3">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="title" className="font-bold text-slate-700">Project Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Road Rehabilitation Project"
                  className="mt-1.5 focus:border-amber-500 focus:ring-amber-500"
                  {...form.register("title")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="font-bold text-slate-700">Description *</Label>
                <div className="mt-1.5">
                  <RichTextEditor
                    value={form.watch("description")}
                    onChange={(content) => form.setValue("description", content)}
                    disabled={isSubmitting}
                    error={!!form.formState.errors.description}
                    placeholder="Detailed description of the project..."
                    height={250}
                  />
                </div>
                {form.formState.errors.description && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2">
                <Label className="font-bold text-slate-700">Project Image</Label>
                <div className="mt-2 flex flex-col sm:flex-row items-start gap-4">
                  {imagePreview ? (
                    <div className="relative h-40 w-full sm:w-64 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-red-600 hover:bg-white shadow-md transition-colors focus:outline-none"
                        title="Remove image"
                        disabled={isSubmitting}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex h-40 w-full sm:w-64 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 text-slate-300" />
                        <span className="text-xs font-medium uppercase tracking-wider">No Image Selected</span>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 space-y-3">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isSubmitting}
                      className="cursor-pointer file:bg-amber-50 file:text-amber-700 file:border-0 file:rounded-full file:px-4 file:py-1 file:text-xs file:font-bold hover:file:bg-amber-100 transition-all"
                    />
                    <p className="text-xs text-slate-500 font-medium">
                      Supported formats: <span className="text-slate-900 font-bold">JPG, PNG, WEBP</span>. Max size: <span className="text-slate-900 font-bold">2MB</span>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Gallery Upload */}
              <div className="md:col-span-2">
                <Label className="font-bold text-slate-700">Project Gallery (Multiple Images)</Label>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {galleryPreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 shadow-sm group">
                        <Image
                          src={preview}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-red-600 hover:bg-white shadow-md transition-colors opacity-0 group-hover:opacity-100 focus:outline-none"
                          title="Remove image"
                          disabled={isSubmitting}
                        >
                          <X size={14} />
                        </button>
                        {/* Status Overlay for new uploads */}
                        {(preview.startsWith('data:') || preview.startsWith('blob:')) && (
                          <div className="absolute inset-x-0 bottom-0 bg-amber-500/80 p-1 text-[10px] font-bold text-white text-center">
                            NEW
                          </div>
                        )}
                      </div>
                    ))}
                    
                    <label className={cn(
                      "relative aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all",
                      isSubmitting && "opacity-50 cursor-not-allowed"
                    )}>
                      <Plus className="h-8 w-8 text-slate-300 mb-2" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Add Image</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGalleryChange}
                        disabled={isSubmitting}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-100/50 p-3 rounded-lg border border-slate-200/50">
                    <ImageIcon className="h-4 w-4 text-amber-500" />
                    <p>
                      You can select multiple images to showcase more details of the project.
                      Supported: <span className="text-slate-900 font-bold">JPG, PNG, WEBP</span>.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="sector_id" className="font-bold text-slate-700">Sector *</Label>
                <div className="mt-1.5">
                  <Popover open={sectorOpen} onOpenChange={setSectorOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={sectorOpen}
                        className="w-full justify-between font-medium border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                        disabled={isSubmitting || isLoadingData}
                      >
                        {form.watch("sector_id")
                          ? sectors.find(
                              (s) => s.id.toString() === form.watch("sector_id"),
                            )?.name || "Select sector"
                          : isLoadingData
                            ? "Loading sectors..."
                            : "Select sector"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-amber-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0 shadow-xl border-slate-200"
                      align="start"
                    >
                      <Command className="bg-white">
                        <CommandInput placeholder="Search sectors..." className="border-none focus:ring-0" />
                        <CommandList>
                          <CommandEmpty>No sector found.</CommandEmpty>
                          <CommandGroup>
                            {sectors.map((sector) => (
                              <CommandItem
                                key={sector.id}
                                value={sector.name}
                                className="aria-selected:bg-amber-50 aria-selected:text-amber-900 cursor-pointer"
                                onSelect={() => {
                                  form.setValue(
                                    "sector_id",
                                    sector.id.toString(),
                                  );
                                  setSectorOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    form.watch("sector_id") ===
                                      sector.id.toString()
                                      ? "opacity-100 text-amber-500"
                                      : "opacity-0",
                                  )}
                                />
                                {sector.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                {form.formState.errors.sector_id && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {form.formState.errors.sector_id.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="font-bold text-slate-700">Location *</Label>
                <div className="mt-1.5">
                  <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={locationOpen}
                        className="w-full justify-between font-medium border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                        disabled={isSubmitting || isLoadingData}
                      >
                        {form.watch("location")
                          ? form.watch("location")
                          : isLoadingData
                            ? "Loading locations..."
                            : "Select location"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-amber-500" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-[--radix-popover-trigger-width] p-0 shadow-xl border-slate-200"
                      align="start"
                    >
                      <Command className="bg-white">
                        <CommandInput placeholder="Search locations..." className="border-none focus:ring-0" />
                        <CommandList>
                          <CommandEmpty>No location found.</CommandEmpty>
                          <CommandGroup>
                            {locations.map((location) => (
                              <CommandItem
                                key={location.id}
                                value={location.name}
                                className="aria-selected:bg-amber-50 aria-selected:text-amber-900 cursor-pointer"
                                onSelect={() => {
                                  form.setValue("location", location.name);
                                  setLocationOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    form.watch("location") === location.name
                                      ? "opacity-100 text-amber-500"
                                      : "opacity-0",
                                  )}
                                />
                                {location.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                {form.formState.errors.location && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {form.formState.errors.location.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Status and Progress */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-l-4 border-amber-500 pl-3">
              Status & Progress
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="status" className="font-bold text-slate-700">Status *</Label>
                <div className="mt-1.5">
                  <Select
                    onValueChange={(value: "planning" | "ongoing" | "completed" | "on_hold") => form.setValue("status", value)}
                    defaultValue={form.getValues("status")}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="focus:border-amber-500 focus:ring-amber-500">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="planning">Planning</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="on_hold">On Hold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.formState.errors.status && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>

              {isEditMode && (
                <div>
                  <Label htmlFor="progress_percent" className="font-bold text-slate-700">Progress (%)</Label>
                  <Input
                    id="progress_percent"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    className="mt-1.5 focus:border-amber-500 focus:ring-amber-500"
                    {...form.register("progress_percent")}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-l-4 border-amber-500 pl-3">
              Financial Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="budget" className="font-bold text-slate-700">Budget (₵) *</Label>
                <Input
                  id="budget"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="mt-1.5 focus:border-amber-500 focus:ring-amber-500"
                  {...form.register("budget")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.budget && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {form.formState.errors.budget.message}
                  </p>
                )}
              </div>

              {isEditMode && (
                <div>
                  <Label htmlFor="spent" className="font-bold text-slate-700">Amount Spent (₵)</Label>
                  <Input
                    id="spent"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="mt-1.5 focus:border-amber-500 focus:ring-amber-500"
                    {...form.register("spent")}
                    disabled={isSubmitting}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-l-4 border-amber-500 pl-3">Timeline</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="start_date" className="font-bold text-slate-700">Start Date *</Label>
                <Input
                  id="start_date"
                  type="date"
                  className="mt-1.5 focus:border-amber-500 focus:ring-amber-500"
                  {...form.register("start_date")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.start_date && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {form.formState.errors.start_date.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="end_date" className="font-bold text-slate-700">End Date *</Label>
                <Input
                  id="end_date"
                  type="date"
                  className="mt-1.5 focus:border-amber-500 focus:ring-amber-500"
                  {...form.register("end_date")}
                  disabled={isSubmitting}
                />
                {form.formState.errors.end_date && (
                  <p className="text-red-500 text-xs mt-1 font-medium">
                    {form.formState.errors.end_date.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contractor Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-l-4 border-amber-500 pl-3">
              Contractor Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="contractor" className="font-bold text-slate-700">Contractor Name</Label>
                <Input
                  id="contractor"
                  placeholder="e.g., Ghana Construction Ltd"
                  className="mt-1.5 focus:border-amber-500 focus:ring-amber-500"
                  {...form.register("contractor")}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="contact_person" className="font-bold text-slate-700">Contact Person</Label>
                <Input
                  id="contact_person"
                  placeholder="e.g., John Mensah"
                  className="mt-1.5 focus:border-amber-500 focus:ring-amber-500"
                  {...form.register("contact_person")}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="contact_phone" className="font-bold text-slate-700">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="e.g., +233249973054"
                  className="mt-1.5 focus:border-amber-500 focus:ring-amber-500"
                  {...form.register("contact_phone")}
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(
                      /[^0-9+]/g,
                      "",
                    );
                  }}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="pt-4">
            <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
              <Checkbox
                id="is_featured"
                checked={form.watch("is_featured")}
                onCheckedChange={(checked) =>
                  form.setValue("is_featured", checked as boolean)
                }
                disabled={isSubmitting}
                className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <Label
                htmlFor="is_featured"
                className="text-sm font-bold text-slate-700 cursor-pointer"
              >
                Feature this project on the public website
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4 pb-12">
        <Button
          type="button"
          variant="outline"
          className="border-slate-200 text-slate-600 font-bold"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 shadow-[0_4px_12px_rgba(245,158,11,0.3)] transition-all active:scale-95"
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
