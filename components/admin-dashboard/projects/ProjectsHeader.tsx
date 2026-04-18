"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ProjectsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold text-slate-950 tracking-tight">
            Development Projects
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">
            Active constituency-wide initiatives and progress oversight
          </p>
        </div>
      </div>
      <Link href="/admin-dashboard/projects/new">
        <Button className="h-12 px-6 bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-lg transition-all font-bold flex items-center gap-2">
          <Plus className="w-5 h-5 text-amber-500" />
          Launch New Project
        </Button>
      </Link>
    </div>
  );
}
