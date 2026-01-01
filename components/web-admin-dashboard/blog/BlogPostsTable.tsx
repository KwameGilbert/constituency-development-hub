"use client";

import React, { useState } from "react";
import { ExternalLink, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BlogPost, BlogResponse, blogService } from "@/lib/services/blog-service";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BlogPostsTableProps {
  posts: BlogPost[];
  pagination?: BlogResponse["data"]["pagination"];
}

export function BlogPostsTable({ posts: initialPosts, pagination }: BlogPostsTableProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      const response = await blogService.deletePost(id);
      if (response.success) {
        setPosts(posts.filter(p => p.id !== id));
        toast.success("Blog post deleted successfully");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      toast.error("Failed to delete blog post");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 font-medium">Post</th>
              <th className="px-6 py-4 font-medium w-32">Date</th>
              <th className="px-6 py-4 font-medium w-24 text-center">Status</th>
              <th className="px-6 py-4 font-medium w-40 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  No blog posts found
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden flex items-center justify-center border border-slate-200">
                        {post.featured_image ? (
                          <div className="relative w-full h-full"> 
                             {/* eslint-disable-next-line @next/next/no-img-element */}
                             <img src={post.featured_image} alt="" className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-medium text-slate-900 line-clamp-2 max-w-xl block mb-1">
                          {post.title}
                        </span>
                        <div className="flex gap-2 text-xs text-slate-500">
                           <span className="bg-slate-100 px-2 py-0.5 rounded capitalize">{post.category}</span>
                           {post.tags && post.tags.length > 0 && (
                             <span className="text-slate-400">+{post.tags.length} tags</span>
                           )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                    {post.published_at ? format(new Date(post.published_at), "MMM d, yyyy") : "-"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                        "inline-flex items-center justify-center h-6 px-2 rounded-full text-xs font-medium capitalize",
                        post.status === "published" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {post.status || "draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                       <Link href={`/blog/${post.slug}`} target="_blank"> 
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/web-admin-dashboard/blog/${post.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-slate-400 hover:text-red-600"
                            disabled={deletingId === post.id}
                          >
                            {deletingId === post.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{post.title}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
                Showing page {pagination.page} of {pagination.total_pages} ({pagination.total} posts)
            </p>
            <div className="flex gap-1">
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-50"
                    disabled={pagination.page <= 1}
                >
                    {"<"}
                </Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0 bg-violet-50 text-violet-600 border-violet-200">
                    {pagination.page}
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-slate-600 hover:bg-slate-50"
                    disabled={pagination.page >= pagination.total_pages}
                >
                    {">"}
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
