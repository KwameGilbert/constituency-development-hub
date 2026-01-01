import React from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { BlogPostsHeader } from "@/components/web-admin-dashboard/blog/BlogPostsHeader";
import { BlogPostsTable } from "@/components/web-admin-dashboard/blog/BlogPostsTable";
import { blogService } from "@/lib/services/blog-service";

export default async function ManageBlogPostsPage() {
  let posts: any[] = [];
  let pagination: any = undefined;
  let error = null;

  try {
    const response = await blogService.getAdminPosts();
    if (response) {
       // Handle both possible structures if necessary, but strictly typing based on blog.http
       // blog.http says: data: { posts: [...] }
       if (response.success && response.data) {
          posts = response.data.posts || [];
          pagination = response.data.pagination;
       }
    }
  } catch (e: any) {
    console.error("Failed to fetch blog posts:", e);
    error = e.message || "Failed to load blog posts";
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
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
