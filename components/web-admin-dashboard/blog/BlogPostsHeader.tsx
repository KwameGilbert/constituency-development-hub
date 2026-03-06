import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Star } from "lucide-react";
import Link from "next/link";

export function BlogPostsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Manage Blog Posts</h1>
        <p className="text-sm text-slate-500">
          Create, edit and manage your blog content
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search posts..."
            className="pl-9 border-slate-200 focus:border-violet-500 focus:ring-violet-500"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-violet-50 text-violet-700 border-violet-100 hover:bg-violet-100"
          >
            All
          </Button>
          <Button
            variant="outline"
            className="text-slate-600 border-slate-200 hover:bg-slate-50"
          >
            <Star className="mr-2 h-4 w-4 text-yellow-500" />
            Featured
          </Button>
        </div>

        <Link href="/web-admin-dashboard/blog/new">
          <Button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>
    </div>
  );
}
