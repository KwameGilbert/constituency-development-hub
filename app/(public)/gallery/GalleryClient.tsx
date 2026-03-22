"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Images,
  Calendar,
  MapPin,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { galleryService, Gallery } from "@/lib/services/gallery-service";
import { getImageUrl, cleanupHtml } from "@/lib/utils";

const categories: ("All" | string)[] = [
  "All",
  "Events",
  "Programs",
  "Community",
  "Infrastructure",
  "General",
];

export default function GalleryClient() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const searchParams = useSearchParams();

  useEffect(() => {
    const slug = searchParams.get("slug");
    if (slug && galleries.length > 0) {
      const gallery = galleries.find((g) => g.slug === slug);
      if (gallery) {
        setSelectedItem(gallery);
      }
    }
  }, [galleries, searchParams]);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await galleryService.getGalleries();
      if (response.success && response.data.galleries) {
        setGalleries(response.data.galleries);
      } else {
        setError(response.message || "Failed to load galleries");
      }
    } catch (err) {
      console.error("Error fetching galleries:", err);
      setError("An unexpected error occurred while loading our moments.");
    } finally {
      setLoading(false);
    }
  };

  // Filter items by category
  const filteredItems =
    activeCategory === "All"
      ? galleries
      : galleries.filter((item) => item.category === activeCategory);

  // Open lightbox
  const openLightbox = (item: Gallery) => {
    setSelectedItem(item);
    setCurrentImageIndex(0);
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedItem(null);
    setCurrentImageIndex(0);
  };

  // Navigate images
  const nextImage = () => {
    if (selectedItem) {
      setCurrentImageIndex((prev) =>
        prev === selectedItem.images.length - 1 ? 0 : prev + 1,
      );
    }
  };

  const prevImage = () => {
    if (selectedItem && selectedItem.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedItem.images.length - 1 : prev - 1,
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80')] opacity-10 bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/70" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-400 mb-4">
              Photo Gallery
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Our Moments
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Browse through photos from our events, programs, and community
              development initiatives across Sefwi Wiawso Constituency.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Loading & Error States */}
      {loading && (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
          <p className="animate-pulse">Bringing our moments to life...</p>
        </div>
      )}

      {error && !loading && (
        <div className="py-20 flex flex-col items-center justify-center text-center px-4">
          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 border border-red-100">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-slate-600 max-w-md">{error}</p>
          <Button
            onClick={fetchGalleries}
            variant="outline"
            className="mt-6 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            Reload Gallery
          </Button>
        </div>
      )}

      {/* Category Filters */}
      {!loading && !error && (
        <section className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-slate-500 mt-4">
              <Images className="inline h-4 w-4 mr-1" />
              {filteredItems.length}{" "}
              {filteredItems.length === 1 ? "album" : "albums"} · Click to view
              photos
            </p>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      {!loading && !error && (
        <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                onClick={() => openLightbox(item)}
                className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <Image
                    src={getImageUrl(item.cover_image)}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                  {/* Image Count Badge */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Images className="h-3 w-3" />
                    {item.images?.length || 0} photos
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                    {cleanupHtml(item.description || "")}
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </main>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 p-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Main Content */}
            <div
              className="relative w-full max-w-5xl mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {selectedItem.title}
                </h2>
                <p className="text-white/70 text-sm">
                  {selectedItem.date} • {selectedItem.location}
                </p>
                <p className="text-white/50 text-xs mt-1">
                  {currentImageIndex + 1} of {selectedItem.images.length} photos
                </p>
              </div>

              {/* Image Container */}
              <div className="relative bg-black rounded-xl overflow-hidden">
                <div className="relative h-[60vh] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: 0.3 }}
                      className="relative w-full h-full"
                    >
                      <Image
                        src={getImageUrl(
                          selectedItem.images[currentImageIndex].url,
                        )}
                        alt={selectedItem.images[currentImageIndex].caption}
                        fill
                        className="object-contain"
                        priority
                        unoptimized
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white text-center text-sm">
                    {cleanupHtml(
                      selectedItem.images[currentImageIndex].caption || "",
                    )}
                  </p>
                </div>

                {/* Navigation Arrows */}
                {selectedItem.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {selectedItem.images.length > 1 && (
                <div className="mt-4 flex justify-center gap-2 overflow-x-auto py-2">
                  {selectedItem.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentImageIndex(index);
                      }}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-emerald-500 opacity-100"
                          : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={getImageUrl(img.url)}
                        alt={img.caption}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Close Button (mobile) */}
              <div className="mt-6 text-center">
                <Button
                  variant="outline"
                  onClick={closeLightbox}
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  Close Gallery
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
