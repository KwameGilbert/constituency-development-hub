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
        if (response && response.success && response.data) {
          setJobs(response.data.jobs || []);
          setError(null);
        } else {
          setError(response?.message || "Failed to load employment data");
        }
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
    <div className="flex flex-col h-full w-full bg-slate-50/50 overflow-hidden">
      <AdminHeader
        title="EmploymentHub"
        description="Vocational opportunities and labor market oversight"
        roleAbbr="MP"
      />
      <div className="flex-1 p-6 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full overflow-y-auto custom-scrollbar pb-20">
        <JobsHeader />

        {/* Loading State */}
        {loading && (
          <Card className="border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden bg-white p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl"
                >
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-64 rounded-md" />
                    <Skeleton className="h-4 w-48 rounded-md" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border border-red-200 shadow-xs rounded-2xl p-8 text-center bg-red-50/40">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-xl">⚠️</span>
            </div>
            <p className="text-red-700 text-base font-bold">{error}</p>
            <p className="text-slate-500 text-xs mt-1 font-medium">
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
