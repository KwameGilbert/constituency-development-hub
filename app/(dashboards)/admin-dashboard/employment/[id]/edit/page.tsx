"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { NewJobForm } from "@/components/admin-dashboard/employment/JobForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import {
  employmentService,
  JobPosting,
} from "@/lib/services/employment-service";

export default function EditJobPage() {
  const params = useParams();
  const id = params.id as string;

  const [job, setJob] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await employmentService.getJobById(id);
        if (response.success && response.data.job) {
          setJob(response.data.job);
          setError(null);
        } else {
          setError("Job not found");
        }
      } catch (err) {
        console.error("Failed to load job data:", err);
        setError("Failed to load job data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJob();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <AdminHeader title="Edit Job Posting" />
        <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Link href="/admin-dashboard/employment">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="space-y-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-5 w-26" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-5 w-30" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-32 w-full" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-32 w-full" />
              </div>

              <div className="space-y-4">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-32 w-full" />
              </div>

              <div className="flex justify-end space-x-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <AdminHeader title="Edit Job Posting" />
        <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Link href="/admin-dashboard/employment">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Job Not Found
              </h1>
              <p className="text-slate-500">
                The requested job could not be found
              </p>
            </div>
          </div>

          <Card className="p-12 text-center">
            <p className="text-red-600 text-lg font-medium">
              {error || "Job not found"}
            </p>
            <p className="text-slate-500 mt-2">
              Please check the job ID and try again
            </p>
            <div className="mt-6">
              <Link href="/admin-dashboard/employment">
                <Button>Back to Jobs</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Edit Job Posting" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href={`/admin-dashboard/employment/${job.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Edit Job Posting
            </h1>
            <p className="text-slate-500">{job.title}</p>
          </div>
        </div>

        <NewJobForm job={job} />
      </div>
    </div>
  );
}
