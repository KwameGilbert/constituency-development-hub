"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TaskForceDashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the dashboard page
    router.replace("/task-force-dashboard/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-10 w-10 text-amber-600 animate-spin mx-auto mb-4" />
        <p className="text-slate-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
