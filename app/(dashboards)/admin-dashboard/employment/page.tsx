"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { JobsHeader } from "@/components/admin-dashboard/employment/JobsHeader";
import { JobsTable } from "@/components/admin-dashboard/employment/JobsTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import axios from "axios";

interface JobPosting {
  id: number;
  title: string;
  slug: string;
  description: string;
  company?: string;
  location: string;
  job_type: "full_time" | "part_time" | "contract" | "internship";
  salary_range?: string;
  requirements?: string;
  responsibilities?: string;
  application_deadline: string;
  status: "draft" | "published" | "closed";
  category?: string;
  experience_level?: string;
  applicants_count?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

interface JobsData {
  jobs: JobPosting[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  statistics: {
    total_jobs: number;
    published_jobs: number;
    draft_jobs: number;
    closed_jobs: number;
    total_applicants: number;
    by_category: Array<{
      category: string;
      count: number;
    }>;
    by_job_type: Array<{
      job_type: string;
      count: number;
    }>;
    by_experience_level: Array<{
      experience_level: string;
      count: number;
    }>;
  };
}

export default function JobsListPage() {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [pagination, setPagination] = useState<JobsData['pagination'] | undefined>(undefined);
  const [statistics, setStatistics] = useState<JobsData['statistics'] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axios.get<JobsData>('/data/admin-employment-jobs.json');
        setJobs(response.data.jobs);
        setPagination(response.data.pagination);
        setStatistics(response.data.statistics);
        setError(null);
      } catch (err) {
        console.error('Failed to load jobs data:', err);
        setError('Failed to load jobs data');
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
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
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
            <p className="text-slate-500 mt-2">Please try refreshing the page</p>
          </Card>
        )}

        {/* Jobs Table */}
        {!loading && !error && (
          <JobsTable jobs={jobs} pagination={pagination} />
        )}
      </div>
    </div>
  );
}
