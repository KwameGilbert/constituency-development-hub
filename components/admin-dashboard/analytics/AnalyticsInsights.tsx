"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Trophy, Target, ArrowRight, UserCheck, Timer } from "lucide-react";
import {
  dashboardService,
  AnalyticsInsightsData,
} from "@/lib/services/dashboard-service";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsInsights() {
  const [insightsData, setInsightsData] =
    useState<AnalyticsInsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await dashboardService.getAnalyticsInsights();

        if (response.success && response.data) {
          setInsightsData(response.data);
        } else {
          setError(response.message || "Failed to load insights data");
        }
      } catch (err) {
        setError("Failed to load insights data");
        console.error("Error fetching insights:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {[1, 2].map((i) => (
          <Card key={i} className="border-none shadow-sm h-80">
            <CardHeader className="p-5">
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-16 w-full rounded-2xl" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !insightsData) {
    return (
      <Card className="border-none shadow-sm bg-red-50 p-6 mb-6">
        <div className="text-center text-red-600 font-bold">
           {error || "No insights data available"}
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
      {/* Top Performers */}
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardHeader className="bg-white/50 border-b border-slate-100/60 p-5">
          <div className="flex items-center gap-2">
             <Trophy className="w-4 h-4 text-amber-500" />
             <CardTitle className="text-lg font-semibold text-slate-800 tracking-tight">
              Top Performers
            </CardTitle>
          </div>
          <p className="text-xs font-normal text-muted-foreground mt-1">
            Highest resolution rates across sectors
          </p>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {insightsData.insights.topPerformers.map((performer) => (
            <div
              key={performer.id}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm group hover:border-amber-200/50 hover:bg-amber-50/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-amber-500 font-black text-sm shadow-lg group-hover:scale-110 transition-transform">
                  {performer.rank}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {performer.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <UserCheck className="w-3 h-3 text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{performer.role}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="inline-flex px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-black mb-1 border border-emerald-100">
                  {performer.resolutionRate}%
                </span>
                <span className="text-xs font-normal text-muted-foreground">
                  {performer.resolvedCount} of {performer.totalCount} Cases
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Community Insights */}
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardHeader className="bg-white/50 border-b border-slate-100/60 p-5">
           <div className="flex items-center gap-2">
             <Target className="w-4 h-4 text-amber-500" />
             <CardTitle className="text-lg font-semibold text-slate-800 tracking-tight">
              Geographic Efficacy
            </CardTitle>
          </div>
          <p className="text-xs font-normal text-muted-foreground mt-1">
            Volume and resolution time by location
          </p>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {insightsData.insights.communityInsights.map((location, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-50 shadow-sm group hover:border-amber-200/50 hover:bg-amber-50/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-slate-100 rounded-2xl text-slate-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                    {location.location}
                  </h4>
                  <p className="text-xs font-normal text-muted-foreground mt-0.5">
                    {location.issuesReported} Total Reports
                  </p>
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-1.5 mb-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                  <Timer className="w-3 h-3 text-slate-400" />
                  <span className="text-[11px] font-black text-slate-900">
                    {location.avgResolutionTime}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-400">Average Turnaround</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
