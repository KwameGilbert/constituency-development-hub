"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChevronUp,
  RotateCcw,
  Search,
  Eye,
  Edit,
  Trash2,
  Loader2,
  Users,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { agentService, AgentProfile } from "@/lib/services/agent-service";
import { toast } from "sonner";

export function AllAgents() {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    try {
      const params: { status?: string } = {};
      if (selectedStatus !== "all") params.status = selectedStatus;

      const response = await agentService.getManagementAgentsForOfficer(params);
      if (response.success && response.data.agents) {
        let filteredAgents = response.data.agents;

        // Client-side search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filteredAgents = filteredAgents.filter(
            (agent) =>
              agent.user?.name?.toLowerCase().includes(query) ||
              agent.user?.email?.toLowerCase().includes(query) ||
              agent.agent_code?.toLowerCase().includes(query),
          );
        }

        setAgents(filteredAgents);
      }
    } catch (error) {
      console.error("Failed to fetch agents:", error);
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, searchQuery]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedStatus("all");
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      const response = await agentService.deleteAgent(id);
      if (response.success) {
        toast.success("Agent deleted successfully");
        fetchAgents();
      } else {
        toast.error(response.message || "Failed to delete agent");
      }
    } catch (error) {
      console.error("Failed to delete agent:", error);
      toast.error("Failed to delete agent");
    } finally {
      setDeletingId(null);
    }
  }

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "active")
      return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
    if (s === "suspended") return "bg-rose-50 text-rose-700 border-rose-200/50";
    if (s === "inactive" || s === "pending")
      return "bg-amber-50 text-amber-700 border-amber-200/50";
    return "bg-slate-50 text-slate-700 border-slate-200/50";
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 space-y-6 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Search className="h-4 w-4 text-indigo-500" />
              Find Agents
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-slate-500 hover:text-indigo-600"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span className="text-xs font-semibold uppercase tracking-wider mr-2">
                {showFilters ? "Hide Filters" : "Show Filters"}
              </span>
              <ChevronUp
                className={`h-4 w-4 transition-transform ${!showFilters ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="lg:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Agent Search
                </label>
                <div className="relative group">
                  <Input
                    placeholder="Search by name, email, or agent code..."
                    className="w-full bg-white border-slate-200 focus:ring-indigo-500 rounded-lg pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">
                  Agent Status
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="bg-white border-slate-200 rounded-lg">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end justify-end space-x-2 pb-0.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-4 text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-100 gap-2 rounded-lg"
                  onClick={handleResetFilters}
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  className="h-10 px-6 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm gap-2 rounded-lg"
                  onClick={() => fetchAgents()}
                >
                  Filter Results
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Table Section */}
      <Card className="border-slate-200/60 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mb-4" />
            <p className="text-slate-500 font-medium">
              Synchronizing agent data...
            </p>
          </div>
        ) : agents.length === 0 ? (
          <div className="text-center py-20 bg-white">
            <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-slate-900 font-bold text-lg">
              No Agents Found
            </h3>
            <p className="text-slate-500 text-sm max-w-[280px] mx-auto mt-2">
              We couldn&apos;t find any field agents matching your current
              filter criteria.
            </p>
            <Button
              variant="link"
              className="text-indigo-600 mt-4"
              onClick={handleResetFilters}
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <div className="bg-white">
            {/* Mobile: stacked cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="p-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarImage src={agent.profile_image || undefined} />
                        <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-bold">
                          {agent.user?.name?.charAt(0) || "A"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold text-slate-900 leading-none mb-1">
                          {agent.user?.name || "Unknown"}
                        </p>
                        <p className="text-[10px] text-slate-500 font-medium">
                          {agent.agent_code}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] uppercase tracking-wider font-bold h-5",
                        getStatusBadge(agent.user?.status || ""),
                      )}
                    >
                      {agent.user?.status}
                    </Badge>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-y-3">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        Contact
                      </p>
                      <p className="text-[11px] text-slate-700 font-medium truncate pr-2">
                        {agent.user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        Reports
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        <p className="text-[11px] text-slate-700 font-bold">
                          {agent.reports_submitted || 0} Submitted
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
                        Assigned Location
                      </p>
                      <p className="text-[11px] text-slate-700 font-medium">
                        {agent.assigned_location}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-50">
                    <Badge
                      className={cn(
                        "text-[10px] font-bold",
                        agent.id_verified
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-amber-50 text-amber-700",
                      )}
                    >
                      {agent.id_verified
                        ? "ID Verified"
                        : "Verification Pending"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Link href={`/officer-dashboard/agents/${agent.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-[10px] font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 gap-1.5 rounded-lg"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>
                      <Link href={`/officer-dashboard/agents/${agent.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-3 text-[10px] font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 gap-1.5 rounded-lg"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/tablet: show table on md+ */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/80 border-b border-slate-100">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-4 pl-6">
                      Agent Details
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-4">
                      Agent Code
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-4">
                      Location
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-4">
                      Reports
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-4">
                      Status
                    </TableHead>
                    <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-widest py-4 text-right pr-6">
                      Management
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow
                      key={agent.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <TableCell className="py-4 pl-6">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-100 group-hover:scale-105 transition-transform">
                            <AvatarImage
                              src={agent.profile_image || undefined}
                            />
                            <AvatarFallback className="bg-indigo-50 text-indigo-600 text-xs font-bold">
                              {agent.user?.name?.charAt(0) || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {agent.user?.name || "Unknown"}
                            </span>
                            <span className="text-[11px] text-slate-500 font-medium">
                              {agent.user?.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100/80 px-2 py-1 rounded">
                          {agent.agent_code}
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs text-slate-600 font-medium truncate max-w-[150px]">
                          {agent.assigned_location}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1">
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className="h-5 w-5 rounded-full border border-white bg-indigo-50 flex items-center justify-center"
                              >
                                <TrendingUp className="h-2.5 w-2.5 text-indigo-400" />
                              </div>
                            ))}
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            {agent.reports_submitted || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] uppercase tracking-wider font-bold border-0",
                            getStatusBadge(agent.user?.status || ""),
                          )}
                        >
                          {agent.user?.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <div className="flex justify-end gap-1.5">
                          <Link href={`/officer-dashboard/agents/${agent.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/officer-dashboard/agents/${agent.id}/edit`}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-2xl border-slate-200">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-slate-900 font-bold">
                                  Remove Field Agent
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-500 text-sm">
                                  Are you sure you want to remove{" "}
                                  <span className="font-bold text-slate-900">
                                    {agent.user?.name}
                                  </span>
                                  ? They will lose access to the field tools
                                  immediately.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="py-4 px-4 bg-rose-50 rounded-xl border border-rose-100">
                                <p className="text-[11px] text-rose-700 font-bold uppercase tracking-widest leading-none mb-1">
                                  Warning
                                </p>
                                <p className="text-xs text-rose-600 font-medium">
                                  This action cannot be undone and will affect
                                  pending field reports.
                                </p>
                              </div>
                              <AlertDialogFooter className="mt-4">
                                <AlertDialogCancel className="rounded-xl border-slate-200 font-bold text-slate-600 text-xs">
                                  Stay Back
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(agent.id)}
                                  className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-200 transition-all border-0"
                                  disabled={deletingId === agent.id}
                                >
                                  {deletingId === agent.id ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                                  ) : null}
                                  Remove Agent
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
