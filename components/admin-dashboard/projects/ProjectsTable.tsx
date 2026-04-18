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
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  Calendar,
  Wallet,
  Activity,
} from "lucide-react";
import { Project } from "@/lib/services/projects-service";
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
import { projectsService } from "@/lib/services/projects-service";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectsTableProps {
  projects: Project[];
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
    case "planning":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    case "ongoing":
      return "bg-amber-50 text-amber-900 border-amber-200/50";
    case "completed":
      return "bg-emerald-50 text-emerald-800 border-emerald-100";
    case "on_hold":
      return "bg-slate-100 text-slate-600 border-slate-200";
    default:
      return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

const formatCurrency = (amount: number) => {
  return `₵${amount.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function ProjectsTable({ projects }: ProjectsTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(projects.length / pageSize);
  const paginatedProjects = projects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await projectsService.deleteProject(id);
      if (response.success) {
        toast.success("Project deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("An error occurred while deleting the project");
    } finally {
      setDeletingId(null);
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl p-12 text-center bg-white/50 backdrop-blur-sm">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8 text-slate-300" />
        </div>
        <p className="text-slate-900 font-bold text-lg tracking-tight">No active projects</p>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Start by launching a new development project
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-4">
        {paginatedProjects.map((project) => (
          <Card key={project.id} className="border-none shadow-md shadow-slate-200/40 rounded-2xl p-5 bg-white group hover:shadow-lg transition-all">
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight transition-colors group-hover:text-amber-600">
                    {project.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-slate-500 font-medium">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] uppercase tracking-wider">{project.location}</span>
                  </div>
                </div>
                <Badge className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border shadow-xs ${getStatusColor(project.status)}`}>
                  {project.status.replace("_", " ")}
                </Badge>
              </div>

              {project.progress_percent !== undefined && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    <span>Master Progress</span>
                    <span className="text-slate-900">{project.progress_percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-amber-500 h-2 rounded-full shadow-sm shadow-amber-500/50"
                      style={{ width: `${project.progress_percent}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Budget</p>
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Timeline</p>
                  <p className="text-xs font-semibold text-slate-600 truncate">{formatDate(project.start_date)} - {formatDate(project.end_date)}</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Link href={`/admin-dashboard/projects/${project.id}`}>
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href={`/admin-dashboard/projects/${project.id}/edit`}>
                  <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop/tablet: show table on md+ */}
      <div className="hidden md:block">
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Project Detail
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Department
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Execution
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Investment
                  </th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Timeline
                  </th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex flex-col max-w-sm">
                        <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                          {project.title}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5 text-slate-500 font-medium">
                          <MapPin className="w-3 h-3 opacity-50" />
                          <span className="text-[10px] uppercase tracking-wider">
                            {project.location}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-amber-500 transition-colors" />
                         <span className="text-xs font-bold text-slate-700 tracking-tight">
                          {project.sector.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border shadow-xs ${getStatusColor(project.status)}`}>
                        {project.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      {project.progress_percent !== undefined ? (
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5 min-w-[100px] overflow-hidden">
                            <div
                              className="bg-amber-500 h-1.5 rounded-full shadow-xs"
                              style={{ width: `${project.progress_percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-900">
                            {project.progress_percent}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initiating</span>
                      )}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900 leading-none">
                          {formatCurrency(project.budget)}
                        </span>
                        {project.spent !== undefined && (
                          <span className="text-[10px] text-slate-400 font-bold mt-1">
                            Utilized: {formatCurrency(project.spent)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl w-fit">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatDate(project.end_date)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link href={`/admin-dashboard/projects/${project.id}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link
                          href={`/admin-dashboard/projects/${project.id}/edit`}
                        >
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
                              disabled={deletingId === project.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold text-slate-950">
                                Confirm Deletion
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-slate-500 font-medium">
                                Are you sure you want to delete `{project.title}
                                `? This action cannot be revoked and all investment data will be lost.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                              <AlertDialogCancel className="rounded-xl border-slate-100 font-bold text-slate-600">Withdraw</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project.id)}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-lg shadow-red-600/20"
                              >
                                Delete Project
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

          {/* Table Footer / Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Showing <span className="text-slate-900">{paginatedProjects.length}</span> of <span className="text-slate-900">{projects.length}</span>
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
        </Card>
      </div>
    </div>
  );
}
