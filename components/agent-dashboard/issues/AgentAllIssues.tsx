"use client";

import { useEffect, useState, useMemo } from "react";
import {
  ChevronUp,
  ChevronDown,
  RotateCcw,
  AlertCircle,
  FileX,
  Loader2,
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
import { cn, cleanupHtml } from "@/lib/utils";

// Status badge styling
const getStatusBadge = (status: string) => {
  const statusLower = status?.toLowerCase() || "";

  const statusConfig: Record<string, { className: string; label: string }> = {
    submitted: { className: "bg-blue-100 text-blue-700", label: "Submitted" },
    pending: { className: "bg-yellow-100 text-yellow-700", label: "Pending" },
    under_officer_review: {
      className: "bg-orange-100 text-orange-700",
      label: "Under Review",
    },
    forwarded_to_admin: {
      className: "bg-indigo-100 text-indigo-700",
      label: "Forwarded",
    },
    approved: { className: "bg-indigo-100 text-indigo-700", label: "Approved" },
    assigned_to_task_force: {
      className: "bg-purple-100 text-purple-700",
      label: "Assigned",
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
    label: status || "Unknown",
  };

  return (
    <Badge
      variant="secondary"
      className={`${config.className} hover:${config.className}/80 border-0`}
    >
      {config.label}
    </Badge>
  );
};

// Categories for filter
const CATEGORIES = [
  "All Categories",
  "Infrastructure",
  "Health",
  "Education",
  "Economic Empowerment",
  "Water & Sanitation",
  "Security",
  "Environment",
  "Social Services",
  "Other",
];

// Statuses for filter
const STATUSES = [
  "All Statuses",
  "Submitted",
  "Pending",
  "Under Review",
  "Approved",
  "In Progress",
  "Resolved",
  "Rejected",
];

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
        issue.location?.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory =
        categoryFilter === "All Categories" ||
        issue.category?.toLowerCase() === categoryFilter.toLowerCase();

      // Status filter
      const matchesStatus =
        statusFilter === "All Statuses" ||
        issue.status
          ?.toLowerCase()
          .includes(statusFilter.toLowerCase().replace(" ", "_"));

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
      {/* Filter Section */}
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold leading-none tracking-tight">
            Filter Issues
          </h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Search</label>
              <Input
                placeholder="Search by title, description, or location..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Category
                </label>
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="gap-2"
                onClick={resetFilters}
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filters
              </Button>
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
                    <Button variant="outline" size="sm" className="flex-1" asChild>
                      <Link href={`/agents-dashboard/issues/${issue.id}`}>
                        View
                      </Link>
                    </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={() => setEditingIssue(issue)}
                        disabled={!['submitted', 'pending', 'rejected'].includes(issue.status)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDelete(issue.id)}
                        disabled={!['submitted', 'pending', 'rejected'].includes(issue.status) || deletingId === issue.id}
                      >
                        {deletingId === issue.id ? <Loader2 className="h-3 w-3 animate-spin mx-auto"/> : "Delete"}
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
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead className="min-w-[170px]">TITLE & DESCRIPTION</TableHead>
                    <TableHead className="w-[160px]">CATEGORY</TableHead>
                    <TableHead className="w-[150px]">STATUS</TableHead>
                    <TableHead className="w-[120px]">DATE</TableHead>
                    <TableHead className="text-right w-[180px]">ACTIONS</TableHead>
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
                            size="sm"
                            className="h-8 px-2 text-indigo-600 hover:text-indigo-700"
                            asChild
                          >
                            <Link href={`/agents-dashboard/issues/${issue.id}`}>
                              View
                            </Link>
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-blue-600 hover:text-blue-700"
                            onClick={() => setEditingIssue(issue)}
                            disabled={!['submitted', 'pending', 'rejected'].includes(issue.status)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(issue.id)}
                            disabled={!['submitted', 'pending', 'rejected'].includes(issue.status) || deletingId === issue.id}
                          >
                            {deletingId === issue.id ? <Loader2 className="h-3 w-3 animate-spin"/> : "Delete"}
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
