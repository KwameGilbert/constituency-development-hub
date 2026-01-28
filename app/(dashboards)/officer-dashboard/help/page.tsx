import { HelpHeader } from "@/components/officer-dashboard/help/HelpHeader";
import { HelpSections } from "@/components/officer-dashboard/help/HelpSections";
import React from "react";

export default function HelpPage() {
  return (
    <div className="space-y-6">
      <HelpHeader />
      <div className="p-4">
        <HelpSections />
      </div>
    </div>
  );
}
