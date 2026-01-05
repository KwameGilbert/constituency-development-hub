import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { NewAnnouncementForm } from "@/components/admin-dashboard/announcements/AnnouncementForm";
import { announcementsService } from "@/lib/services/announcements-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

const MOCK_ANNOUNCEMENTS = [
  { id: 1, slug: "community-town-hall-meeting", title: "Community Town Hall Meeting", content: "Join us for our quarterly town hall meeting...", category: "events", priority: "high" as const, status: "published" as const, publish_date: "2025-01-10", expiry_date: "2025-01-25", created_at: "2025-01-05" },
  { id: 2, slug: "road-closure-notice", title: "Road Closure Notice", content: "Main Street will be temporarily closed...", category: "infrastructure", priority: "urgent" as const, status: "published" as const, publish_date: "2025-01-20", created_at: "2025-01-18" },
  { id: 3, slug: "health-screening-program", title: "Health Screening Program", content: "Free health screening for all constituents...", category: "health", priority: "medium" as const, status: "draft" as const, created_at: "2025-01-12" },
];

export default async function EditAnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let announcement = null;

  try {
    const response = await announcementsService.getAnnouncementById(id);
    if (response && response.success && response.data.announcement) {
      announcement = response.data.announcement;
    } else {
      return notFound();
    }
  } catch (e: unknown) {
    announcement = MOCK_ANNOUNCEMENTS.find(a => a.id === parseInt(id));
    if (!announcement) return notFound();
  }

  if (!announcement) return notFound();

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Edit Announcement" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href={`/admin-dashboard/announcements/${announcement.id}`}>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Announcement</h1>
            <p className="text-slate-500">{announcement.title}</p>
          </div>
        </div>
        <NewAnnouncementForm announcement={announcement} />
      </div>
    </div>
  );
}
