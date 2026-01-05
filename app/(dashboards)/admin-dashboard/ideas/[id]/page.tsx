import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { IdeaDetailCard } from "@/components/admin-dashboard/ideas/IdeaDetailCard";
import { ideasService } from "@/lib/services/ideas-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

const MOCK_IDEAS = [
  { id: 1, title: "Install Solar Street Lights", slug: "install-solar-street-lights", description: "The market area lacks proper lighting at night.", category: "infrastructure", submitter_name: "Kwame Mensah", submitter_email: "kwame.m@email.com", submitter_contact: "+233244123456", status: "under_review" as const, votes: 45, created_at: "2025-01-02" },
  { id: 2, title: "Community Computer Training Center", slug: "community-computer-training", description: "Establish a computer training center.", category: "education", submitter_name: "Abena Osei", submitter_email: "abena.o@email.com", status: "approved" as const, votes: 78, admin_notes: "Approved for implementation.", created_at: "2024-12-15", reviewed_at: "2025-01-05" },
  { id: 3, title: "Mobile Health Clinic", slug: "mobile-health-clinic", description: "A mobile clinic for remote villages.", category: "healthcare", submitter_name: "Dr. Kofi Asante", submitter_email: "k.asante@email.com", status: "pending" as const, votes: 92, created_at: "2025-01-08" },
  { id: 4, title: "Youth Sports Tournament", slug: "youth-sports-tournament", description: "Organize annual sports tournaments.", category: "social", submitter_name: "Emmanuel Darko", submitter_email: "e.darko@email.com", status: "implemented" as const, votes: 34, admin_notes: "Successfully implemented!", created_at: "2024-11-20", reviewed_at: "2024-11-25" },
];

export default async function IdeaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let idea = null;
  let error = null;

  try {
    const response = await ideasService.getIdeaById(id);
    if (response && response.success && response.data.idea) {
      idea = response.data.idea;
    } else {
      return notFound();
    }
  } catch (e: unknown) {
    // Fall back to mock data
    idea = MOCK_IDEAS.find(i => i.id === parseInt(id));
    if (!idea) return notFound();
  }

  if (!idea) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <AdminHeader title="Idea Not Found" />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">Idea not found</p>
            <Link href="/admin-dashboard/ideas">
              <Button>Back to Ideas</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Review Idea" />
      <div className="flex-1 p-8 space-y-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard/ideas">
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{idea.title}</h1>
            <p className="text-slate-500">Submitted by {idea.submitter_name}</p>
          </div>
        </div>
        
        <IdeaDetailCard idea={idea} />
      </div>
    </div>
  );
}
