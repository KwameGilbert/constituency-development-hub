"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  MapPin,
  Tag,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";
import { Project } from "@/lib/services/projects-service";
import { Button } from "@/components/ui/button";
import SanitizedHtml from "@/components/ui/SanitizedHtml";

interface ProjectDetailsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectDetailsModal({
  project,
  isOpen,
  onClose,
}: ProjectDetailsModalProps) {
  if (!project) return null;

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/projects/${project.slug}`
      : "";
  const shareText = `Check out this project: ${project.title}`;

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: "hover:text-sky-500",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
      color: "hover:text-green-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(project.title)}`,
      color: "hover:text-blue-700",
    },
  ];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/80 p-2 text-slate-500 backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="relative h-64 md:h-auto md:w-2/5 bg-slate-100">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    No Image Available
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm ${getStatusColor(
                      project.status,
                    )}`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 p-6 sm:p-8">
                <div className="mb-6">
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-emerald-600">
                    <Tag className="h-4 w-4" />
                    <span>{project.sector?.name || "General Sector"}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                    {project.title}
                  </h2>
                </div>

                <div className="mb-8 grid gap-4 text-sm text-slate-600 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-slate-400" />
                    <span>
                      {formatDate(project.start_date)}
                      {project.end_date
                        ? ` - ${formatDate(project.end_date)}`
                        : " - Ongoing"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span>{project.location}</span>
                  </div>
                </div>

                <div className="prose prose-slate prose-sm mb-8 max-w-none">
                  <h3 className="text-lg font-semibold text-slate-900">
                    About this Project
                  </h3>
                  {project.description ? (
                    <SanitizedHtml
                      html={project.description}
                      className="text-slate-600 leading-relaxed whitespace-pre-wrap"
                    />
                  ) : (
                    <p className="text-slate-600 leading-relaxed">No description available.</p>
                  )}
                </div>

                {/* Additional Details (Budget/Progress) - Optional based on privacy */}
                {project.progress_percent !== undefined && (
                  <div className="mb-8">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span>Progress</span>
                      <span>{project.progress_percent}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${project.progress_percent}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Share2 className="h-4 w-4" />
                      Share Project
                    </span>
                    <div className="flex gap-4">
                      {shareLinks.map((link) => (
                        <a
                          key={link.name}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-slate-400 transition-colors ${link.color}`}
                          title={`Share on ${link.name}`}
                        >
                          <link.icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
