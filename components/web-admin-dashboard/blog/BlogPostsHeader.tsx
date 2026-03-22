import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Star } from "lucide-react";
import Link from "next/link";

export function BlogPostsHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/80 backdrop-blur-md p-6 rounded-2xl shadow-md shadow-slate-200/50 border-none sticky top-16 z-10 -mx-4 transition-all">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Manage Blog Posts
        </h1>
        <p className="text-sm font-medium text-slate-500">
          Create, edit and manage your blog content
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search posts..."
            className="pl-9 border-slate-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl"
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100 rounded-xl font-semibold"
          >
            All
          </Button>
          <Button
            variant="outline"
            className="text-slate-600 border-slate-200 hover:bg-slate-50 rounded-xl font-semibold"
          >
            <Star className="mr-2 h-4 w-4 text-amber-500" />
            Featured
          </Button>
        </div>

        <Link href="/web-admin-dashboard/blog/new">
          <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-sm shadow-amber-500/20">
            <Plus className="mr-2 h-4 w-4 stroke-[3px]" />
            New Post
          </Button>
        </Link>
      </div>
    </div>
  );
}
