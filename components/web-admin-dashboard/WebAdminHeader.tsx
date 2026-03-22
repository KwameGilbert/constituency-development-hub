"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WebAdminHeaderProps {
  title: string;
}

export default function WebAdminHeader({ title }: WebAdminHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200/60 bg-white/80 backdrop-blur-md px-4 sticky top-0 z-20">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="text-slate-600 hover:text-amber-600 hover:bg-amber-50" />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
            {title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] text-slate-500 font-medium">
              Web Administration Center
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Admin</span>
        <Avatar className="h-8 w-8 ring-2 ring-slate-100 shadow-sm">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback className="bg-amber-500 text-slate-950 font-bold">
            A
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
