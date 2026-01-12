import React from "react";
import { AddAgentForm } from "@/components/officer-dashboard/agents/AddAgentForm";
import { DashboardHeader } from "../../dashboard-header";

export default function AddAgentPage() {
    return (
        <div>
            <DashboardHeader
                title="Add New Agent"
                subtitle="Create a new field agent account"
            />
            <div className="p-6 bg-gray-100 min-h-screen">
                <AddAgentForm />
            </div>
        </div>
    );
}
