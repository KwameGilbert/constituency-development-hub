"use client";

import React, { useState } from "react";
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
import { blogService } from "@/lib/services/blog-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, X, Upload } from "lucide-react";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published"]),
  publishDate: z.string().optional(),
  is_featured: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export function NewBlogPostForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Hardcoded categories as per blog.http example
  const categories = ["news", "projects", "community", "events"];

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      category: "news",
      status: "draft",
      publishDate: new Date().toISOString().split("T")[0],
      is_featured: false,
    },
  });

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage() {
    setSelectedFile(null);
    setImagePreview("");
    // Reset file input
    const fileInput = document.getElementById(
      "featured-image",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  }

  async function onSubmit(data: BlogFormValues) {
    setIsLoading(true);
    try {
      // Prepare payload
      const payload = {
        title: data.title,
        content: data.content || "",
        excerpt: data.excerpt,
        image: imagePreview && !selectedFile ? imagePreview : undefined,
        category: data.category,
        tags: [], // API expects tags array
        status: data.status,
        published_at: data.publishDate
          ? `${data.publishDate} 00:00:00`
          : undefined,
      };

      console.log("Creating post with payload:", payload);
      const response = await blogService.createPost(
        payload,
        selectedFile || undefined,
      );

      if (response.success) {
        toast.success("Blog post created successfully!");
        router.push("/web-admin-dashboard/blog");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to create post");
      }
    } catch (error: unknown) {
      console.error("Error creating blog post:", error);
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    form.setValue("slug", slug);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8"
    >
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Post Title *</Label>
          <Input
            id="title"
            placeholder="Enter post title"
            className="border-slate-200 focus:border-amber-500 focus:ring-amber-500"
            {...form.register("title")}
            disabled={isLoading}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">
            URL Slug{" "}
            <span className="text-slate-400 font-normal">
              (Leave empty to auto-generate)
            </span>
          </Label>
          <div className="flex gap-2">
            <Input
              id="slug"
              placeholder="my-post-url"
              className="border-slate-200 focus:border-amber-500 focus:ring-amber-500"
              {...form.register("slug")}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateSlug}
              className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              disabled={isLoading}
            >
              Generate
            </Button>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category *</Label>
          <Select
            onValueChange={(value) => form.setValue("category", value)}
            defaultValue={form.getValues("category")}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.category && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.category.message}
            </p>
          )}
        </div>

        {/* Featured Image */}
        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="space-y-4">
            {/* URL Input (temporary fallback) */}
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="Or enter image URL: https://example.com/image.jpg"
                className="border-slate-200 focus:border-amber-500 focus:ring-amber-500"
                value={imagePreview && !selectedFile ? imagePreview : ""}
                onChange={(e) => {
                  setImagePreview(e.target.value);
                  setSelectedFile(null);
                }}
                disabled={isLoading}
              />
              <p className="text-xs text-slate-400">
                Temporary: Use URL until upload endpoint is ready
              </p>
            </div>

            {/* File Input */}
            {!imagePreview ? (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                <input
                  id="featured-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading}
                />
                <label
                  htmlFor="featured-image"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="h-10 w-10 text-slate-400" />
                  <div className="text-sm text-slate-600">
                    <span className="font-semibold text-amber-600 hover:text-amber-700">
                      Click to upload
                    </span>
                    {" or drag and drop"}
                  </div>
                  <p className="text-xs text-slate-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Featured image preview"
                  className="w-full h-48 object-cover rounded-lg border border-slate-200"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removeImage}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
                {selectedFile && (
                  <p className="mt-2 text-xs text-slate-500">
                    Selected: {selectedFile.name} (
                    {(selectedFile.size / 1024).toFixed(2)} KB)
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">
            Excerpt *{" "}
            <span className="text-slate-400 font-normal">(Short summary)</span>
          </Label>
          <RichTextEditor
            value={form.watch("excerpt")}
            onChange={(content) => form.setValue("excerpt", content)}
            disabled={isLoading}
            error={!!form.formState.errors.excerpt}
            placeholder="A brief summary of your blog post..."
            height={350}
          />
          {form.formState.errors.excerpt && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.excerpt.message}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Post Content</Label>
          <RichTextEditor
            value={form.watch("content")}
            onChange={(content) => form.setValue("content", content)}
            disabled={isLoading}
            error={!!form.formState.errors.content}
            placeholder="Write your full post content here..."
            height={400}
          />
          <p className="text-xs text-slate-400">
            Use the rich text editor for formatting your content
          </p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Publish Status</Label>
          <Select
            onValueChange={(value) =>
              form.setValue("status", value as "draft" | "published")
            }
            defaultValue={form.getValues("status")}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-slate-400">
            Draft posts are only visible to admins. Published posts are visible
            to the public.
          </p>
        </div>

        {/* Publish Date */}
        <div className="space-y-2">
          <Label htmlFor="publishDate">Publish Date</Label>
          <Input
            id="publishDate"
            type="datetime-local"
            className="border-slate-200 focus:border-violet-500 focus:ring-violet-500"
            {...form.register("publishDate")}
            disabled={isLoading}
          />
          <p className="text-xs text-slate-400">
            Set the date this post should be considered published.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          className="border-slate-200 text-slate-600 hover:bg-slate-50"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 text-white"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Saving..." : "Save Post"}
        </Button>
      </div>
    </form>
  );
}
