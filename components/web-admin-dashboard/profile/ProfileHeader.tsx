import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export function ProfileHeader() {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/80 backdrop-blur-md rounded-xl border border-transparent data-stuck:border-slate-200/60 sticky top-16 z-10 -mx-4 transition-all">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-violet-950">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>
      <Link href="/web-admin-dashboard">
        <Button
          variant="outline"
          className="gap-2 border-violet-200 text-violet-700 hover:bg-violet-50 hover:text-violet-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
