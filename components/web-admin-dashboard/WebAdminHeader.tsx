"use client";

import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WebAdminHeaderProps {
  title: string;
}

export default function WebAdminHeader({ title }: WebAdminHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Admin</span>
        <Avatar className="h-8 w-8 bg-violet-600">
          <AvatarImage src="/placeholder-user.jpg" />
          <AvatarFallback className="bg-violet-600 text-white">
            A
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
