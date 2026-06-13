import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export function AgentsHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-5 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/50 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-6">
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-100 shadow-inner group hover:bg-indigo-50 hover:border-indigo-100 transition-all">
          <SidebarTrigger className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[#1e1b4b] tracking-tight">
              Agent Registry
            </h1>
            <Badge
              variant="outline"
              className="hidden sm:flex bg-indigo-50/50 text-indigo-700 border-indigo-100 rounded-full text-[10px] font-bold uppercase tracking-widest py-0.5"
            >
              Secure
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground font-semibold uppercase tracking-[0.2em] font-mono mt-0.5">
            Operational Intelligence Center
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/officer-dashboard/agents/add">
          <Button className="h-11 px-6 bg-[#1e1b4b] hover:bg-[#1e1b4b]/90 text-white gap-3 rounded-xl shadow-lg shadow-indigo-950/10 transition-all font-bold group">
            <div className="p-1 bg-white/20 rounded-lg group-hover:scale-110 transition-transform">
              <UserPlus className="h-4 w-4" />
            </div>
            <span className="hidden sm:inline">Enroll Operative</span>
            <span className="sm:hidden">Enroll</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
