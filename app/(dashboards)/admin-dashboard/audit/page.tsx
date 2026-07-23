"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import {
  Search,
  Download,
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
  ShieldCheck,
  History,
  Activity,
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
          toast.error("Process Failure: Audit synchronization interrupted");
        }
      } catch (err) {
        console.error("Failed to load audit logs data:", err);
        setError("System synchronization failure in audit registry");
        toast.error("Network protocol error");
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, actionType],
  );

  useEffect(() => {
    fetchAuditLogs(1);
  }, [fetchAuditLogs]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (pagination.total_pages || 1)) {
      fetchAuditLogs(newPage);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-xs px-2.5 py-0.5 rounded-md"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Success
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 font-medium text-xs px-2.5 py-0.5 rounded-md"
          >
            <XCircle className="w-3.5 h-3.5 mr-1" /> Failed
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 font-medium text-xs px-2.5 py-0.5 rounded-md"
          >
            <AlertCircle className="w-3.5 h-3.5 mr-1" /> Warning
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-100 text-slate-700 border-slate-200 font-medium text-xs">
            {status.toUpperCase()}
          </Badge>
        );
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
    <div className="flex flex-col min-h-screen w-full bg-slate-50/50">
      <AdminHeader
        title="Oversight Registry"
        description="Unified audit ledger for system-wide activity monitoring and security forensics"
        roleAbbr="MP"
        dropdownItems={[
          {
            label: "System Settings",
            href: "/admin-dashboard/system-settings",
            icon: Settings2,
          },
          {
            label: "Logout",
            icon: LogOut,
            className: "text-red-500 font-bold",
          },
        ]}
      />

      <div className="flex-1 p-6 sm:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Strategic Title Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                Action Matrix
                {!loading && summary && (
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full ml-2">
                    Integrity Locked
                  </span>
                )}
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Monitoring {pagination.total.toLocaleString()} unique operational events across the constituency infrastructure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none h-10 px-4 rounded-xl bg-white border-slate-200 text-slate-700 font-semibold text-sm flex items-center gap-2 hover:bg-slate-50"
              onClick={() => fetchAuditLogs(pagination.page)}
              disabled={loading}
            >
              <History
                className={`w-4 h-4 text-slate-500 ${loading ? "animate-spin" : ""}`}
              />
              Sync Registry
            </Button>
            <Button className="flex-1 sm:flex-none h-10 px-4 bg-slate-900 text-white hover:bg-slate-800 rounded-xl shadow-xs font-semibold text-sm flex items-center gap-2">
              <Download className="h-4 w-4 text-amber-400" />
              Capture CSV
            </Button>
          </div>
        </div>

        {/* Global Registry Filters */}
        <Card className="border border-slate-200/80 shadow-xs rounded-2xl bg-white p-5">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 space-y-1.5 w-full">
              <label className="text-sm font-medium text-slate-700 block">
                Registry Context Search
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Identify by user signature, action protocol, or resource ID..."
                  className="h-11 pl-10 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 text-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full lg:w-56 space-y-1.5">
              <label className="text-sm font-medium text-slate-700 block">
                Action Protocol
              </label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger className="h-11 rounded-lg bg-slate-50/50 border border-slate-200 text-slate-900 text-sm font-medium">
                  <SelectValue placeholder="All Protocols" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-slate-200">
                  <SelectItem value="all" className="font-medium text-sm">
                    Unified Registry
                  </SelectItem>
                  <SelectItem value="create" className="font-medium text-sm">
                    Creation Event
                  </SelectItem>
                  <SelectItem value="update" className="font-medium text-sm">
                    Modification Event
                  </SelectItem>
                  <SelectItem value="delete" className="font-medium text-sm text-red-600">
                    Purge Event
                  </SelectItem>
                  <SelectItem value="login" className="font-medium text-sm text-emerald-600">
                    Authentication
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Transaction Ledger Visualization */}
        <Card className="border border-slate-200/80 shadow-xs rounded-2xl overflow-hidden bg-white relative">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-10 flex items-center justify-center gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
              <span className="text-sm font-medium text-slate-700">
                Polling Secure Proxy...
              </span>
            </div>
          )}

          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Operator Identity
                  </TableHead>
                  <TableHead className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Protocol Action
                  </TableHead>
                  <TableHead className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Resource Subject
                  </TableHead>
                  <TableHead className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Endpoint Proxy
                  </TableHead>
                  <TableHead className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-[180px]">
                    Temporal Fingerprint
                    <ArrowUpDown className="w-3 h-3 inline ml-1.5 opacity-50" />
                  </TableHead>
                  <TableHead className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Execution Integrity
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-100">
                {auditLogs.length === 0 && !loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">
                          No operational matching detected in the log buffer.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-amber-100 group-hover:text-amber-700 transition-colors">
                            <UserCircle className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-900 text-sm">
                            {log.user}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                          {log.action}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className="text-xs text-slate-600 truncate max-w-[200px] block"
                          title={log.resource}
                        >
                          {log.resource}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="font-mono text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                          {log.ip}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 text-xs font-medium">
                          <Activity className="w-3.5 h-3.5 text-amber-500" />
                          {formatTimestamp(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        {getStatusBadge(log.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            {!loading && auditLogs.length > 0 && (
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs text-slate-500 font-medium">
                  Showing <span className="font-semibold text-slate-900">{auditLogs.length} entries</span> on Page{" "}
                  <span className="font-semibold text-slate-900">{pagination.page}</span> of{" "}
                  <span className="font-semibold text-slate-900">{pagination.total_pages}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="h-9 px-3 rounded-lg border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold text-xs">
                    {pagination.page}
                  </div>
                  <Button
                    variant="outline"
                    className="h-9 px-3 rounded-lg border-slate-200 text-slate-600 font-medium text-xs hover:bg-slate-50"
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={
                      pagination.page >= pagination.total_pages || loading
                    }
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
