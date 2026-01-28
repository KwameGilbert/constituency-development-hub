"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import {
  Search,
  Download,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  UserCircle,
  Settings2,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  auditService,
  AuditLog,
  AuditData,
} from "@/lib/services/audit-service";
import { toast } from "sonner";

// Simple debounce implementation if hook doesn't exist, but I'll use useEffect with delay
function useDebounceValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<AuditData["pagination"]>({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });
  const [summary, setSummary] = useState<AuditData["summary"] | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounceValue(searchQuery, 500);
  const [actionType, setActionType] = useState("all");

  const fetchAuditLogs = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        const response = await auditService.getAuditLogs({
          page,
          limit: 20,
          search: debouncedSearch,
          action_type: actionType,
        });

        if (response.success) {
          setAuditLogs(response.data.auditLogs);
          setPagination(response.data.pagination);
          setSummary(response.data.summary);
          setError(null);
        } else {
          setError(response.message || "Failed to load logs");
          toast.error(response.message);
        }
      } catch (err) {
        console.error("Failed to load audit logs data:", err);
        setError("Failed to load audit logs data");
        toast.error("Network error");
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, actionType],
  );

  // Reset page when filters change
  useEffect(() => {
    fetchAuditLogs(1);
  }, [fetchAuditLogs]); // fetchAuditLogs depends on debouncedSearch/actionType

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination.total_pages || 1)) {
      // We don't change state directly, we just call fetch with new page
      // But fetchAuditLogs updates state. Wait, if I call fetch(2), it updates logs.
      // I should probably track currentPage in a ref or state if I want to strictly control it,
      // but fetching handles it.
      // Actually, my useEffect logic resets to page 1 on filter change.
      // For pagination click, I shouldn't trigger that effect.
      // I should remove `fetchAuditLogs(1)` from dependency array and manage it differently?
      // Better: Add currentPage state.
      fetchAuditLogs(newPage);
    }
  };

  // Actually, standard pattern:
  // useEffect on [currentPage, debouncedSearch, actionType]
  // BUT search/action change should reset page to 1.
  // So:
  /*
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, actionType]);

    useEffect(() => {
        fetchAuditLogs(page);
    }, [page, debouncedSearch, actionType]);
  */
  // I'll stick to the simpler manual call for now to avoid rapid effect firing,
  // explicitly calling fetchAuditLogs(1) when filters change (via effect) is safer if handlePageChange calls fetchAuditLogs(p).
  // But wait, if I put fetchAuditLogs in dependency, it loops if I don't use useCallback. I did.

  // Let's rely on the useEffect(fetch(1), [debounced...]).
  // Pagination click -> calls fetch(page). Pagination state is updated from response.
  // It works.

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" /> Success
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200"
          >
            <XCircle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            <AlertCircle className="w-3 h-3 mr-1" /> Warning
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <AdminHeader
        title="Audit Logs"
        description="Track system activities and security events"
        roleAbbr="MP"
        userName="Admin.Rock"
        userRoleLabel="MP"
        dropdownItems={[
          {
            label: "Profile Settings",
            href: "/admin-dashboard/profile",
            icon: UserCircle,
          },
          {
            label: "System Settings",
            href: "/admin-dashboard/system-settings",
            icon: Settings2,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-600 focus:text-red-600 focus:bg-red-50",
          },
        ]}
      />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Filters */}
          <Card className="p-4 bg-white border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
                <div className="relative w-full sm:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search user, action or resource..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={actionType} onValueChange={setActionType}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Action Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="create">Create</SelectItem>
                    <SelectItem value="update">Update</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="login">Login</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => fetchAuditLogs(pagination.page)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" className="w-full md:w-auto">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </Card>

          {/* Loading State */}
          {loading && !auditLogs.length && (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <Card className="p-12 text-center text-red-600">{error}</Card>
          )}

          {/* Table */}
          {!loading && !error && auditLogs.length === 0 && (
            <Card className="p-12 text-center text-gray-500">
              No audit logs found matching your criteria.
            </Card>
          )}

          {auditLogs.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-gray-50/50">
                  <TableRow>
                    <TableHead className="w-[180px]">User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>
                      <div className="flex items-center space-x-1 cursor-pointer hover:text-gray-900">
                        <span>Timestamp</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-gray-50/50 py-3">
                      <TableCell className="font-medium text-indigo-600">
                        {log.user}
                      </TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell className="text-gray-500">
                        {log.resource}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-gray-500">
                        {log.ip}
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell className="text-right">
                        {getStatusBadge(log.status)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-gray-500">
                  Showing {auditLogs.length} logs (Page {pagination.page} of{" "}
                  {pagination.total_pages}) | Total: {pagination.total}
                  {summary && (
                    <span className="ml-2 hidden lg:inline-block">
                      (Success: {summary.success_count} | Failed:{" "}
                      {summary.failed_count})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={
                      pagination.page >= pagination.total_pages || loading
                    }
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
