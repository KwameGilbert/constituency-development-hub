"use client";

import { useEffect, useState } from "react";
import { projectsService } from "@/lib/services/projects-service";
import { motion } from "framer-motion";
import Image from "next/image";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 * index },
  }),
};

import ProjectDetailsModal from "@/components/projects/ProjectDetailsModal";

// ... (existing imports, but we need to make sure we don't duplicate imports if not replaced cleanly.
// I'll replace the whole file content structure to be safe or use targeted replacement carefully.
// Targeted replacement is better. I'll add imports at top, state inside, and modal at bottom.)

function ProjectsShowcase() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    // ... (same fetch logic)
    const fetchProjects = async () => {
      try {
        const response = await projectsService.getFeaturedProjects(4);
        if (response.success) {
          setProjects(response.data.projects);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch featured projects");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // ... (helpers same)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
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

  if (error) {
    return null;
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header same */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-500">
              Impact
            </p>
            <h2 className="text-3xl font-semibold text-slate-900">
              Featured Projects
            </h2>
          </div>
          <a href="/projects" className="text-sm font-semibold text-red-600">
            View all projects →
          </a>
        </div>

        {isLoading ? (
          // Loading state same
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm"
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                variants={cardVariants}
                onClick={() => setSelectedProject(project)}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="h-56 overflow-hidden bg-slate-100">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={400}
                      height={224}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-400">
                      No Image
                    </div>
                  )}
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
                  <h3 className="line-clamp-2 text-xl font-semibold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {project.title}
                  </h3>
                  <p className="line-clamp-2 text-sm text-slate-500">
                    {project.description}
                  </p>
                  <div className="text-sm text-slate-500">
                    <p>
                      <span className="font-semibold text-slate-700">
                        Location:
                      </span>{" "}
                      {project.location}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-700">
                        Timeline:
                      </span>{" "}
                      {formatDate(project.start_date)}
                      {project.end_date
                        ? ` · ${formatDate(project.end_date)}`
                        : " · Ongoing"}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}

export default ProjectsShowcase;
