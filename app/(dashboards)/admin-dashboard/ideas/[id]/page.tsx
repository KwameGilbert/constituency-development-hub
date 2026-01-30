"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { IdeaDetailCard } from "@/components/admin-dashboard/ideas/IdeaDetailCard";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useParams } from "next/navigation";
import { ideasService, Idea } from "@/lib/services/ideas-service";

export default function IdeaDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdea = async () => {
      try {
        setLoading(true);
        const response = await ideasService.getIdeaById(id);
        if (response.success && response.data.idea) {
          setIdea(response.data.idea);
          setError(null);
        } else {
          setError("Idea not found");
        }
      } catch (err) {
        console.error("Failed to load idea data:", err);
        setError("Failed to load idea data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIdea();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <AdminHeader title="Review Idea" />
        <div className="flex-1 p-8 space-y-6 max-w-5xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <Link href="/admin-dashboard/ideas">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
              >
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
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !idea) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <AdminHeader title="Idea Not Found" />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">
              {error || "Idea not found"}
            </p>
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
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
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
