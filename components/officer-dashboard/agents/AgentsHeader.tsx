import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function AgentsHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border shadow-sm">
            <div>
                <h1 className="text-2xl font-bold text-[#1e1b4b]">Agents Management</h1>
                <p className="text-muted-foreground">Manage field agents and their activities</p>
            </div>
            <Link href="/officer-dashboard/agents/add">
                <Button className="bg-[#312e81] hover:bg-[#312e81]/90 gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Agent
                </Button>
            </Link>
        </div>
    );
}
