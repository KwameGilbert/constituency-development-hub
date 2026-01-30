import { IssuesHeader } from "@/components/officer-dashboard/issues/IssuesHeader";
import { AllIssues } from "@/components/officer-dashboard/issues/AllIssues";
import React from "react";

export default function IssuesPage() {
  return (
    <div>
      <IssuesHeader />

      <div className="p-4 space-y-8 bg-gray-100 min-h-screen">
        <AllIssues />
      </div>
    </div>
  );
}
