"use client";

import { EditIssueHeader } from "@/components/officer-dashboard/issues/EditIssueHeader";
import { EditIssue } from "@/components/officer-dashboard/issues/EditIssue";
import React, { useState, use } from "react";

interface EditIssuePageProps {
  params: Promise<{ id: string }>;
}

export default function EditIssuePage({ params }: EditIssuePageProps) {
  const { id } = use(params);
  const [caseId, setCaseId] = useState<string | undefined>();
  
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      <EditIssueHeader caseId={caseId} />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 sm:p-6 pb-20 max-w-5xl mx-auto">
          <EditIssue 
            issueId={id} 
            onIssueLoad={(id) => setCaseId(id)} 
          />
        </div>
      </div>
    </div>
  );
}
