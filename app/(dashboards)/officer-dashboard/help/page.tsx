import { HelpHeader } from "@/components/officer-dashboard/help/HelpHeader";
import { HelpSections } from "@/components/officer-dashboard/help/HelpSections";
import React from "react";

export default function HelpPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      <HelpHeader />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 sm:p-6 pb-20 max-w-7xl mx-auto space-y-6">
          <HelpSections />
        </div>
      </div>
    </div>
  );
}
