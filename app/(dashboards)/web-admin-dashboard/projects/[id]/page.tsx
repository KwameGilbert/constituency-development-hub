"use client";

import React, { useEffect, useState } from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { ProjectDetailCard } from "@/components/web-admin-dashboard/projects/ProjectDetailCard";
import { projectsService, Project } from "@/lib/services/projects-service";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        setLoading(true);
        const response = await projectsService.getProjectById(parseInt(id as string));
        if (response.success && response.data?.project) {
          setProject(response.data.project);
        } else {
          setError(response.message || "Failed to load project details");
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setError("An error occurred while loading project details");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <WebAdminHeader title={project ? project.title : "Project Details"} />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-[200px] lg:col-span-2 rounded-2xl" />
              <Skeleton className="h-[200px] rounded-2xl" />
            </div>
          </div>
        ) : error || !project ? (
          <Card className="p-12 text-center border-red-100 bg-white/50 backdrop-blur-sm shadow-sm">
            <h3 className="text-xl font-bold text-red-600 mb-2">Notice Retrieval Error</h3>
            <p className="text-slate-500 font-medium mb-6">{error || "Project not found"}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all"
            >
              Retry Connection
            </button>
          </Card>
        ) : (
          <ProjectDetailCard project={project} />
        )}
      </div>
    </div>
  );
}
