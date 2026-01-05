import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { AnnouncementsHeader } from "@/components/admin-dashboard/announcements/AnnouncementsHeader";
import { AnnouncementsTable } from "@/components/admin-dashboard/announcements/AnnouncementsTable";
import { announcementsService } from "@/lib/services/announcements-service";

const MOCK_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Community Town Hall Meeting - January 2025",
    slug: "town-hall-jan-2025",
    content: "Join us for our quarterly town hall meeting to discuss constituency developments and priorities for Q1 2025.",
    category: "events",
    priority: "high" as const,
    status: "published" as const,
    publish_date: "2025-01-10",
    expiry_date: "2025-01-25",
    created_at: "2025-01-05",
    published_at: "2025-01-10",
  },
  {
    id: 2,
    title: "Road Closure Notice - Main Street",
    slug: "road-closure-main-street",
    content: "Main Street will be temporarily closed for rehabilitation works from February 1-15, 2025. Alternative routes available.",
    category: "infrastructure",
    priority: "urgent" as const,
    status: "published" as const,
    publish_date: "2025-01-20",
    created_at: "2025-01-18",
    published_at: "2025-01-20",
  },
  {
    id: 3,
    title: "Free Health Screening Program",
    slug: "health-screening-program",
    content: "Free health screening for all constituents aged 40 and above. Registration now open.",
    category: "health",
    priority: "medium" as const,
    status: "draft" as const,
    created_at: "2025-01-12",
  },
];

export default async function AnnouncementsListPage() {
  let announcements: any[] = [];
  let pagination: any = undefined;
  let usingMockData = false;

  try {
    const response = await announcementsService.getAdminAnnouncements();
    if (response && response.success && response.data) {
      announcements = response.data.announcements || [];
      pagination = response.data.pagination;
    }
  } catch (e: unknown) {
    announcements = MOCK_ANNOUNCEMENTS;
    usingMockData = true;
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Announcements" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <AnnouncementsHeader />
        {usingMockData && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <p className="font-medium">⚠️ Using mock data - Backend API not available</p>
          </div>
        )}
        <AnnouncementsTable announcements={announcements} pagination={pagination} />
      </div>
    </div>
  );
}
