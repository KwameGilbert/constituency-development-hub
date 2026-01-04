import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { JobDetailCard } from "@/components/admin-dashboard/employment/JobDetailCard";
import { employmentService } from "@/lib/services/employment-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

const MOCK_JOBS = [
  {
    id: 1,
    slug: "community-development-officer",
    title: "Community Development Officer",
    description: "We are seeking a passionate Community Development Officer to coordinate and implement development programs within the constituency. The ideal candidate will work closely with community leaders, stakeholders, and local organizations to identify needs and deliver impactful projects.",
    company: "Constituency Development Office",
    location: "Constituency Office, Main District",
    job_type: "full_time" as const,
    salary_range: "GHS 3,500 - 5,000 per month",
    requirements: "• Bachelor's degree in Social Sciences, Community Development, or related field\n• Minimum 2 years experience in community development or social work\n• Excellent communication and interpersonal skills\n• Proficiency in Microsoft Office Suite\n• Valid driver's license preferred",
    responsibilities: "• Coordinate community development programs and initiatives\n• Conduct needs assessments and prepare project proposals\n• Liaise with community leaders and stakeholders\n• Monitor and evaluate project implementation\n• Prepare regular reports on program activities",
    application_deadline: "2025-02-15",
    status: "published" as const,
    category: "Community Development",
    experience_level: "Mid-level",
    applicants_count: 24,
    created_at: "2025-01-01",
    published_at: "2025-01-05",
  },
  {
    id: 2,
    slug: "youth-coordinator",
    title: "Youth Programs Coordinator",
    description: "Join our team as a Youth Programs Coordinator to design and implement programs that empower young people in our constituency. This role involves organizing skills training, mentorship programs, and youth engagement activities.",
    location: "Youth Center, Central District",
    job_type: "contract" as const,
    salary_range: "GHS 2,800 - 4,000 per month",
    requirements: "• Degree in Youth Development, Education, or related field\n• Experience working with youth programs\n• Strong organizational and leadership skills\n• Creative and innovative mindset\n• Good computer skills",
    responsibilities: "• Develop and implement youth programs\n• Organize skills training and workshops\n• Coordinate mentorship initiatives\n• Engage with youth groups and organizations\n• Track program outcomes and prepare reports",
    application_deadline: "2025-02-20",
    status: "published" as const,
    category: "Youth Development",
    experience_level: "Entry to Mid-level",
    applicants_count: 18,
    created_at: "2025-01-03",
    published_at: "2025-01-08",
  },
  {
    id: 3,
    slug: "administrative-assistant",
    title: "Administrative Assistant",
    description: "We are looking for a detail-oriented Administrative Assistant to support the daily operations of our constituency office. The role involves managing schedules, handling correspondence, and providing general administrative support.",
    company: "Constituency Office",
    location: "Main Office, District Center",
    job_type: "full_time" as const,
    salary_range: "GHS 2,000 - 3,200 per month",
    requirements: "• Diploma or Certificate in Secretarial Studies, Administration, or related field\n• Minimum 1 year office experience\n• Excellent typing and computer skills\n• Strong organizational abilities\n• Professional communication skills",
    responsibilities: "• Manage office schedules and appointments\n• Handle incoming calls and correspondence\n• Maintain filing systems and records\n• Assist with event coordination\n• Provide general administrative support",
    application_deadline: "2025-02-10",
    status: "published" as const,
    category: "Administration",
    experience_level: "Entry-level",
    applicants_count: 35,
    created_at: "2025-01-02",
    published_at: "2025-01-06",
  },
];

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let job = null;

  try {
    const response = await employmentService.getJobById(id);
    if (response && response.success && response.data.job) {
      job = response.data.job;
    } else {
      return notFound();
    }
  } catch {
    // Use mock data as fallback
    job = MOCK_JOBS.find(j => j.id === parseInt(id));
    if (!job) return notFound();
  }

  if (!job) return notFound();

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
