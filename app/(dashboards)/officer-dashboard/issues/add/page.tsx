import { AddIssuesHeader } from "@/components/officer-dashboard/issues/AddIssuesHeader";
import { AddIssues } from "@/components/officer-dashboard/issues/AddIssues";
import React from "react";

export default function AddIssuePage() {
  return (
    <div className="space-y-6">
      <AddIssuesHeader />
      <div className="p-4">
        <AddIssues />
      </div>
    </div>
  );
}
