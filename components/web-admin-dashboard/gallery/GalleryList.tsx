"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Search,
  X,
  ImageIcon,
  Calendar,
  MapPin,
  Images,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { galleryService, Gallery } from "@/lib/services/gallery-service";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";
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

export default function GalleryList() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getAdminGalleries();
      if (response.success && response.data.galleries) {
        setGalleries(response.data.galleries);
      } else {
        setError(response.message || "Failed to load galleries");
      }
    } catch (err) {
      console.error("Error fetching galleries:", err);
      setError("An unexpected error occurred while fetching galleries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setIsDeleting(id);
      const response = await galleryService.deleteGallery(id);
      if (response.success) {
        toast.success("Gallery album deleted successfully");
        setGalleries((prev) => prev.filter((g) => g.id !== id));
      } else {
        toast.error(response.message || "Failed to delete gallery");
      }
    } catch (err) {
      console.error("Error deleting gallery:", err);
      toast.error("Failed to delete gallery album");
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredGalleries = useMemo(() => {
    return galleries.filter(
      (gallery) =>
        gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gallery.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gallery.location.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [galleries, searchQuery]);

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
        <p>Loading gallery albums...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-red-50 rounded-xl border border-red-100">
        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <X className="h-6 w-6 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-red-900 mb-1">
          Error Loading Galleries
        </h3>
        <p className="text-red-600 max-w-md mb-4">{error}</p>
        <Button
          onClick={fetchGalleries}
          variant="outline"
          className="border-red-200 hover:bg-red-50"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search albums by title, category, or location..."
            className="pl-10 bg-white border-slate-200 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Link href="/web-admin-dashboard/gallery/new">
          <Button className="bg-amber-600 hover:bg-emerald-700 h-11 px-6 shadow-sm shadow-emerald-100">
            <Plus className="mr-2 h-4 w-4" /> Create Album
          </Button>
        </Link>
      </div>

      {/* Gallery List Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">Cover</th>
                <th className="px-6 py-4 font-medium">Album Title</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Date & Photos</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGalleries.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon className="h-10 w-10 text-slate-200" />
                      <p>
                        {searchQuery
                          ? "No albums match your search"
                          : "No gallery albums found"}
                      </p>
                      {!searchQuery && (
                        <Link
                          href="/web-admin-dashboard/gallery/new"
                          className="text-emerald-600 hover:underline font-medium mt-2"
                        >
                          Create your first gallery album
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGalleries.map((gallery) => (
                  <tr
                    key={gallery.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="h-12 w-16 bg-slate-100 rounded-md overflow-hidden border border-slate-200 shrink-0 flex items-center justify-center">
                        {gallery.cover_image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={getImageUrl(gallery.cover_image)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-slate-300" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900 line-clamp-1">
                          {gallery.title}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3" /> {gallery.location}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                        {gallery.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs gap-1">
                        <span className="text-slate-700 flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {format(new Date(gallery.date), "MMM d, yyyy")}
                        </span>
                        <span className="text-slate-500 flex items-center gap-1">
                          <Images className="h-3 w-3 text-slate-400" />
                          {gallery.images?.length || 0} photos
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          gallery.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {gallery.status === "active" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/gallery`} target="_blank">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-amber-600"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/web-admin-dashboard/gallery/${gallery.id}/edit`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-400 hover:text-blue-600"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-red-600"
                            >
                              {isDeleting === gallery.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the gallery album
                                &quot;{gallery.title}&quot; and all its
                                associated photos from the server.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(gallery.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete Album
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
      </div>
    </div>
  );
}
