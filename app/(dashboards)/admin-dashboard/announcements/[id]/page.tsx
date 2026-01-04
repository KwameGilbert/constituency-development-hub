import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { announcementsService } from "@/lib/services/announcements-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: "Community Town Hall Meeting", content: "Join us for our quarterly town hall meeting...", category: "events", priority: "high" as const, status: "published" as const, publish_date: "2025-01-10", expiry_date: "2025-01-25", created_at: "2025-01-05" },
  { id: 2, title: "Road Closure Notice", content: "Main Street will be temporarily closed...", category: "infrastructure", priority: "urgent" as const, status: "published" as const, publish_date: "2025-01-20", created_at: "2025-01-18" },
  { id: 3, title: "Health Screening Program", content: "Free health screening for all constituents...", category: "health", priority: "medium" as const, status: "draft" as const, created_at: "2025-01-12" },
];

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
      <AdminHeader title="Announcement Details" />
      <div className="flex-1 p-8 space-y-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard/announcements">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{announcement.title}</h1>
          </div>
          <Link href={`/admin-dashboard/announcements/${announcement.id}/edit`}>
            <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge>{announcement.status}</Badge>
                <Badge>{announcement.priority}</Badge>
                <Badge variant="outline">{announcement.category}</Badge>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap">{announcement.content}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
