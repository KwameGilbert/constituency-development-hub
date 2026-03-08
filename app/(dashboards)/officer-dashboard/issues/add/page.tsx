import { AddIssuesHeader } from "@/components/officer-dashboard/issues/AddIssuesHeader";
import { AddIssues } from "@/components/officer-dashboard/issues/AddIssues";
import React from "react";

export default function AddIssuePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      <AddIssuesHeader />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 sm:p-6 pb-20 max-w-5xl mx-auto">
          <AddIssues />
        </div>
      </div>
    </div>
  );
}
