"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  RotateCcw,
  AlertCircle,
  FileX,
  Loader2,
  Eye,
  Pencil,
  Trash2,
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
import { agentService, AgentReport } from "@/lib/services/agent-service";
import Link from "next/link";
import { AgentEditIssueDialog } from "./AgentEditIssueDialog";
import { toast } from "sonner";
import { cleanupHtml } from "@/lib/utils";

// Helper to format status names
const formatStatusLabel = (status: string) => {
  if (!status) return "";
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Status badge styling
const getStatusBadge = (status: string) => {
  const statusLower = status?.toLowerCase() || "";

  const statusConfig: Record<string, { className: string; label: string }> = {
    submitted: { className: "bg-blue-100 text-blue-700", label: "Submitted" },
    pending: { className: "bg-yellow-100 text-yellow-700", label: "Pending" },
    under_officer_review: {
      className: "bg-orange-100 text-orange-700",
      label: "Under Officer Review",
    },
    forwarded_to_admin: {
      className: "bg-indigo-100 text-indigo-700",
      label: "Forwarded To Admin",
    },
    approved: { className: "bg-indigo-100 text-indigo-700", label: "Approved" },
    assigned_to_task_force: {
      className: "bg-purple-100 text-purple-700",
      label: "Assigned To Task Force",
    },
    in_progress: {
      className: "bg-purple-100 text-purple-700",
      label: "In Progress",
    },
    resolved: { className: "bg-green-100 text-green-700", label: "Resolved" },
    closed: { className: "bg-gray-100 text-gray-700", label: "Closed" },
    rejected: { className: "bg-red-100 text-red-700", label: "Rejected" },
  };

  const config = statusConfig[statusLower] || {
    className: "bg-gray-100 text-gray-700",
    label: formatStatusLabel(statusLower),
  };

  return (
    <Badge
      variant="secondary"
      className={`${config.className} hover:${config.className}/80 border-0 font-medium`}
    >
      {config.label}
    </Badge>
  );
};

export function AgentAllIssues() {
  const [issues, setIssues] = useState<AgentReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  // Action states
  const [editingIssue, setEditingIssue] = useState<AgentReport | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Dynamic filter options derived from data to ensure accuracy
  const dynamicCategories = useMemo(() => {
    const cats = new Set(issues.filter(i => i.category).map(i => i.category));
    return ["All Categories", ...Array.from(cats)].sort();
  }, [issues]);

  const dynamicStatuses = useMemo(() => {
    const stats = new Set(issues.filter(i => i.status).map(i => i.status));
    return ["All Statuses", ...Array.from(stats)].sort();
  }, [issues]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this issue? This action cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const response = await agentService.deleteIssue(id);
      if (response.success) {
        toast.success("Issue deleted successfully");
        setIssues(issues.filter(i => i.id !== id));
      } else {
        toast.error(response.message || "Failed to delete issue");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete issue");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle edit success
  const handleEditSuccess = (updatedIssue: AgentReport) => {
    setIssues(issues.map(i => i.id === updatedIssue.id ? updatedIssue : i));
  };

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await agentService.getMyReports();

        if (response.success && response.data?.reports) {
          setIssues(response.data.reports);
        } else {
          setError(response.message || "Failed to fetch issues");
        }
      } catch (err) {
        setError("Failed to load issues");
        console.error("Error fetching agent issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Filter issues based on search and filters
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        issue.title?.toLowerCase().includes(searchLower) ||
        issue.description?.toLowerCase().includes(searchLower) ||
        issue.community?.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory =
        categoryFilter === "All Categories" ||
        issue.category === categoryFilter;

      // Status filter
      const matchesStatus =
        statusFilter === "All Statuses" ||
        issue.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [issues, searchQuery, categoryFilter, statusFilter]);

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Statuses");
  };

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
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 border-b border-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 bg-amber-500 rounded-sm" />
            <h3 className="font-bold text-slate-900 tracking-tight">
              Issues Filters
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg px-4"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-2" />
              Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`h-8 w-8 rounded-lg border-slate-200 ${showFilters ? 'bg-slate-100' : ''}`}
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
            <div className="md:col-span-6 space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Search Keywords</label>
              <Input
                placeholder="Title, description, or community..."
                className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-amber-500 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-lg">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {dynamicCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200 focus:bg-white rounded-lg text-xs">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  {dynamicStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "All Statuses" ? status : formatStatusLabel(status)}
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
                ? "You haven't submitted any issues yet."
                : "Try adjusting your filters."}
            </p>
            {issues.length === 0 && (
              <Link href="/agents-dashboard/issues/add">
                <Button className="mt-4">Submit New Issue</Button>
              </Link>
            )}
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
                  <p className="text-sm text-muted-foreground line-clamp-2" title={cleanupHtml(issue.description)}>
                    {cleanupHtml(issue.description)}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">
                        Category
                      </span>
                      <span className="font-medium">{issue.category}</span>
                    </div>
                    <div className="flex flex-col gap-1 text-right">
                      <span className="text-xs text-muted-foreground">
                        Submitted
                      </span>
                      <span>{formatDate(issue.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 h-9" asChild title="View Details">
                      <Link href={`/agents-dashboard/issues/${issue.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => setEditingIssue(issue)}
                        disabled={!['submitted', 'pending', 'rejected'].includes(issue.status)}
                        title="Edit Issue"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 h-9 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(issue.id)}
                        disabled={!['submitted', 'pending', 'rejected'].includes(issue.status) || deletingId === issue.id}
                        title="Delete Issue"
                      >
                        {deletingId === issue.id ? <Loader2 className="h-4 w-4 animate-spin mx-auto"/> : <Trash2 className="h-4 w-4" />}
                      </Button>
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
                    <TableHead className="w-[160px]">Category</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead className="text-right w-[180px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium text-xs truncate max-w-[80px]" title={issue.case_id || `#${issue.id}`}>
                        {issue.case_id || `#${issue.id}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col max-w-[170px]">
                          <span className="font-semibold text-sm truncate" title={issue.title}>{issue.title}</span>
                          <span className="text-muted-foreground text-xs line-clamp-1" title={cleanupHtml(issue.description)}>
                            {cleanupHtml(issue.description)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{issue.category}</TableCell>
                      <TableCell>{getStatusBadge(issue.status)}</TableCell>
                      <TableCell className="text-sm">{formatDate(issue.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                           <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 border-indigo-100"
                            asChild
                            title="View Details"
                          >
                            <Link href={`/agents-dashboard/issues/${issue.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 bg-blue-50/50 border-blue-100"
                            onClick={() => setEditingIssue(issue)}
                            disabled={!['submitted', 'pending', 'rejected'].includes(issue.status)}
                            title="Edit Issue"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 bg-red-50/50 border-red-100"
                            onClick={() => handleDelete(issue.id)}
                            disabled={!['submitted', 'pending', 'rejected'].includes(issue.status) || deletingId === issue.id}
                            title="Delete Issue"
                          >
                            {deletingId === issue.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                          </Button>
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
      
      {editingIssue && (
        <AgentEditIssueDialog
          issue={editingIssue}
          open={!!editingIssue}
          onOpenChange={(open) => !open && setEditingIssue(null)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
