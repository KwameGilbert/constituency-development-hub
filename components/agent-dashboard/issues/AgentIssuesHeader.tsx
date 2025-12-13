import { Plus } from "lucide-react";
import Link from "next/link";

export function AgentIssuesHeader() {
    return (
        <div className="flex items-center justify-between p-4 shadow-sm bg-white border-b border-slate-200">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Issues</h1>
                <p className="text-slate-500">
                    Manage and track constituent issues
                </p>
            </div>
            <Link href="/agents-dashboard/issues/add" className="bg-slate-900 hover:bg-slate-800 text-white gap-2 flex gap-2 items-center p-2 rounded-md">
                <Plus className="h-4 w-4" />
                New Issue
            </Link>
        </div>
    );
}
