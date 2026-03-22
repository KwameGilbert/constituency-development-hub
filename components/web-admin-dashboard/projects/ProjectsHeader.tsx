"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProjectsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-16 z-10 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 px-4 border-b border-transparent data-stuck:border-slate-200/60 transition-all">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Development Projects
        </h1>
        <p className="text-slate-500 mt-1">
          Manage constituency development projects and initiatives
        </p>
      </div>
      <Link href="/web-admin-dashboard/projects/new">
        <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </Link>
    </div>
  );
}
