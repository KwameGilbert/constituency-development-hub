import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export function AddIssuesHeader() {
  return (
    <div className="flex items-center justify-between p-4 shadow-md bg-white">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1e1b4b]">
          Add New Issue
        </h1>
        <p className="text-muted-foreground">
          Submit a new issue on behalf of a constituent or community
        </p>
      </div>
      <Link href="/officer-dashboard/issues">
        <Button variant="secondary" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Issues
        </Button>
      </Link>
    </div>
  );
}
