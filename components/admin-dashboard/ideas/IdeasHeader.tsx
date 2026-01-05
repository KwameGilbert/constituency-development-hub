"use client";

import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function IdeasHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Ideas & Suggestions</h1>
        <p className="text-slate-500 mt-1">Review and manage community-submitted ideas</p>
      </div>
      <Button variant="outline" className="gap-2">
        <ListFilter className="w-4 h-4" />
        Filter
      </Button>
    </div>
  );
}
