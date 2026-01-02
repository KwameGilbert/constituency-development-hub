"use client";

import React, { useEffect, useState } from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { EditBlogPostForm } from "@/components/web-admin-dashboard/blog/EditBlogPostForm";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { blogService, BlogPost } from "@/lib/services/blog-service";
import { use } from "react";

interface EditBlogPostPageProps {
  params: Promise<{ id: string }>;
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const { id } = use(params);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await blogService.getPostById(parseInt(id));
        if (response.success && response.data.post) {
          setPost(response.data.post);
        } else {
          setError("Blog post not found");
        }
      } catch (err: unknown) {
        console.error("Failed to fetch blog post:", err);
        setError(err instanceof Error ? err.message : "Failed to load blog post");
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <WebAdminHeader title="Edit Post" />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <WebAdminHeader title="Edit Post" />
        <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">Blog Post Not Found</h2>
          <p className="text-slate-500 mb-4">{error || "The blog post you&apos;re trying to edit doesn&apos;t exist."}</p>
          <Link href="/web-admin-dashboard/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog Posts
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <WebAdminHeader title="Edit Post" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href="/web-admin-dashboard/blog">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Blog Post</h1>
            <p className="text-slate-500">Update &quot;{post.title}&quot;</p>
          </div>
        </div>
        
        <EditBlogPostForm post={post} />
      </div>
    </div>
  );
}
