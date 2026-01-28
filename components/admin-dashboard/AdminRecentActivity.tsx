"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Bell, LogIn, AlertCircle, Loader2 } from "lucide-react";
import {
  dashboardService,
  AuditLogEntry,
} from "@/lib/services/dashboard-service";

interface ActivityItem {
  id: number;
  user: string;
  role: string;
  action: string;
  date: string;
  time: string;
  type: "auth" | "system" | "alert";
}

// Transform audit log to activity item
function transformAuditLog(log: AuditLogEntry): ActivityItem {
  const timestamp = new Date(log.timestamp);
  const action = log.action?.toLowerCase() || "";

  // Determine activity type based on action
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
    role: "", // Role not available in audit log
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
      <Card className="w-full lg:w-[350px] shrink-0 flex flex-col h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm">Loading activity...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full lg:w-[350px] shrink-0 flex flex-col h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-red-500">
            <AlertCircle className="w-6 h-6" />
            <span className="text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full lg:w-[350px] shrink-0 flex flex-col h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto max-h-[400px] px-0">
        <div className="space-y-6 px-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-[38px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

          {activities.length > 0 ? (
            activities.map((activity) => (
              <div
                key={activity.id}
                className="relative flex items-start gap-4"
              >
                {/* Icon */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 border-white shadow-sm ${
                    activity.type === "alert" ? "bg-red-50" : "bg-red-50"
                  }`}
                >
                  {activity.type === "alert" ? (
                    <Bell className="w-3.5 h-3.5 text-red-600" />
                  ) : (
                    <LogIn className="w-3.5 h-3.5 text-red-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">
                      {activity.user}
                    </span>
                    {activity.role && (
                      <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase">
                        {activity.role}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-snug mb-1">
                    {activity.action}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {activity.date}, {activity.time}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="w-8 h-8 text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">No recent activity</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t bg-gray-50/50">
        <a
          href="/admin-dashboard/audit"
          className="text-sm text-blue-600 hover:underline flex items-center"
        >
          View Audit Logs →
        </a>
      </CardFooter>
    </Card>
  );
}
