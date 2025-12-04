import React from "react";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { PortalCard } from "@/components/portal/PortalCard";
import { PortalFooter } from "@/components/portal/PortalFooter";
import { User, Shield, Settings } from "lucide-react";

export default function PortalPage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <PortalHeader />

            <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-[#1e1b4b]">Admin Portal</h2>
                    <p className="text-muted-foreground">Select your role to continue to the login page</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
                    <PortalCard
                        title="Agent"
                        description="Manage field activities and report issues from the community"
                        icon={User}
                        buttonText="Login as Agent"
                        href="/agent-login"
                        colorTheme="blue"
                    />
                    <PortalCard
                        title="Officer"
                        description="Coordinate resources, manage communications, and support staff"
                        icon={Settings}
                        buttonText="Login as Officer"
                        href="/officer-login"
                        colorTheme="blue"
                    />
                    <PortalCard
                        title="Admin"
                        description="Oversee all operations, manage users, and handle system settings"
                        icon={Shield}
                        buttonText="Login as Admin"
                        href="/admin-login"
                        colorTheme="red"
                    />
                </div>
            </main>

            <PortalFooter />
        </div>
    );
}
