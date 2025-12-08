import { ProfileHeader } from "@/components/web-admin-dashboard/profile/ProfileHeader";
import { ProfileDetails } from "@/components/web-admin-dashboard/profile/ProfileDetails";
import React from "react";

export default function ProfilePage() {
    return (
        <div className="space-y-6 p-8 bg-slate-50 min-h-screen">
            <ProfileHeader />
            <div className="">
                <ProfileDetails />
            </div>
        </div>
    );
}
