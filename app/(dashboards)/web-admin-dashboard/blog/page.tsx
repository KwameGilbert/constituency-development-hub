import React from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { BlogPostsHeader } from "@/components/web-admin-dashboard/blog/BlogPostsHeader";
import { BlogPostsTable } from "@/components/web-admin-dashboard/blog/BlogPostsTable";
import { blogService, BlogPost } from "@/lib/services/blog-service";

interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

// Force dynamic rendering to always fetch fresh data
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ManageBlogPostsPage() {
  let posts: BlogPost[] = [];
  let pagination: Pagination | undefined = undefined;
  let error: string | null = null;

  try {
    const response = await blogService.getAdminPosts();
    if (response) {
      if (response.success && response.data) {
        posts = response.data.posts || [];
        pagination = response.data.pagination;
      }
    }
  } catch (e: unknown) {
    console.error("Failed to fetch blog posts:", e);
    error = e instanceof Error ? e.message : "Failed to load blog posts";
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <WebAdminHeader title="Blog Posts" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <BlogPostsHeader />

        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            Error: {error}
          </div>
        ) : (
          <BlogPostsTable posts={posts} pagination={pagination} />
        )}
      </div>
    </div>
  );
}
