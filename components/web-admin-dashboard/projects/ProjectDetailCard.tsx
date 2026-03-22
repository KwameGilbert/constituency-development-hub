"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Star,
  Calendar,
  MapPin,
  Briefcase,
  Phone,
  User,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import SanitizedHtml from "@/components/ui/SanitizedHtml";
import { Project } from "@/lib/services/projects-service";
import Link from "next/link";
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
import { projectsService } from "@/lib/services/projects-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProjectDetailCardProps {
  project: Project;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "planning":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ongoing":
      return "bg-amber-100 text-amber-800 border-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.2)]";
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
    month: "long",
    year: "numeric",
  });
};

export function ProjectDetailCard({ project }: ProjectDetailCardProps) {
  const router = useRouter();
  const basePath = "/web-admin-dashboard/projects";

  const handleDelete = async () => {
    try {
      const response = await projectsService.deleteProject(project.id);
      if (response.success) {
        toast.success("Project deleted successfully");
        router.push(basePath);
        router.refresh();
      } else {
        toast.error("Failed to delete project");
      }
    } catch {
      toast.error("An error occurred while deleting the project");
    }
  };

  const progressPercent = project.progress_percent || 0;
  const budgetUtilization =
    project.spent && project.budget
      ? (project.spent / project.budget) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href={basePath} className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-amber-600 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
        Back to Projects
      </Link>

      {/* Header Card */}
      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Project Image */}
            <div className="lg:w-1/3 relative h-64 lg:h-auto min-h-[300px] bg-slate-100">
              {project.image ? (
                <Image
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <Briefcase size={48} className="opacity-20" />
                  <span className="text-xs font-bold uppercase tracking-widest">No Image Available</span>
                </div>
              )}
            </div>

            {/* Project Summary */}
            <div className="flex-1 p-8 lg:p-10 space-y-6 bg-white">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    {project.is_featured && (
                      <Badge
                        variant="outline"
                        className="border-amber-500 text-amber-700 bg-amber-50 font-bold"
                      >
                        <Star className="w-3 h-3 mr-1 fill-amber-500" />
                        Featured
                      </Badge>
                    )}
                  </div>

                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {project.title}
                  </h2>
                  
                  <div className="flex items-center text-slate-500 text-sm font-medium">
                    <MapPin className="w-4 h-4 mr-1.5 text-amber-500" />
                    {project.location}
                  </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Link href={`${basePath}/${project.id}/edit`} className="flex-1 sm:flex-initial">
                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild className="flex-1 sm:flex-initial">
                      <Button variant="ghost" className="w-full border-red-100 text-red-500 hover:text-red-700 hover:bg-red-50 font-bold">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Project</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete &quot;{project.title}
                          &quot;? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          className="bg-red-600 hover:bg-red-700 font-bold"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                {project.description ? (
                  <SanitizedHtml html={project.description} className="" />
                ) : (
                  <p className="italic text-slate-400">No description provided.</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Budget */}
        <Card className="lg:col-span-2 border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Progress & Budget
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 space-y-10">
            {/* Progress */}
            <div>
              <div className="flex justify-between items-end mb-3">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Current Progress
                  </span>
                  <p className="text-sm font-bold text-slate-700">Project Execution Status</p>
                </div>
                <span className="text-3xl font-black text-slate-900 tabular-nums">
                  {progressPercent}<span className="text-lg text-slate-400 ml-1">%</span>
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-linear-to-r from-amber-400 to-amber-600 h-4 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Budget</p>
                <p className="text-2xl font-black text-slate-900 tabular-nums whitespace-nowrap">
                  {formatCurrency(project.budget)}
                </p>
                <div className="h-1 w-8 bg-amber-500 rounded-full" />
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Spent</p>
                <p className="text-2xl font-black text-slate-900 tabular-nums whitespace-nowrap">
                  {project.spent
                    ? formatCurrency(project.spent)
                    : formatCurrency(0)}
                </p>
                <div className="h-1 w-8 bg-blue-500 rounded-full" />
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Remaining</p>
                <p className="text-2xl font-black text-green-600 tabular-nums whitespace-nowrap">
                  {formatCurrency(project.budget - (project.spent || 0))}
                </p>
                <div className="h-1 w-8 bg-green-500 rounded-full" />
              </div>
            </div>

            {/* Budget Utilization Progress */}
            {project.spent && (
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700">
                    Budget Utilization
                  </span>
                  <span className={`text-sm font-black tabular-nums ${
                      budgetUtilization > 100 ? "text-red-600" : "text-slate-900"
                    }`}>
                    {budgetUtilization.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner">
                  <div
                    className={`h-2 rounded-full transition-all duration-1000 ${
                      budgetUtilization > 90
                        ? "bg-red-500"
                        : budgetUtilization > 75
                          ? "bg-amber-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-tight">
                  {budgetUtilization > 100 ? "Warning: Budget Exceeded" : "Current budget usage relative to total"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Info & Details */}
        <div className="space-y-6">
          <Card className="border-slate-200/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
              <CardTitle className="text-md font-bold uppercase tracking-wider text-slate-500">Key Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Focus Sector</p>
                  <p className="font-bold text-slate-900 leading-tight">
                    {project.sector.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Project Site</p>
                  <p className="font-bold text-slate-900 leading-tight">{project.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-green-50 rounded-xl border border-green-100">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Implementation Timeline</p>
                  <div className="font-bold text-slate-900 leading-tight">
                    <p>{formatDate(project.start_date)}</p>
                    <div className="flex items-center gap-1.5 my-0.5">
                       <span className="w-2 h-px bg-slate-300"></span>
                       <span className="text-[10px] text-slate-400 uppercase font-black">to</span>
                    </div>
                    <p>{formatDate(project.end_date)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Project Gallery */}
      {project.gallery && project.gallery.length > 0 && (
        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
            <CardTitle className="text-md font-bold uppercase tracking-wider text-slate-500">Project Gallery</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {project.gallery.map((img, index) => (
                <div 
                  key={index} 
                  className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 shadow-sm group cursor-pointer"
                >
                  <Image
                    src={getImageUrl(img)}
                    alt={`Project Gallery ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold uppercase tracking-widest bg-slate-900/60 px-2 py-1 rounded">View Full</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contractor Information */}
      {(project.contractor ||
        project.contact_person ||
        project.contact_phone) && (
        <Card className="border-slate-200/60 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-4">
            <CardTitle className="text-md font-bold uppercase tracking-wider text-slate-500">Execution Team</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {project.contractor && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <Briefcase className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Assigned Contractor</p>
                    <p className="text-lg font-bold text-slate-900">
                      {project.contractor}
                    </p>
                  </div>
                </div>
              )}

              {project.contact_person && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <User className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project Manager</p>
                    <p className="text-lg font-bold text-slate-900">
                      {project.contact_person}
                    </p>
                  </div>
                </div>
              )}

              {project.contact_phone && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <Phone className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Direct Hotline</p>
                    <p className="text-lg font-bold text-amber-600 tabular-nums">
                      {project.contact_phone}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Helper for TrendingUp icon which might not be imported from lucide-react in previous step context
// but I'll add it to the import list above.
import { TrendingUp } from "lucide-react";
