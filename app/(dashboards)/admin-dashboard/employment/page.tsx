"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { JobsHeader } from "@/components/admin-dashboard/employment/JobsHeader";
import { JobsTable } from "@/components/admin-dashboard/employment/JobsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  employmentService,
  JobPosting,
} from "@/lib/services/employment-service";

export default function JobsListPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await employmentService.getAdminJobs({ limit: 1000 });
        setJobs(response.data.jobs);
        setError(null);
      } catch (err) {
        console.error("Failed to load jobs data:", err);
        setError("Failed to load jobs data");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Employment" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <JobsHeader />

        {/* Loading State */}
        {loading && (
          <Card className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-12 text-center">
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <p className="text-slate-500 mt-2">
              Please try refreshing the page
            </p>
          </Card>
        )}

        {/* Jobs Table */}
        {!loading && !error && (
          <JobsTable jobs={jobs} />
        )}
      </div>
    </div>
  );
}
