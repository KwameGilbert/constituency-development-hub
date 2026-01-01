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
import { blogService } from "@/lib/services/blog-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const blogSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().optional(),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published"]),
  featured_image: z.string().optional(),
  is_featured: z.boolean(),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export function NewBlogPostForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    
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
            featured_image: "",
            is_featured: false,
        },
    });

    async function onSubmit(data: BlogFormValues) {
        setIsLoading(true);
        try {
            // Only send fields that the API expects (based on blog.http)
            // Note: Backend auto-generates slug from title
            const payload = {
                title: data.title,
                content: data.content || "",
                excerpt: data.excerpt,
                featured_image: data.featured_image || undefined,
                category: data.category,
                tags: [], // API expects tags array
                status: data.status,
            };

            console.log("Creating post with payload:", payload);
            const response = await blogService.createPost(payload);
            
            if (response.success) {
                toast.success("Blog post created successfully!");
                router.push("/web-admin-dashboard/blog");
                router.refresh();
            } else {
                toast.error(response.message || "Failed to create post");
            }
        } catch (error: unknown) {
            console.error("Error creating blog post:", error);
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
                    <Label htmlFor="title">Post Title</Label>
                    <Input 
                        id="title" 
                        placeholder="Enter post title" 
                        className="border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
                        {...form.register("title")}
                    />
                    {form.formState.errors.title && (
                        <p className="text-red-500 text-sm">{form.formState.errors.title.message}</p>
                    )}
                </div>

                {/* Slug */}
                <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug <span className="text-slate-400 font-normal">(Leave empty to auto-generate)</span></Label>
                    <div className="flex gap-2">
                        <Input 
                            id="slug" 
                            placeholder="my-post-url" 
                            className="border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
                            {...form.register("slug")}
                        />
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={generateSlug}
                            className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        >
                            Generate
                        </Button>
                    </div>
                </div>

                {/* Category */}
                <div className="space-y-2">
                    <Label>Category</Label>
                    <Select 
                        onValueChange={(value) => form.setValue("category", value)} 
                        defaultValue={form.getValues("category")}
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

                {/* Excerpt */}
                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt <span className="text-slate-400 font-normal">(Short summary)</span></Label>
                    <Textarea 
                        id="excerpt" 
                        className="min-h-[100px] border-slate-200 focus:border-violet-500 focus:ring-violet-500" 
                        {...form.register("excerpt")}
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
                        className="min-h-[200px] border-slate-200 focus:border-violet-500 focus:ring-violet-500 font-mono" 
                        {...form.register("content")}
                    />
                </div>

                {/* Status */}
                 <div className="space-y-2">
                    <Label>Publish Status</Label>
                    <Select 
                        onValueChange={(value) => form.setValue("status", value as "draft" | "published")} 
                        defaultValue={form.getValues("status")}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="draft">Draft</SelectItem>
                           <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <Button 
                    type="button" 
                    variant="outline" 
                    className="border-slate-200 text-slate-600 hover:bg-slate-50"
                    onClick={() => router.back()}
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
