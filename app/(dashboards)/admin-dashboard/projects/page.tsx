"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { ProjectsHeader } from "@/components/admin-dashboard/projects/ProjectsHeader";
import { ProjectsTable } from "@/components/admin-dashboard/projects/ProjectsTable";
import { projectsService, Project, ProjectResponse } from "@/lib/services/projects-service";
import { Loader2 } from "lucide-react";

type PaginationData = ProjectResponse["data"]["pagination"];

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [pagination, setPagination] = useState<PaginationData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await projectsService.getAdminProjects();
        if (response && response.success && response.data) {
          setProjects(response.data.projects || []);
          setPagination(response.data.pagination);
        } else {
            // specific case where success might be false but no error thrown
            setError(response.message || "Failed to load projects");
        }
      } catch (e) {
        console.error("Failed to fetch projects:", e);
        setError(e instanceof Error ? e.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Projects" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <ProjectsHeader />

        {loading ? (
          <div className="flex justify-center items-center h-64">
             <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : error ? (
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
