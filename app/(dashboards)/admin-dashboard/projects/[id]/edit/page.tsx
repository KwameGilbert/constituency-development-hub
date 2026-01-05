import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { NewProjectForm } from "@/components/admin-dashboard/projects/ProjectForm";
import { projectsService } from "@/lib/services/projects-service";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let project = null;
  let error = null;

  try {
    const response = await projectsService.getProjectById(id);
    if (response && response.success && response.data.project) {
      project = response.data.project;
    } else {
      return notFound();
    }
  } catch (e: any) {
    console.error("Failed to fetch project:", e);
    error = e.message || "Failed to load project";
  }

  if (error || !project) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-slate-50">
        <AdminHeader title="Project Not Found" />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || "Project not found"}</p>
            <Link href="/admin-dashboard/projects">
              <Button>Back to Projects</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Edit Project" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href={`/admin-dashboard/projects/${project.id}`}>
            <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Edit Project</h1>
            <p className="text-slate-500">{project.title}</p>
          </div>
        </div>
        
        <NewProjectForm project={project} />
      </div>
    </div>
  );
}
