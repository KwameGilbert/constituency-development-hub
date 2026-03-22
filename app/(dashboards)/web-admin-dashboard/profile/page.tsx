import WebAdminHeader from "@/components/web-admin-dashboard/WebAdminHeader";
import { ProfileHeader } from "@/components/web-admin-dashboard/profile/ProfileHeader";
import { ProfileDetails } from "@/components/web-admin-dashboard/profile/ProfileDetails";
import React from "react";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <WebAdminHeader title="Profile Settings" />
      <div className="flex-1 p-8 space-y-6 max-w-5xl mx-auto w-full">
        <ProfileHeader />
        <div className="">
          <ProfileDetails />
        </div>
      </div>
    </div>
  );
}
