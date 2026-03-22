"use client";

import React, { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { IdeasHeader } from "@/components/admin-dashboard/ideas/IdeasHeader";
import { IdeasTable } from "@/components/admin-dashboard/ideas/IdeasTable";
import { ideasService, Idea } from "@/lib/services/ideas-service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

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
        setError("Failed to load ideas data");
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50">
      <AdminHeader title="Ideas & Suggestions" />
      <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto w-full">
        <IdeasHeader />

        {/* Loading State */}
        {loading && (
          <Card className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-4 w-96" />
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Error State */}
        {error && !loading && (
          <Card className="p-12 text-center">
            <p className="text-red-600 text-lg font-medium">{error}</p>
            <p className="text-slate-500 mt-2">
              Please try refreshing the page
            </p>
          </Card>
        )}

        {/* Ideas Table */}
        {!loading && !error && <IdeasTable ideas={ideas} />}
      </div>
    </div>
  );
}
