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
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border-none flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-slate-100/60 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
            Recent Blog Posts
          </h2>
          <Link
            href="/web-admin-dashboard/blog"
            className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
          >
            View All
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-8">
          <Loader2 className="h-6 w-6 text-amber-600 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border-none flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-slate-100/60 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
            Recent Blog Posts
          </h2>
          <Link
            href="/web-admin-dashboard/blog"
            className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
          >
            View All
          </Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-amber-600" />
          </div>
          <p className="text-sm text-slate-500">
            {error || "No blog posts found"}
          </p>
          <Link
            href="/web-admin-dashboard/blog/new"
            className="text-sm text-amber-600 hover:underline mt-2 font-medium"
          >
            Create your first post
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md shadow-slate-200/50 border-none flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-100/60 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
          Recent Blog Posts
        </h2>
        <Link
          href="/web-admin-dashboard/blog"
          className="text-sm text-amber-600 hover:text-amber-700 font-semibold"
        >
          View All
        </Link>
      </div>
      <div className="divide-y divide-slate-50">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 hover:bg-slate-50/80 transition-colors flex justify-between items-start gap-4 group"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-amber-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                {formatDate(post.published_at || post.created_at)}
              </p>
            </div>
            <Link
              href={`/web-admin-dashboard/blog/${post.id}/edit`}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 whitespace-nowrap bg-amber-50 px-2 py-1 rounded-md"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
