import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { JobsHeader } from "@/components/admin-dashboard/employment/JobsHeader";
import { JobsTable } from "@/components/admin-dashboard/employment/JobsTable";
import { employmentService } from "@/lib/services/employment-service";

// Mock data for development when backend is not available
const MOCK_JOBS = [
  {
    id: 1,
    title: "Community Development Officer",
    slug: "community-development-officer",
    description: "Lead community development initiatives and coordinate with local stakeholders to implement constituency projects.",
    company: "District Office",
    location: "Central Office, Accra",
    job_type: "full_time" as const,
    salary_range: "GHS 3,000 - 5,000 per month",
    requirements: "Bachelor's degree in Social Sciences, Development Studies, or related field\nMinimum 2 years experience in community development\nStrong communication and organizational skills",
    responsibilities: "Coordinate community development projects\nLiaise with local leaders and stakeholders\nPrepare project reports and documentation",
    application_deadline: "2025-02-28",
    status: "published" as const,
    category: "administration",
    experience_level: "mid",
    applicants_count: 12,
    created_at: "2025-01-01",
  },
  {
    id: 2,
    title: "Youth Engagement Coordinator",
    slug: "youth-engagement-coordinator",
    description: "Develop and implement youth programs and initiatives to engage young people in constituency activities.",
    company: "Youth Development Unit",
    location: "Community Center",
    job_type: "full_time" as const,
    salary_range: "GHS 2,500 - 4,000 per month",
    application_deadline: "2025-03-15",
    status: "published" as const,
    category: "social_services",
    experience_level: "entry",
    applicants_count: 8,
    created_at: "2025-01-05",
  },
  {
    id: 3,
    title: "Administrative Assistant - Internship",
    slug: "admin-assistant-internship",
    description: "Support administrative operations and gain experience in constituency management.",
    location: "Main Office",
    job_type: "internship" as const,
    salary_range: "GHS 800 - 1,200 per month",
    application_deadline: "2025-01-31",
    status: "published" as const,
    category: "administration",
    experience_level: "entry",
    applicants_count: 25,
    created_at: "2024-12-20",
  },
];

export default async function JobsListPage() {
  let jobs: any[] = [];
  let pagination: any = undefined;
  let usingMockData = false;

  try {
    const response = await employmentService.getAdminJobs();
    if (response && response.success && response.data) {
      jobs = response.data.jobs || [];
      pagination = response.data.pagination;
    }
  } catch (e: unknown) {
    // Silently fall back to mock data when API is unavailable
    jobs = MOCK_JOBS;
    usingMockData = true;
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Employment" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <JobsHeader />
        
        {usingMockData && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <p className="font-medium">⚠️ Using mock data - Backend API not available</p>
            <p className="text-sm mt-1">Create/edit/delete operations will not work until the backend is connected.</p>
          </div>
        )}
        
        <JobsTable jobs={jobs} pagination={pagination} />
      </div>
    </div>
  );
}
