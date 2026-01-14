"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Calendar, MapPin, Briefcase, DollarSign, Users } from "lucide-react";
import { JobPosting, JobApplicant } from "@/lib/services/employment-service";
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
import { employmentService } from "@/lib/services/employment-service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

interface JobDetailCardProps {
  job: JobPosting;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "published":
      return "bg-green-100 text-green-800 border-green-200";
    case "closed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getJobTypeColor = (type: string) => {
  switch (type) {
    case "full_time":
      return "bg-blue-100 text-blue-800";
    case "part_time":
      return "bg-purple-100 text-purple-800";
    case "contract":
      return "bg-yellow-100 text-yellow-800";
    case "internship":
      return "bg-pink-100 text-pink-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatJobType = (type: string) => {
  return type.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

export function JobDetailCard({ job }: JobDetailCardProps) {
  const router = useRouter();
  const [applicants, setApplicants] = useState<JobApplicant[]>([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  useEffect(() => {
    if (job.applicants_count && job.applicants_count > 0) {
      loadApplicants();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.id]);

  const loadApplicants = async () => {
    setLoadingApplicants(true);
    try {
      const response = await employmentService.getJobApplicants(job.id);
      if (response.success) {
        setApplicants(response.data.applicants || []);
      }
    } catch (error) {
      console.error("Failed to load applicants:", error);
      toast.error("Applicants feature coming soon");
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await employmentService.deleteJob(job.id);
      if (response.success) {
        toast.success("Job deleted successfully");
        router.push("/admin-dashboard/employment");
        router.refresh();
      } else {
        toast.error("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("An error occurred while deleting the job");
    }
  };

  const deadlinePassed = new Date(job.application_deadline) < new Date();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <Badge className={getStatusColor(job.status)}>
                  {job.status.toUpperCase()}
                </Badge>
                <Badge className={getJobTypeColor(job.job_type)}>
                  {formatJobType(job.job_type)}
                </Badge>
                {job.category && (
                  <Badge variant="outline">
                    {job.category.replace("_", " ").toUpperCase()}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{job.title}</h2>
              {job.company && (
                <p className="text-lg text-slate-600 mb-2">{job.company}</p>
              )}
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin-dashboard/employment/${job.id}/edit`}>
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
                    <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete &quot;{job.title}&quot;? This action cannot be undone and will also remove all applicant data.
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
        {/* Job Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Location</p>
                  <p className="font-medium text-slate-900">{job.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Application Deadline</p>
                  <p className={`font-medium ${deadlinePassed ? 'text-red-600' : 'text-slate-900'}`}>
                    {formatDate(job.application_deadline)}
                  </p>
                  {deadlinePassed && (
                    <p className="text-xs text-red-500">Expired</p>
                  )}
                </div>
              </div>

              {job.salary_range && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Salary Range</p>
                    <p className="font-medium text-slate-900">{job.salary_range}</p>
                  </div>
                </div>
              )}

              {job.experience_level && (
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Briefcase className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Experience Level</p>
                    <p className="font-medium text-slate-900">
                      {job.experience_level.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Responsibilities */}
            {job.responsibilities && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Key Responsibilities</h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.responsibilities}</p>
                </div>
              </>
            )}

            {/* Requirements */}
            {job.requirements && (
              <>
                <Separator />
                <div>
                  <h4 className="font-semibold text-slate-900 mb-2">Requirements & Qualifications</h4>
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Sidebar - Applicants Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-6 bg-slate-50 rounded-lg">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-2" />
              <p className="text-3xl font-bold text-slate-900">{job.applicants_count || 0}</p>
              <p className="text-sm text-slate-500">Total Applications</p>
            </div>

            {job.applicants_count && job.applicants_count > 0 && (
              <div className="mt-4">
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={loadApplicants}
                  disabled={loadingApplicants}
                >
                  {loadingApplicants ? "Loading..." : "View All Applicants"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Applicants List (if loaded) */}
      {applicants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Applicant List</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applicants.map((applicant) => (
                <div key={applicant.id} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-slate-900">{applicant.name}</p>
                      <p className="text-sm text-slate-500">{applicant.email}</p>
                      <p className="text-sm text-slate-500">{applicant.phone}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{applicant.status}</Badge>
                      <p className="text-xs text-slate-400 mt-1">
                        Applied {formatDate(applicant.applied_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
