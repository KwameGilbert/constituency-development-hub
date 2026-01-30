import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export function AgentAddIssuesHeader() {
  return (
    <div className="flex items-center justify-between p-4 shadow-sm bg-white border-b border-slate-200">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Add New Issue
        </h1>
        <p className="text-slate-500">
          Submit a new issue on behalf of a constituent or community
        </p>
      </div>
      <Link href="/agents-dashboard/issues">
        <Button
          variant="secondary"
          className="gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Issues
        </Button>
      </Link>
    </div>
  );
}
