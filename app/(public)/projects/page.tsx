"use client";

import { useEffect, useState } from "react";
import { projectsService, Project } from "@/lib/services/projects-service";
import PageHero from "@/components/hero/PageHero";
import { motion } from "framer-motion";
import Image from "next/image";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 * (index % 6) }, // Stagger effect
  }),
};

import ProjectDetailsModal from "@/components/projects/ProjectDetailsModal";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectsService.getPublicProjects({
          limit: 100,
        });
        if (response.success) {
          setProjects(response.data.projects);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch projects");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "ongoing":
        return "bg-emerald-100 text-emerald-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "planning":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <>
      <PageHero
        title="Development Projects"
        description="Tracking the progress of infrastructure, health, and education initiatives across the constituency."
        backgroundImage="/images/hero-default.jpg"
      />

      <section className="bg-slate-50 py-16 min-h-screen">
        <div className="mx-auto max-w-6xl px-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-8 text-center">
              {error}. Please try again later.
            </div>
          )}

          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                >
                  <div className="h-56 animate-pulse bg-slate-200" />
                  <div className="space-y-3 p-5">
                    <div className="flex justify-between">
                      <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
                      <div className="h-5 w-16 animate-pulse rounded-full bg-slate-200" />
                    </div>
                    <div className="h-7 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                    <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {projects.length === 0 ? (
                <div className="text-center py-20 text-slate-500">
                  <p className="text-xl">No projects found.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project, index) => (
                    <motion.article
                      key={project.id}
                      custom={index}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={cardVariants}
                      onClick={() => setSelectedProject(project)}
                      className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="h-56 overflow-hidden bg-slate-100 relative group">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-400">
                            No Image
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      </div>
                      <div className="space-y-3 p-5">
                        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                          <span>{project.sector?.name || "General"}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 ${getStatusColor(
                              project.status,
                            )}`}
                          >
                            {project.status}
                          </span>
                        </div>
                        <h3 className="line-clamp-2 text-xl font-semibold text-slate-900 group-hover:text-red-700 transition-colors">
                          {project.title}
                        </h3>
                        <p className="line-clamp-2 text-sm text-slate-500">
                          {project.description}
                        </p>
                        <hr className="border-slate-100" />
                        <div className="text-sm text-slate-500 grid grid-cols-2 gap-2">
                          <p>
                            <span className="block text-xs font-bold text-slate-400 uppercase">
                              Location
                            </span>
                            <span
                              className="text-slate-700 font-medium truncate block"
                              title={project.location}
                            >
                              {project.location}
                            </span>
                          </p>
                          <p className="text-right">
                            <span className="block text-xs font-bold text-slate-400 uppercase">
                              Timeline
                            </span>
                            <span className="text-slate-700 font-medium">
                              {project.end_date
                                ? formatDate(project.end_date)
                                : "Ongoing"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <ProjectDetailsModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </section>
    </>
  );
}
