"use client";

import React, { useState, useEffect } from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { BlogPostsHeader } from "@/components/web-admin-dashboard/blog/BlogPostsHeader";
import { BlogPostsTable } from "@/components/web-admin-dashboard/blog/BlogPostsTable";
import { blogService, BlogPost } from "@/lib/services/blog-service";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export default function ManageBlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await blogService.getAdminPosts();
      if (response && response.success && response.data) {
        setPosts(response.data.posts || []);
        setPagination(response.data.pagination);
        setError(null);
      } else {
        setError(response?.message || "Failed to load blog posts");
      }
    } catch (e: unknown) {
      console.error("Failed to fetch blog posts:", e);
      setError(e instanceof Error ? e.message : "Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
        <WebAdminHeader title="Blog Posts" />
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          <BlogPostsHeader />
          <Card className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <WebAdminHeader title="Blog Posts" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <BlogPostsHeader />

        {error ? (
          <Card className="p-12 text-center">
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <p className="text-slate-500 mt-2">
              Please try refreshing the page
            </p>
          </Card>
        ) : (
          <BlogPostsTable posts={posts} pagination={pagination} />
        )}
      </div>
    </div>
  );
}
