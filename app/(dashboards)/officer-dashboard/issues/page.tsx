import { IssuesHeader } from "@/components/officer-dashboard/issues/IssuesHeader";
import { AllIssues } from "@/components/officer-dashboard/issues/AllIssues";
import React from "react";

export default function IssuesPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      <IssuesHeader />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 pb-20">
          <AllIssues />
        </div>
      </div>
    </div>
  );
}
