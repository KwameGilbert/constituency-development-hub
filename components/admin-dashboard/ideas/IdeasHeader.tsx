"use client";

import { ListFilter, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export function IdeasHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold text-slate-950 tracking-tight">
            Idea Submission Hub
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">
            Strategic review and moderation of community-driven project suggestions
          </p>
        </div>
      </div>
      <Button variant="outline" className="h-12 px-6 rounded-2xl border-slate-200 bg-white text-slate-700 font-black text-xs uppercase tracking-widest flex items-center gap-3 group hover:bg-slate-50 transition-all shadow-sm">
        <div className="p-1.5 bg-slate-100 rounded-lg group-hover:bg-amber-100 transition-colors">
           <ListFilter className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
        </div>
        Refine Context
      </Button>
    </div>
  );
}
