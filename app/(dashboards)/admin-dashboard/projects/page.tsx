import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { ProjectsHeader } from "@/components/admin-dashboard/projects/ProjectsHeader";
import { ProjectsTable } from "@/components/admin-dashboard/projects/ProjectsTable";
import { projectsService } from "@/lib/services/projects-service";

export default async function ProjectsListPage() {
  let projects: any[] = [];
  let pagination: any = undefined;
  let error = null;

  try {
    const response = await projectsService.getAdminProjects();
    if (response && response.success && response.data) {
      projects = response.data.projects || [];
      pagination = response.data.pagination;
    }
  } catch (e: any) {
    console.error("Failed to fetch projects:", e);
    error = e.message || "Failed to load projects";
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Projects" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <ProjectsHeader />
        
        {error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
            Error: {error}
          </div>
        ) : (
          <ProjectsTable projects={projects} pagination={pagination} />
        )}
      </div>
    </div>
  );
}
