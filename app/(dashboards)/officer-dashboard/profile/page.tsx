import { ProfileHeader } from "@/components/officer-dashboard/profile/ProfileHeader";
import { ProfileDetails } from "@/components/officer-dashboard/profile/ProfileDetails";
import React from "react";

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <ProfileHeader />
            <div className="p-4">
                <ProfileDetails />
            </div>
        </div>
    );
}
