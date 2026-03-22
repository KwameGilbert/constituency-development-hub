"use client";

import React, { useEffect, useState } from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { ProjectForm } from "@/components/web-admin-dashboard/projects/ProjectForm";
import { projectsService, Project } from "@/lib/services/projects-service";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();
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
      <WebAdminHeader title={project ? `Edit: ${project.title}` : "Edit Project"} />
      <div className="flex-1 p-8 space-y-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 sticky top-16 z-10 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 px-4 transition-all border-b border-transparent data-stuck:border-slate-200/60">
          <button 
            onClick={() => router.back()}
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Modify Project</h2>
            <p className="text-sm font-medium text-slate-500">Update development initiative details</p>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-amber-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading Details...</p>
          </div>
        ) : error || !project ? (
          <Card className="p-12 text-center border-red-100 bg-white/50 backdrop-blur-sm shadow-sm">
             <h3 className="text-xl font-bold text-red-600 mb-2">Sync Connection Failed</h3>
             <p className="text-slate-500 font-medium mb-6">{error || "Project not found"}</p>
             <Link href="/web-admin-dashboard/projects">
               <button className="px-6 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all">
                 Return to Projects
               </button>
             </Link>
          </Card>
        ) : (
          <ProjectForm project={project} />
        )}
      </div>
    </div>
  );
}
