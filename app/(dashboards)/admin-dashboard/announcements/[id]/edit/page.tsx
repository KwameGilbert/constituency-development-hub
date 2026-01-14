import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { NewAnnouncementForm } from "@/components/admin-dashboard/announcements/AnnouncementForm";
import { announcementsService } from "@/lib/services/announcements-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

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
    console.error("Failed to fetch announcement:", e);
    return notFound();
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
