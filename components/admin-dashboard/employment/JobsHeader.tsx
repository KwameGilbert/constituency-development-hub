"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function JobsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold text-slate-950 tracking-tight">
            Employment Hub
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">
            Manage job opportunities and vocational development programs
          </p>
        </div>
      </div>
      <Link href="/admin-dashboard/employment/new">
        <Button className="h-12 px-6 bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 group">
          <div className="p-1.5 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-amber-500/20">
             <Plus className="h-4 w-4 text-slate-950" />
          </div>
          Post New Position
        </Button>
      </Link>
    </div>
  );
}
