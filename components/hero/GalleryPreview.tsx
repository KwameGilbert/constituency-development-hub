"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Images, Calendar, Loader2, AlertCircle } from "lucide-react";
import { galleryService, Gallery } from "@/lib/services/gallery-service";

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function GalleryPreview() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await galleryService.getGalleries();
        if (response.success) {
          // Sort by date descending and take top 4
          const sorted = response.data.galleries
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            )
            .slice(0, 4);
          setGalleries(sorted);
        } else {
          setError("Failed to load gallery items.");
        }
      } catch (err) {
        console.error("Error fetching gallery preview:", err);
        setError("Could not load gallery preview.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleries();
  }, []);

  if (isLoading) {
    return (
      <section className="bg-emerald-50/50 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-600" />
          <p className="mt-2 text-slate-500">Loading moments...</p>
        </div>
      </section>
    );
  }

  if (error || galleries.length === 0) {
    // Don't show the section if no data or error (or show a simplified empty state)
    // For a homepage section, it's often better to return null or "no items" if empty.
    if (error) return null;
    // If just empty, maybe show nothing? Or a checked placeholder? return null for now.
    return null;
  }

  return (
    <section className="bg-emerald-50/50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-600">
            Photo Gallery
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            Recent Moments
          </h2>
          <div className="mt-2 h-1 w-20 bg-emerald-500" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {galleries.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Link href={`/gallery?slug=${item.slug}`}>
                <div className="relative h-48 bg-slate-100">
                  {item.cover_image ? (
                    <Image
                      src={item.cover_image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      <Images className="h-8 w-8 opacity-50" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Image Count Badge */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Images className="h-3 w-3" />
                    {item.images ? item.images.length + 1 : 1}
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <span className="text-xs font-semibold uppercase tracking-wide text-emerald-400 mb-1 block">
                      {item.category}
                    </span>
                    <h3 className="text-white font-bold text-lg line-clamp-1">
                      {item.title}
                    </h3>
                    <span className="flex items-center gap-1 text-white/70 text-xs mt-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-base font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
          >
            View full gallery
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default GalleryPreview;
