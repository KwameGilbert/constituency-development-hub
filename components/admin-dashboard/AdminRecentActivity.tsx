"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Bell, LogIn, AlertCircle, Loader2, ArrowRight, Activity } from "lucide-react";
import {
  dashboardService,
  AuditLogEntry,
} from "@/lib/services/dashboard-service";
import Link from "next/link";

interface ActivityItem {
  id: number;
  user: string;
  role: string;
  action: string;
  date: string;
  time: string;
  type: "auth" | "system" | "alert";
}

function transformAuditLog(log: AuditLogEntry): ActivityItem {
  const timestamp = new Date(log.timestamp);
  const action = log.action?.toLowerCase() || "";

  let type: "auth" | "system" | "alert" = "system";
  if (
    action.includes("login") ||
    action.includes("logout") ||
    action.includes("auth")
  ) {
    type = "auth";
  } else if (
    action.includes("security") ||
    action.includes("session") ||
    action.includes("alert")
  ) {
    type = "alert";
  }

  return {
    id: log.id,
    user: log.user || "System",
    role: "",
    action: log.action || "Unknown action",
    date: timestamp.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    time: timestamp.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    type,
  };
}

export function AdminRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await dashboardService.getRecentActivity(10);

        if (response.success && response.data?.auditLogs) {
          const transformedActivities =
            response.data.auditLogs.map(transformAuditLog);
          setActivities(transformedActivities);
        } else {
          setError(response.message || "Failed to load recent activity");
        }
      } catch (err) {
        setError("Failed to load recent activity");
        console.error("Error fetching activity:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <Card className="w-full lg:w-[350px] shrink-0 flex flex-col h-full border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
        <CardHeader className="pb-4 bg-white/50 border-b border-slate-100/60 p-5">
          <CardTitle className="text-lg font-semibold text-slate-800 tracking-tight">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center p-6 bg-white">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            <span className="text-xs font-semibold tracking-wider uppercase">Syncing activity...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full lg:w-[350px] shrink-0 flex flex-col h-full border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 bg-white/50 border-b border-slate-100/60 p-5 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
          Recent Activity
        </CardTitle>
        <Activity className="w-4 h-4 text-amber-500 opacity-50" />
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[500px] px-0 bg-white custom-scrollbar">
        <div className="space-y-6 px-6 py-6 relative">
          <div className="absolute left-[38px] top-6 bottom-6 w-0.5 bg-slate-50"></div>

          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="relative flex items-start gap-4 group"
              >
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm transition-transform group-hover:scale-110 ${
                    activity.type === "alert" ? "bg-amber-100" : "bg-slate-100"
                  }`}
                >
                  {activity.type === "alert" ? (
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-slate-900 leading-none">
                      {activity.user}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-normal leading-relaxed mb-1">
                    {activity.action}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-normal tracking-tight">
                    {activity.date} • {activity.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500 font-bold">No activity recorded</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-slate-100/60 bg-slate-50/30">
        <Link
          href="/admin-dashboard/audit"
          className="w-full text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center justify-center gap-1.5 transition-all"
        >
          View Full Audit Trail <ArrowRight className="w-3 h-3" />
        </Link>
      </CardFooter>
    </Card>
  );
}
