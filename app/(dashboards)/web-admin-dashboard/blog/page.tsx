import React from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { BlogPostsHeader } from "@/components/web-admin-dashboard/blog/BlogPostsHeader";
import { BlogPostsTable } from "@/components/web-admin-dashboard/blog/BlogPostsTable";

export default function ManageBlogPostsPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <WebAdminHeader title="Blog Posts" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <BlogPostsHeader />
        <BlogPostsTable />
      </div>
    </div>
  );
}
