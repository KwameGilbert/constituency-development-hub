"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Images, Calendar } from "lucide-react";

// Dummy gallery data for homepage preview
const galleryPreview = [
  {
    id: "1",
    title: "Youth Skills Workshop",
    date: "Dec 15, 2025",
    coverImage: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80",
    imageCount: 5,
    category: "Programs",
  },
  {
    id: "2",
    title: "Health Outreach",
    date: "Dec 10, 2025",
    coverImage: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80",
    imageCount: 4,
    category: "Events",
  },
  {
    id: "3",
    title: "Women in Agriculture",
    date: "Nov 20, 2025",
    coverImage: "https://images.unsplash.com/photo-1595508064774-5ff825a62d61?auto=format&fit=crop&w=600&q=80",
    imageCount: 6,
    category: "Community",
  },
  {
    id: "4",
    title: "School Renovation",
    date: "Nov 15, 2025",
    coverImage: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
    imageCount: 4,
    category: "Events",
  },
];

function GalleryPreview() {
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
          {galleryPreview.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300"
            >
              <Link href="/gallery">
                <div className="relative h-48 bg-slate-100">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Image Count Badge */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Images className="h-3 w-3" />
                    {item.imageCount}
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
                      {item.date}
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
