import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { IdeasHeader } from "@/components/admin-dashboard/ideas/IdeasHeader";
import { IdeasTable } from "@/components/admin-dashboard/ideas/IdeasTable";
import { ideasService } from "@/lib/services/ideas-service";

// Mock data for development
const MOCK_IDEAS = [
  {
    id: 1,
    title: "Install Solar Street Lights in Market Area",
    slug: "install-solar-street-lights",
    description: "The market area lacks proper lighting at night, making it unsafe. Solar street lights would improve security and allow evening trading.",
    category: "infrastructure",
    submitter_name: "Kwame Mensah",
    submitter_email: "kwame.m@email.com",
    submitter_contact: "+233244123456",
    status: "under_review" as const,
    votes: 45,
    created_at: "2025-01-02",
  },
  {
    id: 2,
    title: "Community Computer Training Center",
    slug: "community-computer-training",
    description: "Establish a computer training center to teach digital skills to youth and adults. Many people lack basic computer knowledge.",
    category: "education",
    submitter_name: "Abena Osei",
    submitter_email: "abena.o@email.com",
    status: "approved" as const,
    votes: 78,
    admin_notes: "Approved for implementation in Q2 2025. Budget allocated.",
    created_at: "2024-12-15",
    reviewed_at: "2025-01-05",
  },
  {
    id: 3,
    title: "Mobile Health Clinic for Remote Villages",
    slug: "mobile-health-clinic",
    description: "A mobile clinic that visits remote villages weekly would improve healthcare access for those who can't travel to the hospital.",
    category: "healthcare",
    submitter_name: "Dr. Kofi Asante",
    submitter_email: "k.asante@email.com",
    status: "pending" as const,
    votes: 92,
    created_at: "2025-01-08",
  },
  {
    id: 4,
    title: "Youth Sports Tournament",
    slug: "youth-sports-tournament",
    description: "Organize annual sports tournaments for youth to promote healthy living and community bonding.",
    category: "social",
    submitter_name: "Emmanuel Darko",
    submitter_email: "e.darko@email.com",
    status: "implemented" as const,
    votes: 34,
    admin_notes: "Successfully implemented in December 2024. Great turnout!",
    created_at: "2024-11-20",
    reviewed_at: "2024-11-25",
  },
];

export default async function IdeasListPage() {
  let ideas: any[] = [];
  let pagination: any = undefined;
  let usingMockData = false;

  try {
    const response = await ideasService.getAdminIdeas();
    if (response && response.success && response.data) {
      ideas = response.data.ideas || [];
      pagination = response.data.pagination;
    }
  } catch (e: unknown) {
    // Silently fall back to mock data
    ideas = MOCK_IDEAS;
    usingMockData = true;
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Ideas & Suggestions" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <IdeasHeader />
        
        {usingMockData && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
            <p className="font-medium">⚠️ Using mock data - Backend API not available</p>
            <p className="text-sm mt-1">Status updates will not persist until the backend is connected.</p>
          </div>
        )}
        
        <IdeasTable ideas={ideas} pagination={pagination} />
      </div>
    </div>
  );
}
