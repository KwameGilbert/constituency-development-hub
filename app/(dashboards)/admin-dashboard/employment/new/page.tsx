import React from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { NewJobForm } from "@/components/admin-dashboard/employment/JobForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CreateJobPage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Create Job Posting" />
      <div className="flex-1 p-8 space-y-8 max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <Link href="/admin-dashboard/employment">
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
              Create New Job Posting
            </h1>
            <p className="text-slate-500">
              Enter the details for the new employment opportunity
            </p>
          </div>
        </div>

        <NewJobForm />
      </div>
    </div>
  );
}
