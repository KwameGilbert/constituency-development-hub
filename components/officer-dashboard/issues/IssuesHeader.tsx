import { Plus } from "lucide-react";
import Link from "next/link";

export function IssuesHeader() {
  return (
    <div className="flex items-center justify-between p-4 shadow-md bg-white">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1e1b4b]">
          Issues
        </h1>
        <p className="text-muted-foreground">
          Manage and track constituent issues
        </p>
      </div>
      <Link
        href="/officer-dashboard/issues/add"
        className="bg-[#312e81] hover:bg-[#312e81]/90 text-white gap-2 flex gap-2 items-center p-2 rounded-sm"
      >
        <Plus className="h-4 w-4" />
        New Issue
      </Link>
    </div>
  );
}
