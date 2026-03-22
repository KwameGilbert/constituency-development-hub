"use client";

import { motion } from "framer-motion";
import { sanitizeHtml } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  description?: string;
  backgroundImage?: string;
}

export default function PageHero({
  title,
  description,
  backgroundImage = "/images/hero-default.jpg", // Fallback
}: PageHeroProps) {
  return (
    <section className="relative h-[100px] md:h-[400px] overflow-hidden bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {backgroundImage && (
          <div className="relative w-full h-full">
            {/* Using a simple div with background if Image fails or for simple color fallback */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 via-black/60 to-black/30" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="px-5 py-2 inline-block rounded-full bg-amber-400/10 backdrop-blur-sm border border-amber-400/20 mb-4">
            <span className="text-amber-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
              Constituency Hub
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-3xl leading-tight">
            {title}
          </h1>

          {description && (
            <p
              className="text-lg text-gray-200 max-w-2xl leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtml(description || ""),
              }}
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}
