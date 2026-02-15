"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Megaphone, Calendar, Tag, AlertCircle } from "lucide-react";

import {
  announcementsService,
  Announcement,
} from "@/lib/services/announcements-service";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/lib/utils";
import Image from "next/image";
import SanitizedHtml from "@/components/ui/SanitizedHtml";

export default function AnnouncementsClient() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await announcementsService.getPublicAnnouncements();
      if (response.success) {
        setAnnouncements(response.data.announcements);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 hover:bg-red-600";
      case "high":
        return "bg-orange-500 hover:bg-orange-600";
      case "medium":
        return "bg-blue-500 hover:bg-blue-600";
      case "low":
        return "bg-gray-500 hover:bg-gray-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 w-full bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        {/* Background gradients without image */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/70" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-amber-400 mb-4">
              Community Updates
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Latest Announcements
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Stay informed about important updates, news, and events in our community.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
              <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
              <h3 className="text-lg font-semibold text-red-700">
                Unable to load announcements
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={fetchAnnouncements}
                variant="outline"
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
              <Megaphone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-xl font-medium text-gray-900">
                No announcements yet
              </h3>
              <p className="text-gray-500">Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {announcements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className="overflow-hidden hover:shadow-md transition-all duration-300 border-l-4"
                    style={{
                      borderLeftColor:
                        announcement.priority === "urgent"
                          ? "#ef4444"
                          : announcement.priority === "high"
                            ? "#f97316"
                            : announcement.priority === "medium"
                              ? "#3b82f6"
                              : "#6b7280",
                    }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {announcement.image_url && (
                        <div className="w-full md:w-64 h-48 md:h-auto relative shrink-0 bg-gray-100">
                          <Image
                            src={getImageUrl(announcement.image_url)}
                            alt={announcement.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-6">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            <Tag className="h-3 w-3" />
                            {announcement.category}
                          </Badge>
                          <Badge
                            className={`${getPriorityColor(announcement.priority)} text-white border-0`}
                          >
                            {announcement.priority.toUpperCase()}
                          </Badge>
                          {announcement.published_at && (
                            <span className="text-sm text-gray-500 flex items-center gap-1 ml-auto">
                              <Calendar className="h-3.5 w-3.5" />
                              {format(
                                new Date(announcement.published_at),
                                "MMM d, yyyy",
                              )}
                            </span>
                          )}
                        </div>

                        <CardTitle className="text-xl md:text-2xl mb-2 text-gray-900">
                          {announcement.title}
                        </CardTitle>

                        <div className="prose prose-sm max-w-none text-gray-600 line-clamp-3 mb-4">
                          <SanitizedHtml html={announcement.content} />
                        </div>

                        <div className="flex justify-end">
                          {/* Can add 'Read More' functionality later if we have single pages */}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
