import { ProfileHeader } from "@/components/officer-dashboard/profile/ProfileHeader";
import { ProfileDetails } from "@/components/officer-dashboard/profile/ProfileDetails";
import React from "react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-full overflow-hidden bg-slate-50/50">
      <ProfileHeader />
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 sm:p-6 pb-20 max-w-7xl mx-auto space-y-6">
          <ProfileDetails />
        </div>
      </div>
    </div>
  );
}
