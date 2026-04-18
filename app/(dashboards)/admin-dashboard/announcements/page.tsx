"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { AnnouncementsHeader } from "@/components/admin-dashboard/announcements/AnnouncementsHeader";
import { AnnouncementsTable } from "@/components/admin-dashboard/announcements/AnnouncementsTable";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  announcementsService,
  Announcement,
} from "@/lib/services/announcements-service";

export default function AnnouncementsListPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        const response = await announcementsService.getAdminAnnouncements({
          limit: 1000,
        });
        if (response.success) {
          setAnnouncements(response.data.announcements);
          setError(null);
        } else {
          setError(response.message || "Failed to load announcements");
        }
      } catch (err) {
        console.error("Failed to load announcements data:", err);
        setError("Failed to load announcements data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
        <AdminHeader 
          title="Announcements" 
          description="Synchronizing broadcast communication..."
          roleAbbr="MP"
        />
        <div className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>
          <Card className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <AdminHeader title="Announcements" />
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
          <AnnouncementsHeader />
          <Card className="p-12 text-center">
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <p className="text-slate-500 mt-2">
              Please try refreshing the page
            </p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <AdminHeader 
        title="Announcements" 
        description="Public communications and broadcast oversight"
        roleAbbr="MP"
      />
      <div className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        <AnnouncementsHeader />
        <AnnouncementsTable announcements={announcements} />
      </div>
    </div>
  );
}
