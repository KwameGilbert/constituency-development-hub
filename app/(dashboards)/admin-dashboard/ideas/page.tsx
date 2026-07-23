"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { IdeasHeader } from "@/components/admin-dashboard/ideas/IdeasHeader";
import { IdeasTable } from "@/components/admin-dashboard/ideas/IdeasTable";
import { ideasService, Idea } from "@/lib/services/ideas-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ShieldAlert, LogOut } from "lucide-react";

export default function IdeasListPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        setLoading(true);
        const response = await ideasService.getAdminIdeas({ limit: 1000 });
        if (response && response.success && response.data) {
          setIdeas(response.data.ideas || []);
          setError(null);
        } else {
          setError(response?.message || "Failed to load community ideas");
        }
      } catch (err) {
        console.error("Failed to load ideas:", err);
        setError("Process failure in community idea synchronization");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 overflow-hidden">
      <AdminHeader
        title="Strategy & Insight"
        description="Unified registry for community project proposals and strategic suggestions"
        roleAbbr="MP"
        dropdownItems={[
          {
            label: "System Audit",
            href: "/admin-dashboard/audit",
            icon: ShieldAlert,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-500 font-bold",
          },
        ]}
      />

      <div className="flex-1 p-6 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full overflow-y-auto custom-scrollbar pb-20">
        <IdeasHeader />

        {/* Loading State */}
        {loading && (
          <Card className="border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden p-6 bg-white">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border-b border-slate-100 last:border-none"
                >
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-64 rounded-md" />
                    <Skeleton className="h-4 w-96 rounded-md" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="border border-red-200 shadow-xs rounded-2xl bg-red-50/40 p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <p className="text-red-700 text-base font-bold">{error}</p>
              <p className="text-slate-500 text-xs font-medium">
                Please re-initiate registry synchronization
              </p>
            </div>
          </Card>
        )}

        {/* Ideas Visualization Matrix */}
        {!loading && !error && <IdeasTable ideas={ideas} />}
      </div>
    </div>
  );
}
