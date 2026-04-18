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
        setError("Process failure in job data synchronization");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <AdminHeader 
        title="EmploymentHub" 
        description="Vocational opportunities and labor market oversight"
        roleAbbr="MP"
      />
      <div className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        <JobsHeader />

        {/* Loading State */}
        {loading && (
          <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm p-6">
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-5 bg-white border border-slate-50 rounded-2xl shadow-sm"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-64 rounded-lg" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                  </div>
                  <div className="flex gap-3">
                    <Skeleton className="h-7 w-20 rounded-xl" />
                    <Skeleton className="h-7 w-24 rounded-xl" />
                    <Skeleton className="h-10 w-28 rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl p-12 text-center bg-white/50 backdrop-blur-sm">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
               <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-500 text-lg font-bold">{error}</p>
            <p className="text-slate-500 mt-1 font-medium italic">
              Please verify your system credentials and refresh
            </p>
          </Card>
        )}

        {/* Jobs Table */}
        {!loading && !error && <JobsTable jobs={jobs} />}
      </div>
    </div>
  );
}
