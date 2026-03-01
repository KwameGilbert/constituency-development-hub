"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { announcementsService, Announcement } from "@/lib/services/announcements-service";
import { Button } from "@/components/ui/button";
import SanitizedHtml from "@/components/ui/SanitizedHtml";
import { ArrowLeft, Calendar, Loader2, Tag } from "lucide-react";
import { format } from "date-fns";
import { getImageUrl } from "@/lib/utils";

interface AnnouncementDetailClientProps {
  slug: string;
  initialAnnouncement?: Announcement | null;
}

export default function AnnouncementDetailClient({
  slug,
  initialAnnouncement,
}: AnnouncementDetailClientProps) {
  const [announcement, setAnnouncement] = useState<Announcement | null>(
    initialAnnouncement || null,
  );
  const [loading, setLoading] = useState(!initialAnnouncement);
  const [error, setError] = useState<string | null>(initialAnnouncement ? null : null);

  useEffect(() => {
    async function fetchAnnouncement() {
      if (initialAnnouncement) return;
      if (!slug) return;

      try {
        setLoading(true);
        const response = await announcementsService.getAnnouncementBySlug(slug);
        if (response.success && response.data.announcement) {
          setAnnouncement(response.data.announcement);
        } else {
          setError("Announcement not found");
        }
      } catch {
        setError("Failed to load announcement");
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncement();
  }, [slug, initialAnnouncement]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Announcement Not Found</h1>
          <p className="text-slate-600 mb-8">
            {error || "The announcement you're looking for doesn't exist."}
          </p>
          <Link href="/announcements">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Announcements
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {announcement.image_url && (
        <div className="relative h-[320px] lg:h-[420px] bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getImageUrl(announcement.image_url)}
            alt={announcement.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
        </div>
      )}

      <main className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white rounded-2xl shadow-xl ${announcement.image_url ? "-mt-24 relative" : ""} p-6 md:p-10`}
        >
          <Link
            href="/announcements"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all announcements
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
              <Tag className="h-3.5 w-3.5" />
              {announcement.category}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                announcement.priority === "urgent"
                  ? "bg-red-100 text-red-700"
                  : announcement.priority === "high"
                    ? "bg-orange-100 text-orange-700"
                    : announcement.priority === "medium"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
              }`}
            >
              {announcement.priority}
            </span>
            {announcement.published_at && (
              <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {format(new Date(announcement.published_at), "MMMM d, yyyy")}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            {announcement.title}
          </h1>

          <SanitizedHtml
            html={announcement.content}
            className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900"
          />
        </motion.article>
      </main>
    </div>
  );
}
