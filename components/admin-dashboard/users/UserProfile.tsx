"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  BarChart3,
  User as UserIcon,
  Loader2,
  Mail,
  Phone,
  Calendar,
  Clock,
  Shield,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { userService, User } from "@/lib/services/user-service";
import { auditService, AuditLog } from "@/lib/services/audit-service";

type UserDetail = User & {
  email_verified?: boolean;
  email_verified_at?: string | null;
  first_login?: boolean;
  last_login_at?: string | null;
  updated_at?: string | null;
  statistics?: {
    total_issues?: number;
    resolved_issues?: number;
    pending_issues?: number;
    in_progress?: number;
  };
  permissions?: string[];
  role_profile?: Record<string, unknown>;
};

export function UserProfile() {
  const params = useParams();
  const userId = params.id as string;

  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activityLogs, setActivityLogs] = useState<AuditLog[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [showAllActivities, setShowAllActivities] = useState(false);

  const roleDisplayNames: Record<UserDetail["role"], string> = {
    admin: "Admin",
    web_admin: "Web Admin",
    officer: "Officer",
    agent: "Agent",
    task_force: "Task Force",
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString();
  };

  const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
  };

  const formatLabel = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") return "—";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  const getStatusBadge = (status: AuditLog["status"]) => {
    if (status === "success") {
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-700 border-green-200"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" /> Success
        </Badge>
      );
    }

    if (status === "failed") {
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-700 border-red-200"
        >
          <XCircle className="w-3 h-3 mr-1" /> Failed
        </Badge>
      );
    }

    return (
      <Badge
        variant="outline"
        className="bg-amber-50 text-amber-700 border-amber-200"
      >
        <AlertCircle className="w-3 h-3 mr-1" /> Warning
      </Badge>
    );
  };

  const isRelevantActivity = (log: AuditLog, currentUser: UserDetail) => {
    const logUser = (log.user || "").toLowerCase();
    const currentName = (currentUser.name || "").toLowerCase();
    const resource = (log.resource || "").toLowerCase();
    const userResourceRef = `user #${currentUser.id}`;

    return logUser === currentName || resource.includes(userResourceRef);
  };

  const fetchUserActivity = async (currentUser: UserDetail) => {
    try {
      setActivityLoading(true);
      setActivityError(null);

      const searchTerms = [
        currentUser.email,
        currentUser.name,
        `User #${currentUser.id}`,
      ].filter(Boolean) as string[];

      const uniqueLogs = new Map<number, AuditLog>();

      for (const term of searchTerms) {
        const response = await auditService.getAuditLogs({
          page: 1,
          limit: 100,
          search: term,
        });

        if (!response.success) {
          continue;
        }

        response.data.auditLogs.forEach((log) => {
          if (isRelevantActivity(log, currentUser)) {
            uniqueLogs.set(log.id, log);
          }
        });
      }

      const sortedLogs = Array.from(uniqueLogs.values()).sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      setActivityLogs(sortedLogs);
    } catch (err) {
      console.error("Failed to fetch user activity:", err);
      setActivityError("Failed to load user activity");
    } finally {
      setActivityLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await userService.getUserById(parseInt(userId));

        if (response.success && response.data.user) {
          const userData = response.data.user as UserDetail;
          setUser(userData);
          fetchUserActivity(userData);
        } else {
          setError(response.message || "Failed to load user");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Loading user profile...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="text-center p-8 text-red-600">
        {error || "User not found"}
      </div>
    );
  }

  const activityToDisplay = showAllActivities
    ? activityLogs
    : activityLogs.slice(0, 8);

  const successCount = activityLogs.filter(
    (entry) => entry.status === "success",
  ).length;
  const failedCount = activityLogs.filter(
    (entry) => entry.status === "failed",
  ).length;
  const warningCount = activityLogs.filter(
    (entry) => entry.status === "warning",
  ).length;

  const roleProfileEntries = Object.entries(user.role_profile || {});

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <Avatar className="h-24 w-24 bg-indigo-50 text-indigo-600 ring-4 ring-white shadow-sm">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl font-bold bg-indigo-100 text-indigo-600">
                <UserIcon className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 hover:bg-blue-50"
                >
                  {roleDisplayNames[user.role]}
                </Badge>
                <Badge
                  className={`border-0 ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : user.status === "suspended"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{user.phone || "No phone"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{user.location || "No location assigned"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Joined: {formatDate(user.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>
                    Last Login:{" "}
                    {formatDateTime(user.last_login_at || user.last_login)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>
                    Email Verified: {user.email_verified ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Activity</CardTitle>
              <CardDescription>
                Complete audit activity related to this user.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {activityLogs.length}
                  </p>
                </div>
                <div className="rounded-lg border bg-green-50 p-3">
                  <p className="text-xs text-green-700">Success</p>
                  <p className="text-xl font-semibold text-green-800">
                    {successCount}
                  </p>
                </div>
                <div className="rounded-lg border bg-red-50 p-3">
                  <p className="text-xs text-red-700">Failed</p>
                  <p className="text-xl font-semibold text-red-800">
                    {failedCount}
                  </p>
                </div>
                <div className="rounded-lg border bg-amber-50 p-3">
                  <p className="text-xs text-amber-700">Warning</p>
                  <p className="text-xl font-semibold text-amber-800">
                    {warningCount}
                  </p>
                </div>
              </div>

              {activityLoading && (
                <div className="flex items-center justify-center p-8 text-gray-500">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Loading activity...
                </div>
              )}

              {!activityLoading && activityError && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                  {activityError}
                </div>
              )}

              {!activityLoading &&
                !activityError &&
                activityToDisplay.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p>No activity history available for this user.</p>
                  </div>
                )}

              {!activityLoading &&
                !activityError &&
                activityToDisplay.length > 0 && (
                  <div className="space-y-3">
                    {activityToDisplay.map((log) => (
                      <div
                        key={log.id}
                        className="rounded-lg border border-gray-200 p-4 bg-white"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="font-medium text-gray-900">
                              {log.action}
                            </p>
                            <p className="text-sm text-gray-500">
                              {log.resource || "-"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(log.status)}
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex flex-wrap gap-4">
                          <span>IP: {log.ip || "-"}</span>
                          <span>{formatDateTime(log.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {activityLogs.length > 8 && (
                <div className="pt-2 flex justify-center">
                  <Button
                    type="button"
                    variant="secondary"
                    className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                    onClick={() => setShowAllActivities((prev) => !prev)}
                  >
                    {showAllActivities
                      ? "Show Less Activity"
                      : `View All Activity (${activityLogs.length})`}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">User Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-gray-600">Total Issues</span>
                <span className="font-semibold text-gray-900">
                  {user.statistics?.total_issues ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-gray-600">Resolved</span>
                <span className="font-semibold text-green-700">
                  {user.statistics?.resolved_issues ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-amber-700">
                  {user.statistics?.pending_issues ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-3">
                <span className="text-sm text-gray-600">In Progress</span>
                <span className="font-semibold text-blue-700">
                  {user.statistics?.in_progress ?? 0}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Created</span>
                <span className="font-medium text-gray-900">
                  {formatDateTime(user.created_at)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Updated</span>
                <span className="font-medium text-gray-900">
                  {formatDateTime(user.updated_at)}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Email Verified At</span>
                <span className="font-medium text-gray-900">
                  {formatDateTime(user.email_verified_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">First Login Pending</span>
                <span className="font-medium text-gray-900">
                  {user.first_login ? "Yes" : "No"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              {user.permissions && user.permissions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.permissions.map((permission) => (
                    <Badge
                      key={permission}
                      variant="secondary"
                      className="bg-slate-100 text-slate-700"
                    >
                      {permission}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No permissions available.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Role Profile Details</CardTitle>
          <CardDescription>
            Full role-specific information attached to this user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {roleProfileEntries.length === 0 ? (
            <p className="text-sm text-gray-500">
              No role-specific profile data available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {roleProfileEntries.map(([key, value]) => (
                <div key={key} className="rounded-lg border p-3 bg-white">
                  <p className="text-xs text-gray-500 mb-1">
                    {formatLabel(key)}
                  </p>
                  <p className="text-sm font-medium text-gray-900 wrap-break-word">
                    {formatValue(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
