"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Send } from "lucide-react";
import { Announcement } from "@/lib/services/announcements-service";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { announcementsService } from "@/lib/services/announcements-service";
import { useRouter } from "next/navigation";

interface AnnouncementsTableProps {
  announcements: Announcement[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft": return "bg-gray-100 text-gray-800 border-gray-200";
    case "published": return "bg-green-100 text-green-800 border-green-200";
    case "archived": return "bg-slate-100 text-slate-800 border-slate-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800";
    case "high": return "bg-orange-100 text-orange-800";
    case "medium": return "bg-yellow-100 text-yellow-800";
    case "low": return "bg-blue-100 text-blue-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export function AnnouncementsTable({ announcements, pagination }: AnnouncementsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await announcementsService.deleteAnnouncement(id);
      if (response.success) {
        toast.success("Announcement deleted");
        router.refresh();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("Error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  if (!announcements || announcements.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-slate-500 text-lg">No announcements found</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Announcement</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Published</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {announcements.map((announcement) => (
                <tr key={announcement.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{announcement.title}</p>
                    <p className="text-sm text-slate-500 capitalize">{announcement.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={getStatusColor(announcement.status)}>
                      {announcement.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {announcement.published_at ? formatDate(announcement.published_at) : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin-dashboard/announcements/${announcement.id}`}>
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin-dashboard/announcements/${announcement.id}/edit`}>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-900" disabled={deletingId === announcement.id}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                            <AlertDialogDescription>
                              Delete "{announcement.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(announcement.id)} className="bg-red-600 hover:bg-red-700">
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
