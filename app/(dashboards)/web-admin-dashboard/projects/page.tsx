"use client";

import React, { useEffect, useState } from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { ProjectsHeader } from "@/components/web-admin-dashboard/projects/ProjectsHeader";
import { ProjectsTable } from "@/components/web-admin-dashboard/projects/ProjectsTable";
import {
  projectsService,
  Project,
} from "@/lib/services/projects-service";


export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        const response = await projectsService.getAdminProjects({
          limit: 1000,
        });
        if (response && response.success && response.data) {
          setProjects(response.data.projects || []);
        } else {
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
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <WebAdminHeader title="Development Projects" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <ProjectsHeader />

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-amber-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Synchronizing Projects...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-red-100 shadow-sm">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
               <span className="text-red-500 text-2xl font-bold">!</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sync Connection Failed</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">{error}</p>
          </div>
        ) : (
          <ProjectsTable projects={projects} />
        )}
      </div>
    </div>
  );
}
