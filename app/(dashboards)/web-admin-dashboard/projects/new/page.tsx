"use client";

import React from "react";
import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { ProjectForm } from "@/components/web-admin-dashboard/projects/ProjectForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <WebAdminHeader title="New Development Project" />
      <div className="flex-1 p-8 space-y-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4 sticky top-16 z-10 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 px-4 transition-all border-b border-transparent data-stuck:border-slate-200/60">
          <Link 
            href="/web-admin-dashboard/projects" 
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-200 shadow-sm transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Initiative</h2>
            <p className="text-sm font-medium text-slate-500">Launch a new constituency development project</p>
          </div>
        </div>

        <ProjectForm />
      </div>
    </div>
  );
}
