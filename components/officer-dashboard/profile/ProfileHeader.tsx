import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export function ProfileHeader() {
  return (
    <div className="flex items-center justify-between p-4 shadow-md bg-white">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#1e1b4b]">
          Profile Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences
        </p>
      </div>
      <Link href="/officer-dashboard">
        <Button variant="secondary" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
