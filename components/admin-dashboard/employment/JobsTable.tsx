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
  Users,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Calendar,
  Building,
  Briefcase,
} from "lucide-react";
import { JobPosting } from "@/lib/services/employment-service";
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
import { employmentService } from "@/lib/services/employment-service";
import { useRouter } from "next/navigation";

interface JobsTableProps {
  jobs: JobPosting[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  onPageChange?: (page: number) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-slate-100 text-slate-600 border-slate-200/50";
    case "published":
      return "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold";
    case "closed":
      return "bg-red-50 text-red-700 border-red-100 font-bold";
    default:
      return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

const getJobTypeColor = (type: string) => {
  switch (type) {
    case "full_time":
      return "bg-indigo-50 text-indigo-700 border-indigo-100 font-bold";
    case "part_time":
      return "bg-amber-50 text-amber-900 border-amber-200/50 font-bold";
    case "contract":
      return "bg-slate-900 text-slate-100 border-slate-800 font-bold";
    case "internship":
      return "bg-emerald-50 text-emerald-800 border-emerald-100 font-bold";
    default:
      return "bg-slate-50 text-slate-700 font-medium";
  }
};

const formatJobType = (type: string) => {
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const isDeadlinePassed = (deadline: string) => {
  return new Date(deadline) < new Date();
};

export function JobsTable({ jobs }: JobsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(jobs.length / pageSize);
  const paginatedJobs = jobs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await employmentService.deleteJob(id);
      if (response.success) {
        toast.success("Job posting terminated successfully");
        router.refresh();
      } else {
        toast.error("Failed to deactivate position");
      }
    } catch {
      toast.error("System synchronization failed");
    } finally {
      setDeletingId(null);
    }
  };

  if (!jobs || jobs.length === 0) {
    return (
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl p-12 text-center bg-white/50 backdrop-blur-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-900 font-bold text-lg tracking-tight">No active job postings</p>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Start by listing a new vocational opportunity
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
                  Position Profile
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Organization
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Engagement
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Deadline
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Applicants
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedJobs.map((job) => {
                const deadlinePassed = isDeadlinePassed(job.application_deadline);
                return (
                  <tr
                    key={job.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col max-w-xs">
                        <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                          {job.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-400 font-bold">
                          <MapPin className="w-3 h-3 opacity-50" />
                          <span className="text-[10px] uppercase tracking-wider">{job.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 transition-colors">
                           <Building className="w-4 h-4" />
                         </div>
                         <span className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                          {job.company || "Constituency Hub"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border shadow-xs ${getJobTypeColor(job.job_type)}`}>
                        {formatJobType(job.job_type)}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border shadow-xs ${getStatusColor(job.status)}`}>
                        {job.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[10px] font-bold bg-slate-50 px-3 py-1.5 rounded-xl w-fit">
                        <Calendar className={`w-3.5 h-3.5 ${deadlinePassed ? "text-red-500" : "text-slate-400"}`} />
                        <span className={deadlinePassed ? "text-red-600" : "text-slate-600"}>
                          {formatDate(job.application_deadline)}
                        </span>
                        {deadlinePassed && <span className="ml-1 text-[8px] bg-red-100 text-red-700 px-1 rounded-sm uppercase">EXP</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl w-fit group-hover:bg-amber-50 transition-colors">
                        <Users className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500" />
                        <span className="text-xs font-black text-slate-900">{job.applicants_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin-dashboard/employment/${job.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin-dashboard/employment/${job.id}/edit`}>
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
                              disabled={deletingId === job.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold text-slate-950">
                                Terminate Position
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500 font-medium">
                                Are you sure you want to delete &quot;{job.title}&quot;? All applicant data and interview schedules will be permanently revoked.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                              <AlertDialogCancel className="rounded-xl border-slate-100 font-bold text-slate-600">Retain</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(job.id)}
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Improved Pagination Footer */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
             <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Showing <span className="text-slate-900">{paginatedJobs.length}</span> of <span className="text-slate-900">{jobs.length}</span>
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
