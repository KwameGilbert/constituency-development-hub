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
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "on_hold":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
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

  const handleDelete = async () => {
    try {
      const response = await projectsService.deleteProject(project.id);
      if (response.success) {
        toast.success("Project deleted successfully");
        router.push("/admin-dashboard/projects");
        router.refresh();
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
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
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6 px-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getStatusColor(project.status)}>
                  {project.status.replace("_", " ").toUpperCase()}
                </Badge>
                {project.is_featured && (
                  <Badge
                    variant="outline"
                    className="border-yellow-500 text-yellow-700"
                  >
                    <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                    Featured
                  </Badge>
                )}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {project.title}
              </h2>

              {project.image && (
                <div className="relative w-full h-72 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={getImageUrl(project.image)}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              <div className="text-slate-700 leading-relaxed prose prose-sm max-w-none">
                {project.description ? (
                  <SanitizedHtml html={project.description} className="" />
                ) : null}
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin-dashboard/projects/${project.id}/edit`}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
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
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress & Budget */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress & Budget</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">
                  Project Progress
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {progressPercent}%
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-red-500 to-red-600 h-4 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Budget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 mb-1">Total Budget</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(project.budget)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-sm text-purple-600 mb-1">Amount Spent</p>
                <p className="text-2xl font-bold text-purple-900">
                  {project.spent
                    ? formatCurrency(project.spent)
                    : formatCurrency(0)}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 mb-1">Remaining</p>
                <p className="text-2xl font-bold text-green-900">
                  {formatCurrency(project.budget - (project.spent || 0))}
                </p>
              </div>
            </div>

            {/* Budget Utilization */}
            {project.spent && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    Budget Utilization
                  </span>
                  <span className="text-sm font-bold text-slate-900">
                    {budgetUtilization.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      budgetUtilization > 90
                        ? "bg-red-500"
                        : budgetUtilization > 75
                          ? "bg-yellow-500"
                          : "bg-green-500"
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Briefcase className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Sector</p>
                <p className="font-medium text-slate-900">
                  {project.sector.name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Location</p>
                <p className="font-medium text-slate-900">{project.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Duration</p>
                <p className="font-medium text-slate-900">
                  {formatDate(project.start_date)}
                </p>
                <p className="text-sm text-slate-600">
                  to {formatDate(project.end_date)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contractor Information */}
      {(project.contractor ||
        project.contact_person ||
        project.contact_phone) && (
        <Card>
          <CardHeader>
            <CardTitle>Contractor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.contractor && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Briefcase className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Contractor</p>
                    <p className="font-medium text-slate-900">
                      {project.contractor}
                    </p>
                  </div>
                </div>
              )}

              {project.contact_person && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Contact Person</p>
                    <p className="font-medium text-slate-900">
                      {project.contact_person}
                    </p>
                  </div>
                </div>
              )}

              {project.contact_phone && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Phone className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="font-medium text-slate-900">
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
