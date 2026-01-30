"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnnouncementsHeaderProps {
  basePath?: string;
}

export function AnnouncementsHeader({
  basePath = "/admin-dashboard/announcements",
}: AnnouncementsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Announcements</h1>
        <p className="text-slate-500 mt-1">
          Manage public announcements and notices
        </p>
      </div>
      <Link href={`${basePath}/new`}>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Announcement
        </Button>
      </Link>
    </div>
  );
}
