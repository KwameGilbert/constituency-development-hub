import { featuredProjects } from "@/data/data";
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

function ProjectsShowcase() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4">
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.id}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
              className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-sm"
            >
              <div className="h-56 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={400}
                  height={224}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <span>{project.sector}</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-emerald-700">
                    {project.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-500">{project.description}</p>
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
                    {project.start}
                    {project.end ? ` · ${project.end}` : " · Ongoing"}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsShowcase;
