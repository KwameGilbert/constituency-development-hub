"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  Plus,
  GripVertical,
  Edit,
  Trash2,
  Info,
  Loader2,
  ImageIcon,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { heroSlidesService, HeroSlide } from "@/lib/services/carousel-service";
import { cleanupHtml } from "@/lib/utils";
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

export function CarouselList() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSlides();
  }, []);

  // Filter slides based on search query
  const filteredSlides = useMemo(() => {
    if (!searchQuery.trim()) return slides;

    const query = searchQuery.toLowerCase();
    return slides.filter(
      (slide) =>
        slide.title?.toLowerCase().includes(query) ||
        slide.subtitle?.toLowerCase().includes(query) ||
        slide.cta_text?.toLowerCase().includes(query) ||
        slide.cta_link?.toLowerCase().includes(query),
    );
  }, [slides, searchQuery]);

  async function fetchSlides() {
    try {
      setLoading(true);
      const response = await heroSlidesService.getAllSlides();
      if (response.success && response.data.slides) {
        // Sort by display_order
        const sortedSlides = response.data.slides.sort(
          (a, b) => a.display_order - b.display_order,
        );
        setSlides(sortedSlides);
      }
    } catch (error) {
      console.error("Failed to fetch hero slides:", error);
      toast.error("Failed to load hero slides");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      setDeletingId(id);
      const response = await heroSlidesService.deleteSlide(id);
      if (response.success) {
        setSlides(slides.filter((slide) => slide.id !== id));
        toast.success("Hero slide deleted successfully");
      }
    } catch (error) {
      console.error("Failed to delete hero slide:", error);
      toast.error("Failed to delete hero slide");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-slate-50/80 backdrop-blur-md p-6 rounded-xl shadow-sm border border-transparent data-stuck:border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sticky top-16 z-10 -mx-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Hero Slides</h2>
          <p className="text-sm text-slate-500">
            Manage sliding images that appear on the homepage hero section
          </p>
        </div>
        <Link href="/web-admin-dashboard/carousel/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Add Hero Slide
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search slides by title, subtitle, or button text..."
            className="pl-10 pr-10 border-slate-200 focus:border-amber-500 focus:ring-amber-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-slate-500 mt-2">
            Found {filteredSlides.length}{" "}
            {filteredSlides.length === 1 ? "slide" : "slides"} matching &quot;
            {searchQuery}&quot;
          </p>
        )}
      </div>

      {slides.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]">
          <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-amber-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-900">
              No Hero Slides
            </h3>
            <p className="text-slate-500 max-w-sm mx-auto">
              Add your first hero slide to display on the homepage.
            </p>
          </div>
        </div>
      ) : filteredSlides.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
          <Search className="h-8 w-8 text-slate-300" />
          <p className="text-slate-500">
            No slides matching &quot;{searchQuery}&quot;
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear Search
          </Button>
        </div>
      ) : (
        <>
          {/* Info Alert */}
          <div className="flex items-center gap-2 text-sm text-slate-600 px-2">
            <Info className="h-4 w-4 text-slate-400" />
            <span>
              Slides are displayed in order of their display order. Lower
              numbers appear first.
            </span>
          </div>

          {/* List Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filteredSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors group"
                >
                  <div className="cursor-move text-slate-300 hover:text-slate-500">
                    <GripVertical className="h-5 w-5" />
                  </div>

                  {/* Order Badge */}
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-bold">
                    {slide.display_order}
                  </div>

                  <div className="h-16 w-24 bg-slate-100 rounded-md overflow-hidden border border-slate-200 shrink-0 relative">
                    {slide.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-200 text-slate-400 text-xs">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {cleanupHtml(slide.title || "")}
                    </h3>
                    {slide.subtitle && (
                      <p className="text-xs text-slate-500 truncate">
                        {cleanupHtml(slide.subtitle || "")}
                      </p>
                    )}
                    {slide.cta_link && (
                      <p className="text-xs text-amber-600 flex items-center gap-1 mt-1">
                        <ExternalLink className="h-3 w-3" />
                        {slide.cta_text || slide.cta_link}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        slide.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {slide.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/web-admin-dashboard/carousel/${slide.id}/edit`}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:bg-red-50 hover:text-red-600"
                          disabled={deletingId === slide.id}
                        >
                          {deletingId === slide.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Hero Slide</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;{slide.title}
                            &quot;? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(slide.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
