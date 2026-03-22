"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
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
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ongoing":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "on_hold":
      return "bg-slate-100 text-slate-800 border-slate-200";
    default:
      return "bg-slate-100 text-slate-800 border-slate-200";
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
    } catch {
      toast.error("An error occurred while deleting the project");
    } finally {
      setDeletingId(null);
    }
  };

  if (!projects || projects.length === 0) {
    return (
      <Card className="p-12 text-center border-slate-200/60 shadow-sm">
        <p className="text-slate-500 text-lg font-medium">No projects found</p>
        <p className="text-slate-400 text-sm mt-2">
          Create your first project to get started
        </p>
      </Card>
    );
  }

  const basePath = "/web-admin-dashboard/projects";

  return (
    <div className="space-y-4">
      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-3">
        {paginatedProjects.map((project) => (
          <Card key={project.id} className="p-4 border-slate-200/60 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="font-bold text-slate-900">{project.title}</p>
                <p className="text-sm text-slate-500">{project.location}</p>

                <div className="mt-3 flex items-center gap-2">
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  {project.progress_percent !== undefined && (
                    <div className="ml-2 flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-amber-500 h-2 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                          style={{ width: `${project.progress_percent}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-slate-600">
                        {project.progress_percent}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-sm text-slate-700">
                  <p className="font-bold text-slate-900">
                    {formatCurrency(project.budget)}
                  </p>
                  {project.spent !== undefined && (
                    <p className="text-xs text-slate-500 font-medium">
                      Spent: {formatCurrency(project.spent)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-slate-500 text-right font-medium">
                  <p>{formatDate(project.start_date)}</p>
                  <p className="text-slate-400">
                    to {formatDate(project.end_date)}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Link href={`${basePath}/${project.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:text-amber-600 hover:bg-amber-50"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href={`${basePath}/${project.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Desktop/tablet: show table on md+ */}
      <div className="hidden md:block">
        <Card className="overflow-hidden border-slate-200/60 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b border-slate-200/60">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Sector
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Timeline
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100">
                {paginatedProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                          {project.title}
                        </p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px] font-medium">
                          {project.location}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-slate-700">
                        {project.sector.name}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      {project.progress_percent !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 w-20">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all shadow-[0_0_8px_rgba(245,158,11,0.4)]"
                              style={{ width: `${project.progress_percent}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-600">
                            {project.progress_percent}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(project.budget)}
                        </p>
                        {project.spent !== undefined && (
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            Spent: {formatCurrency(project.spent)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs font-medium">
                      <div className="text-slate-700">
                        <p>{formatDate(project.start_date)}</p>
                        <p className="text-slate-400">
                          to {formatDate(project.end_date)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`${basePath}/${project.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`${basePath}/${project.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                              disabled={deletingId === project.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Delete Project
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete &quot;{project.title}
                                &quot;? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
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

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm border border-slate-200/60">
          <div className="text-sm text-slate-500 font-medium">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-900">
              {Math.min(currentPage * pageSize, projects.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900">
              {projects.length}
            </span>{" "}
            projects
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Rows:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8 bg-white/50 border-slate-200/60">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-200/60"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-200/60"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="h-8 px-3 flex items-center justify-center bg-amber-50 text-amber-700 text-xs font-bold rounded-md border border-amber-100">
                {currentPage} / {totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-200/60"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-200/60"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
