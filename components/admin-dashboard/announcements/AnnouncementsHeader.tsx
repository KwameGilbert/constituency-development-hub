"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function AnnouncementsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
        <div>
          <h1 className="text-3xl font-bold text-slate-950 tracking-tight">
            Broadcast Communications
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">
            Manage public updates and constituency-wide official notifications
          </p>
        </div>
      </div>
      <Link href="/admin-dashboard/announcements/new">
        <Button className="h-12 px-6 bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-xl transition-all font-black text-xs uppercase tracking-widest flex items-center gap-3 group">
          <div className="p-1.5 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform shadow-md shadow-amber-500/20">
             <Plus className="h-4 w-4 text-slate-950" />
          </div>
          Draft New Broadcast
        </Button>
      </Link>
    </div>
  );
}
