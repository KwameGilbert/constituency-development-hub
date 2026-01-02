"use client";

import React, { useState } from "react";
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
import { blogService, BlogPost } from "@/lib/services/blog-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, X, ImageIcon } from "lucide-react";
import Link from "next/link";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published"]),
});

type BlogFormValues = z.infer<typeof blogSchema>;

interface EditBlogPostFormProps {
  post: BlogPost;
}

export function EditBlogPostForm({ post }: EditBlogPostFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(post.featured_image || "");
  const [imagePreview, setImagePreview] = useState<string>(post.featured_image || "");
  
  // Hardcoded categories as per blog.http example
  const categories = ["news", "projects", "community", "events"];

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: post.title || "",
      slug: post.slug || "",
      excerpt: post.excerpt || "",
      content: post.content || "",
      category: post.category || "news",
      status: post.status || "draft",
    },
  });

  function handleImageUrlChange(url: string) {
    setImageUrl(url);
    setImagePreview(url);
  }

  function removeImage() {
    setImageUrl("");
    setImagePreview("");
  }

  async function onSubmit(data: BlogFormValues) {
    setIsLoading(true);
    try {
      const payload = {
        title: data.title,
        content: data.content || "",
        excerpt: data.excerpt,
        featured_image: imageUrl || undefined,
        category: data.category,
        status: data.status,
      };

      console.log("Updating post with payload:", payload);
      const response = await blogService.updatePost(post.id, payload);
      
      if (response.success) {
        toast.success("Blog post updated successfully!");
        router.push("/web-admin-dashboard/blog");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to update post");
      }
    } catch (error: unknown) {
      console.error("Error updating blog post:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-8">
      <div className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Post Title *</Label>
          <Input 
            id="title" 
            placeholder="Enter post title" 
            className="border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
            {...form.register("title")}
            disabled={isLoading}
          />
          {form.formState.errors.title && (
            <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
          )}
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <div className="flex gap-2">
            <Input 
              id="slug" 
              placeholder="my-post-url" 
              className="border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
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
          <p className="text-xs text-slate-400">This will be used in the post&apos;s URL</p>
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
            <p className="text-red-500 text-sm">{form.formState.errors.category.message}</p>
          )}
        </div>

        {/* Featured Image */}
        <div className="space-y-2">
          <Label>Featured Image</Label>
          <div className="space-y-4">
            <Input 
              type="url"
              placeholder="https://example.com/blog-image.jpg" 
              className="border-slate-200 focus:border-violet-500 focus:ring-violet-500"
              value={imageUrl}
              onChange={(e) => handleImageUrlChange(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-slate-400">Enter the URL for your blog post&apos;s featured image</p>
            
            {/* Image Preview */}
            {imagePreview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={imagePreview} 
                  alt="Featured image preview" 
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
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-violet-50 rounded-full mb-3">
                  <ImageIcon className="h-6 w-6 text-violet-600" />
                </div>
                <p className="text-sm text-slate-500">Enter an image URL above to preview</p>
                <p className="text-xs text-slate-400 mt-1">Recommended size: 1200x630 pixels</p>
              </div>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt * <span className="text-slate-400 font-normal">(Short summary)</span></Label>
          <Textarea 
            id="excerpt" 
            placeholder="A brief summary of your blog post..."
            className="min-h-[100px] border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
            {...form.register("excerpt")}
            disabled={isLoading}
          />
          {form.formState.errors.excerpt && (
            <p className="text-red-500 text-sm">{form.formState.errors.excerpt.message}</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Post Content</Label>
          <Textarea 
            id="content" 
            placeholder="Write your full post content here..."
            className="min-h-[300px] border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
            {...form.register("content")}
            disabled={isLoading}
          />
          <p className="text-xs text-slate-400">Tip: You can use markdown formatting for rich text</p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Publish Status</Label>
          <Select 
            onValueChange={(value) => form.setValue("status", value as "draft" | "published")} 
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
            Draft posts are only visible to admins. Published posts are visible to the public.
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
        <Link href="/web-admin-dashboard/blog">
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
          className="bg-violet-600 hover:bg-violet-700 text-white"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Updating..." : "Update Post"}
        </Button>
      </div>
    </form>
  );
}
