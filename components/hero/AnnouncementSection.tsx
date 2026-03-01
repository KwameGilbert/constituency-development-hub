"use client";

import { useEffect, useState } from "react";
import {
  announcementsService,
  Announcement,
} from "@/lib/services/announcements-service";
import Link from "next/link";
import SanitizedHtml from "@/components/ui/SanitizedHtml";
import { Calendar, ArrowRight } from "lucide-react";

export default function AnnouncementSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementsService.getPublicAnnouncements({
          limit: 4,
        });
        if (response.success) {
          // Filter out urgent ones if you want them ONLY in popup, but usually showing them here too is good.
          setAnnouncements(response.data.announcements);
        }
      } catch (error) {
        console.error("Failed to fetch announcements", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading || announcements.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Latest Announcements
            </h2>
            <div className="h-1 w-20 bg-indigo-600 rounded"></div>
          </div>
          <Link
            href="/announcements"
            className="hidden md:flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            View All Announcements <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex flex-col h-full"
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${
                              announcement.priority === "urgent"
                                ? "bg-red-100 text-red-700"
                                : announcement.priority === "high"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                >
                  {announcement.priority}
                </span>
                <div className="flex items-center text-gray-400 text-xs">
                  <Calendar className="w-3 h-3 mr-1" />
                  {announcement.published_at
                    ? new Date(announcement.published_at).toLocaleDateString()
                    : "Recent"}
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-3 line-clamp-2">
                {announcement.title}
              </h3>

              <SanitizedHtml
                html={announcement.content}
                className="text-gray-600 text-sm mb-4 grow line-clamp-3"
              />

              <Link
                href={
                  announcement.slug
                    ? `/announcements/${announcement.slug}`
                    : "/announcements"
                }
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center mt-auto"
              >
                Read More <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/announcements"
            className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            View All Announcements <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
