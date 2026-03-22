"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Eye,
  Loader2,
  Pencil,
  Trash2,
  AlertCircle,
  FileX,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { cleanupHtml } from "@/lib/utils";
import {
  issuesService,
  Issue,
  IssueFilters,
} from "@/lib/services/issues-service";
import Link from "next/link";
import { toast } from "sonner";

interface AllIssuesProps {
  /**
   * If true, the component renders in read-only mode for admins.
   */
  readOnly?: boolean;
}

// Helper to format status names
const formatStatusLabel = (status: string) => {
  if (!status) return "";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export function AllIssues({ readOnly = false }: AllIssuesProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  const basePath = readOnly
    ? "/admin-dashboard/issues"
    : "/officer-dashboard/issues";

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Statuses");
  const [selectedCategory, setSelectedCategory] =
    useState<string>("All Categories");
  const [selectedPriority, setSelectedPriority] =
    useState<string>("All Priorities");

  // Delete Action State
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Dynamic filter options derived from data to ensure accuracy
  const dynamicCategories = useMemo(() => {
    const cats = new Set(
      issues.filter((i) => i.category).map((i) => i.category),
    );
    return ["All Categories", ...Array.from(cats)].sort();
  }, [issues]);

  const dynamicPriorities = useMemo(() => {
    const p = new Set(issues.filter((i) => i.priority).map((i) => i.priority));
    return ["All Priorities", ...Array.from(p)].sort();
  }, [issues]);

  const dynamicStatuses = useMemo(() => {
    const stats = new Set(issues.filter((i) => i.status).map((i) => i.status));
    return ["All Statuses", ...Array.from(stats)].sort();
  }, [issues]);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: IssueFilters = {
        page: 1, // Let frontend filter the list for now
        limit: 1000,
      };

      let response;
      if (readOnly) {
        response = await issuesService.getAllIssues(filters);
      } else {
        try {
          response = await issuesService.getOfficerIssues(filters);
        } catch (err) {
          console.warn(
            "getOfficerIssues failed, falling back to getAllIssues:",
            err,
          );
          response = await issuesService.getAllIssues(filters);
        }
      }

      if (response && response.success && response.data.reports) {
        setIssues(response.data.reports);
      } else {
        setIssues([]);
        if (!response.success)
          setError(response.message || "Failed to load issues");
      }
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      setError("An unexpected error occurred while loading issues.");
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [readOnly]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this issue? This action cannot be undone.",
      )
    ) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await issuesService.deleteOfficerIssue(id);
      if (response.success) {
        toast.success("Issue deleted successfully");
        setIssues(issues.filter((i) => i.id !== id));
      } else {
        toast.error(response.message || "Failed to delete issue");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedStatus("All Statuses");
    setSelectedCategory("All Categories");
    setSelectedPriority("All Priorities");
  }

  // Frontend filter evaluations
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        issue.title?.toLowerCase().includes(searchLower) ||
        issue.description?.toLowerCase().includes(searchLower) ||
        issue.community?.toLowerCase().includes(searchLower) ||
        issue.case_id?.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory =
        selectedCategory === "All Categories" ||
        issue.category === selectedCategory;

      // Status filter
      const matchesStatus =
        selectedStatus === "All Statuses" || issue.status === selectedStatus;

      // Priority Filter
      const matchesPriority =
        selectedPriority === "All Priorities" ||
        issue.priority === selectedPriority;

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesPriority
      );
    });
  }, [issues, searchQuery, selectedCategory, selectedStatus, selectedPriority]);

  function getStatusBadge(status: string) {
    const statusColors: Record<string, string> = {
      submitted: "bg-blue-100 text-blue-700 hover:bg-blue-100",
      under_officer_review: "bg-purple-100 text-purple-700 hover:bg-purple-100",
      forwarded_to_admin: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
      assigned_to_task_force: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100",
      assessment_in_progress:
        "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
      assessment_submitted: "bg-orange-100 text-orange-700 hover:bg-orange-100",
      resources_allocated: "bg-teal-100 text-teal-700 hover:bg-teal-100",
      resolution_in_progress: "bg-lime-100 text-lime-700 hover:bg-lime-100",
      resolution_submitted:
        "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
      resolved: "bg-green-100 text-green-700 hover:bg-green-100",
      closed: "bg-gray-100 text-gray-700 hover:bg-gray-100",
    };
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-700";

    return (
      <Badge
        variant="secondary"
        className={`${colorClass} border-0 font-medium capitalize whitespace-nowrap`}
      >
        {formatStatusLabel(status)}
      </Badge>
    );
  }

  function getPriorityColor(priority: string) {
    const priorityColors: Record<string, string> = {
      urgent: "bg-red-100 text-red-700 hover:bg-red-100/80",
      high: "bg-orange-100 text-orange-700 hover:bg-orange-100/80",
      medium: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
      low: "bg-gray-100 text-gray-700 hover:bg-gray-100/80",
    };
    return (
      <Badge
        variant="outline"
        className={`border-0 capitalize whitespace-nowrap ${priorityColors[priority] || "bg-gray-100 text-gray-700"}`}
      >
        {priority}
      </Badge>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border bg-red-50 p-6 text-red-600 flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <div>
          <p className="font-medium">Error loading issues</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-[1200px] mx-auto">
      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-indigo-500 rounded-sm" />
            <h3 className="font-bold text-slate-900 tracking-tight">
              Issues Filters
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg px-4"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 rounded-lg border-slate-200 ${
                showFilters ? "bg-slate-100" : ""
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? (
                <ChevronUp className="h-4 w-4 text-slate-600" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-600" />
              )}
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="md:col-span-4 lg:col-span-3 space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Search Keywords
              </label>
              <Input
                placeholder="Title, description..."
                className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-indigo-500 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="md:col-span-4 lg:col-span-3 space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-lg">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {dynamicCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-4 lg:col-span-3 space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Status
              </label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-lg text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {dynamicStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "All Statuses"
                        ? status
                        : formatStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-4 lg:col-span-3 space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Priority
              </label>
              <Select
                value={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-lg text-xs">
                  <SelectValue placeholder="All Priorities" />
                </SelectTrigger>
                <SelectContent>
                  {dynamicPriorities.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p === "All Priorities"
                        ? p
                        : p.charAt(0).toUpperCase() + p.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Table Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
        {filteredIssues.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileX className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium">No issues found</p>
            <p className="text-sm">
              {issues.length === 0
                ? "No issues have been submitted to your dashboard yet."
                : "Try adjusting your filters to find what you're looking for."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden space-y-4">
              {filteredIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="border rounded-lg p-4 bg-white space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">
                        {issue.case_id || `#${issue.id}`}
                      </p>
                      <h4 className="font-semibold text-sm truncate">
                        {issue.title}
                      </h4>
                    </div>
                    {getStatusBadge(issue.status)}
                  </div>
                  <p
                    className="text-sm text-muted-foreground line-clamp-2"
                    title={cleanupHtml(issue.description)}
                  >
                    {cleanupHtml(issue.description)}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex flex-col gap-1 text-left">
                      <span className="text-xs text-muted-foreground">
                        Priority
                      </span>
                      {getPriorityColor(issue.priority)}
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-xs text-muted-foreground">
                        Submitted
                      </span>
                      <span>{formatDate(issue.created_at)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9"
                      asChild
                      title="View Details"
                    >
                      <Link href={`${basePath}/${issue.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {!readOnly && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                          asChild
                          disabled={
                            ![
                              "submitted",
                              "rejected",
                              "under_officer_review",
                            ].includes(issue.status)
                          }
                          title="Edit Issue"
                        >
                          <Link href={`${basePath}/${issue.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => handleDelete(issue.id)}
                          disabled={
                            ![
                              "submitted",
                              "rejected",
                              "under_officer_review",
                            ].includes(issue.status) || deletingId === issue.id
                          }
                          title="Delete Issue"
                        >
                          {deletingId === issue.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table className="min-w-[700px] table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Id</TableHead>
                    <TableHead className="min-w-[170px]">Issue</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[100px]">Priority</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="text-right w-[160px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell
                        className="font-medium text-xs truncate max-w-[80px]"
                        title={issue.case_id || `#${issue.id}`}
                      >
                        {issue.case_id || `#${issue.id}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col max-w-[170px]">
                          <span
                            className="font-semibold text-sm truncate"
                            title={issue.title}
                          >
                            {issue.title}
                          </span>
                          <span
                            className="text-muted-foreground text-xs line-clamp-1"
                            title={cleanupHtml(issue.description)}
                          >
                            {cleanupHtml(issue.description)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm capitalize">
                        {issue.category}
                      </TableCell>
                      <TableCell>{getPriorityColor(issue.priority)}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell className="text-sm">
                        {formatDate(issue.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-slate-600 hover:text-indigo-700 hover:bg-indigo-50/50 border-slate-200"
                            asChild
                            title="View Details"
                          >
                            <Link href={`${basePath}/${issue.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          {!readOnly && (
                            <>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 border-indigo-100"
                                asChild
                                disabled={
                                  ![
                                    "submitted",
                                    "rejected",
                                    "under_officer_review",
                                  ].includes(issue.status)
                                }
                                title="Edit Issue"
                              >
                                <Link href={`${basePath}/${issue.id}/edit`}>
                                  <Pencil className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700 bg-red-50/50 border-red-100"
                                onClick={() => handleDelete(issue.id)}
                                disabled={
                                  ![
                                    "submitted",
                                    "rejected",
                                    "under_officer_review",
                                  ].includes(issue.status) ||
                                  deletingId === issue.id
                                }
                                title="Delete Issue"
                              >
                                {deletingId === issue.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
