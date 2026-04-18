"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Tag,
  AlertCircle,
  Megaphone,
} from "lucide-react";
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
  basePath?: string;
  onPageChange?: (page: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-slate-100 text-slate-600 border-slate-200/50";
    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    case "archived":
      return "bg-slate-900 text-slate-100 border-slate-800";
    default:
      return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "bg-red-50 text-red-600 border-red-100 font-black";
    case "high":
      return "bg-amber-50 text-amber-900 border-amber-200/50 font-black";
    case "medium":
      return "bg-indigo-50 text-indigo-700 border-indigo-100 font-bold";
    case "low":
      return "bg-slate-50 text-slate-500 border-slate-100 font-medium";
    default:
      return "bg-slate-50 text-slate-400 font-medium";
  }
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function AnnouncementsTable({
  announcements,
  basePath = "/admin-dashboard/announcements",
}: AnnouncementsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(announcements.length / pageSize);
  const paginatedAnnouncements = announcements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await announcementsService.deleteAnnouncement(id);
      if (response.success) {
        toast.success("Broadcast communication terminated successfully");
        router.refresh();
      } else {
        toast.error("Process failure in termination");
      }
    } catch {
      toast.error("System synchronization error");
    } finally {
      setDeletingId(null);
    }
  };

  if (!announcements || announcements.length === 0) {
    return (
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl p-12 text-center bg-white/50 backdrop-blur-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Megaphone className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-900 font-bold text-lg tracking-tight">Zero active broadcasts</p>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Draft your first public announcement to begin engagement
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Content Profile
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Priority
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Visibility
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Deployment
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedAnnouncements.map((announcement) => (
                <tr
                  key={announcement.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex flex-col max-w-sm">
                      <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate">
                        {announcement.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 font-bold">
                        <Tag className="w-3 h-3 opacity-50" />
                        <span className="text-[10px] uppercase tracking-wider">
                          {announcement.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <Badge className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border shadow-xs ${getPriorityColor(announcement.priority)}`}>
                      {announcement.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <Badge className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border shadow-xs ${getStatusColor(announcement.status)}`}>
                      {announcement.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl w-fit">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {announcement.published_at ? formatDate(announcement.published_at) : "UNSCHEDULED"}
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`${basePath}/${announcement.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`${basePath}/${announcement.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600"
                            disabled={deletingId === announcement.id}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-slate-950">
                              Terminate Broadcast
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-500 font-medium">
                              Are you sure you want to delete &quot;{announcement.title}&quot;? All public visibility and engagement data will be lost.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel className="rounded-xl border-slate-100 font-bold text-slate-600">Retain</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(announcement.id)}
                              className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/20"
                            >
                              Confirm Deletion
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

        {/* Improved Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
             <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Showing <span className="text-slate-900">{paginatedAnnouncements.length}</span> of <span className="text-slate-900">{announcements.length}</span>
              </div>
            
            <div className="flex items-center gap-1.5">
               <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-white"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-white"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-white"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-white"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
