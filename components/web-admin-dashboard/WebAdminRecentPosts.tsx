"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { blogService, BlogPost } from "@/lib/services/blog-service";
import { Loader2, FileText } from "lucide-react";
import { format } from "date-fns";

export function WebAdminRecentPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await blogService.getAdminPosts(1, 5);
        if (response.success && response.data?.posts) {
          setPosts(response.data.posts);
        } else {
          setError(response.message || "Failed to load posts");
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No date";
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Blog Posts</h2>
          <Link href="/web-admin-dashboard/blog" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Recent Blog Posts</h2>
          <Link href="/web-admin-dashboard/blog" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View All
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-sm text-slate-500">{error || "No blog posts found"}</p>
          <Link href="/web-admin-dashboard/blog/new" className="text-sm text-blue-600 hover:underline mt-2">
            Create your first post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900">Recent Blog Posts</h2>
        <Link href="/web-admin-dashboard/blog" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {posts.map((post) => (
          <div key={post.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-start gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-slate-900 line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-slate-500">{formatDate(post.published_at || post.created_at)}</p>
            </div>
            <Link
              href={`/web-admin-dashboard/blog/${post.id}/edit`}
              className="text-xs font-medium text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

