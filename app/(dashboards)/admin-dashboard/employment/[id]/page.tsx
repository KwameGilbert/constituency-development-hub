"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { JobDetailCard } from "@/components/admin-dashboard/employment/JobDetailCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { employmentService, JobPosting } from "@/lib/services/employment-service";

export default function JobDetailPage() {
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
          setError('Job not found');
        }
      } catch (err) {
        console.error('Failed to load job data:', err);
        setError('Failed to load job data');
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
        <AdminHeader title="Job Details" />
        <div className="flex-1 p-8 space-y-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Link href="/admin-dashboard/employment">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-96" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-36" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-38" />
                  <Skeleton className="h-4 w-42" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>

              <div className="space-y-4">
                <Skeleton className="h-6 w-44" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
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
        <AdminHeader title="Job Details" />
        <div className="flex-1 p-8 space-y-6 max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Link href="/admin-dashboard/employment">
              <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900">Job Not Found</h1>
              <p className="text-slate-500">The requested job could not be found</p>
            </div>
          </div>

          <Card className="p-12 text-center">
            <p className="text-red-600 text-lg font-medium">{error || 'Job not found'}</p>
            <p className="text-slate-500 mt-2">Please check the job ID and try again</p>
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
      <AdminHeader title="Job Details" />
      <div className="flex-1 p-8 space-y-6 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard/employment">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-slate-500">{job.company || job.location}</p>
          </div>
        </div>

        <JobDetailCard job={job} />
      </div>
    </div>
  );
}
