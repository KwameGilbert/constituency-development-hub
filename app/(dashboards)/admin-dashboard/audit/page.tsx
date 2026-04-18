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

// Simple debounce implementation
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
            className="bg-emerald-50 text-emerald-700 border-emerald-100 font-bold px-3 py-0.5 rounded-lg"
          >
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> SUCCESS
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-100 font-bold px-3 py-0.5 rounded-lg"
          >
            <XCircle className="w-3.5 h-3.5 mr-1.5" /> FAILED
          </Badge>
        );
      case "warning":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-100 font-bold px-3 py-0.5 rounded-lg"
          >
            <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> WARNING
          </Badge>
        );
      default:
        return <Badge className="bg-slate-950 text-white border-slate-900 font-black tracking-widest text-[10px]">{status.toUpperCase()}</Badge>;
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

      <div className="flex-1 p-8 space-y-8 max-w-[1600px] mx-auto w-full">
         {/* Strategic Title Section */}
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-10 bg-amber-500 rounded-full" />
            <div>
              <h2 className="text-3xl font-bold text-slate-950 tracking-tight flex items-center gap-3">
                Action Matrix
                {!loading && summary && (
                   <span className="text-[10px] font-black bg-slate-100 text-slate-400 px-3 py-1 rounded-full uppercase tracking-[0.2em] ml-2">
                     Integrity Locked
                   </span>
                )}
              </h2>
              <p className="text-slate-500 font-medium text-sm mt-0.5">
                Monitoring {pagination.total.toLocaleString()} unique operational events across the constituency infrastructure
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <Button
                variant="outline"
                className="flex-1 sm:flex-none h-12 px-6 rounded-2xl bg-white border-slate-100 text-slate-700 font-black text-xs uppercase tracking-widest flex items-center gap-3 group hover:bg-slate-50"
                onClick={() => fetchAuditLogs(pagination.page)}
                disabled={loading}
              >
                <div className="p-1 bg-slate-100 rounded-lg group-hover:bg-amber-100 transition-colors">
                   <History className={`w-3.5 h-3.5 text-slate-400 group-hover:animate-spin ${loading ? 'animate-spin' : ''}`} />
                </div>
                Sync Registry
              </Button>
              <Button className="flex-1 sm:flex-none h-12 px-6 bg-slate-950 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 group">
                <div className="p-1.5 bg-amber-500 rounded-lg shadow-md shadow-amber-500/20">
                   <Download className="h-4 w-4 text-slate-950" />
                </div>
                Capture CSV
              </Button>
          </div>
        </div>

        {/* Global Registry Filters */}
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl bg-white overflow-hidden p-6">
          <div className="flex flex-col lg:flex-row gap-6 items-end">
            <div className="flex-1 space-y-2 group">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 mb-2 block">Registry Context Search</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-amber-500 transition-colors" />
                <Input
                  placeholder="Identify by user signature, action protocol, or resource ID..."
                  className="h-12 pl-12 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 font-bold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full lg:w-56 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-1 mb-2 block">Action Protocol</label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-black text-slate-950 uppercase tracking-widest text-[10px]">
                  <SelectValue placeholder="All Protocols" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="all" className="font-bold text-[10px] uppercase tracking-widest">Unified Registry</SelectItem>
                  <SelectItem value="create" className="font-bold text-[10px] uppercase tracking-widest">Creation Event</SelectItem>
                  <SelectItem value="update" className="font-bold text-[10px] uppercase tracking-widest">Modification Event</SelectItem>
                  <SelectItem value="delete" className="font-bold text-[10px] uppercase tracking-widest text-red-600">Purge Event</SelectItem>
                  <SelectItem value="login" className="font-bold text-[10px] uppercase tracking-widest text-emerald-600">Authentication</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Transaction Ledger Visualization */}
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl overflow-hidden bg-white relative">
          {loading && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Polling Secure Proxy...</span>
             </div>
          )}
          
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operator Identity</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protocol Action</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Resource Subject</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Endpoint Proxy</TableHead>
                  <TableHead className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest min-w-[180px]">
                    Temporal Fingerprint
                    <ArrowUpDown className="w-3 h-3 inline ml-2 opacity-50" />
                  </TableHead>
                  <TableHead className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Execution Integrity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-50">
                {auditLogs.length === 0 && !loading ? (
                  <TableRow>
                     <TableCell colSpan={6} className="py-24 text-center">
                        <div className="flex flex-col items-center gap-4">
                           <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                             <ShieldCheck className="w-8 h-8" />
                           </div>
                           <p className="text-slate-400 font-bold italic tracking-tight">Registry Silence: No operational matching detected in the secure buffer.</p>
                        </div>
                     </TableCell>
                  </TableRow>
                ) : (
                  auditLogs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
                              <UserCircle className="w-4 h-4" />
                           </div>
                           <span className="font-bold text-slate-900 text-xs tracking-tight">{log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                         <span className="text-[10px] font-black uppercase text-slate-700 bg-slate-100 px-2 py-1 rounded-md tracking-wider">
                           {log.action}
                         </span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-xs font-medium text-slate-400 block truncate max-w-[200px]" title={log.resource}>
                          {log.resource}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100/50">
                          {log.ip}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tighter leading-none">
                           <Activity className="w-3 h-3 text-amber-500/50" />
                           {formatTimestamp(log.timestamp)}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-right">
                        {getStatusBadge(log.status)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination Matrix */}
            {!loading && auditLogs.length > 0 && (
               <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Execution Cluster: <span className="text-slate-950">{auditLogs.length} entries</span> on Page <span className="text-slate-950">{pagination.page}</span> / <span className="text-slate-950">{pagination.total_pages}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      className="h-10 rounded-xl bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1 || loading}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Roll Back
                    </Button>
                    <div className="w-10 h-10 rounded-xl bg-slate-950 text-white flex items-center justify-center font-black text-xs shadow-lg shadow-slate-900/20">
                       {pagination.page}
                    </div>
                    <Button
                      variant="ghost"
                      className="h-10 rounded-xl bg-white border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.total_pages || loading}
                    >
                      Advance
                      <ChevronRight className="w-4 h-4 ml-2" />
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
