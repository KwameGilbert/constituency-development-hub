import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { NewProjectForm } from "@/components/admin-dashboard/projects/ProjectForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateProjectPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Create Project" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard/projects">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Create New Project
            </h1>
            <p className="text-slate-500">
              Enter the details for the new development project
            </p>
          </div>
        </div>

        <NewProjectForm />
      </div>
    </div>
  );
}
