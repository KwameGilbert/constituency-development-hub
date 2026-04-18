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
        if (response.success && response.data) {
          setIdeas(response.data.ideas || []);
        }
        setError(null);
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
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
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
      
      <div className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
        <IdeasHeader />

        {/* Loading State Matrix */}
        {loading && (
          <div className="space-y-6">
            <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl overflow-hidden p-6 bg-white">
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-6 border-b border-slate-50 last:border-none"
                  >
                    <div className="space-y-3 flex-1">
                      <Skeleton className="h-5 w-64 rounded-lg bg-slate-100" />
                      <Skeleton className="h-4 w-96 rounded-lg bg-slate-50" />
                    </div>
                    <div className="flex space-x-3">
                      <Skeleton className="h-8 w-24 rounded-xl bg-slate-100" />
                      <Skeleton className="h-8 w-20 rounded-xl bg-slate-50" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Strategic Error State */}
        {error && !loading && (
          <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white p-24 text-center">
            <div className="flex flex-col items-center gap-4">
               <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
                  <ShieldAlert className="w-8 h-8" />
               </div>
               <p className="text-red-600 text-lg font-black uppercase tracking-widest">{error}</p>
               <p className="text-slate-500 font-medium">Please re-initiate registry synchronization</p>
            </div>
          </Card>
        )}

        {/* Ideas Visualization Matrix */}
        {!loading && !error && <IdeasTable ideas={ideas} />}
      </div>
    </div>
  );
}
