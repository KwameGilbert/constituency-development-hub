import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

export function AgentsHeader() {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-inner group hover:bg-indigo-50 hover:border-indigo-100 transition-all">
          <SidebarTrigger className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-[#1e1b4b] tracking-tight">
              Agent Registry
            </h1>
            <Badge
              variant="outline"
              className="hidden md:flex bg-indigo-50/50 text-indigo-700 border-indigo-100 rounded-full text-[9px] font-bold uppercase tracking-widest py-0 px-2"
            >
              Secure
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Manage and oversee field agent profiles and electoral assignments
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/officer-dashboard/agents/add">
          <Button className="h-8.5 px-3 bg-[#1e1b4b] hover:bg-[#1e1b4b]/90 text-white gap-2 rounded-lg shadow-sm transition-all font-medium text-xs group">
            <UserPlus className="h-3.5 w-3.5" />
            <span>Enroll Operative</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
