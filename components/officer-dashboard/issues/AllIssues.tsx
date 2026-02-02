"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronUp, RotateCcw, Search, Eye, Loader2, ArrowRight } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";
import {
  issuesService,
  Issue,
  IssueFilters,
} from "@/lib/services/issues-service";
import Link from "next/link";

interface AllIssuesProps {
  /**
   * If true, the component renders in read-only mode for admins.
   */
  readOnly?: boolean;
}

export function AllIssues({ readOnly = false }: AllIssuesProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  const basePath = readOnly
    ? "/admin-dashboard/issues"
    : "/officer-dashboard/issues";

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    try {
      const filters: IssueFilters = {
        page: currentPage,
        limit: 10,
      };

      if (searchQuery) filters.search = searchQuery;
      if (selectedStatus !== "all") filters.status = selectedStatus;
      if (selectedCategory !== "all") filters.category = selectedCategory;
      if (selectedPriority !== "all") filters.priority = selectedPriority;

      const response = await issuesService.getAllIssues(filters);
      if (response && response.success && response.data.reports) {
        setIssues(response.data.reports);
        setTotalPages(Math.ceil(response.data.total / response.data.limit));
      } else {
        setIssues([]);
      }
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchQuery,
    selectedStatus,
    selectedCategory,
    selectedPriority,
  ]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  function handleSearch() {
    setCurrentPage(1);
    fetchIssues();
  }

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedCategory("all");
    setSelectedPriority("all");
    setCurrentPage(1);
    fetchIssues();
  }

  function getStatusColor(status: string) {
    const statusColors: Record<string, string> = {
      submitted: "bg-blue-100 text-blue-700 hover:bg-blue-100/80",
      under_officer_review:
        "bg-purple-100 text-purple-700 hover:bg-purple-100/80",
      forwarded_to_admin:
        "bg-indigo-100 text-indigo-700 hover:bg-indigo-100/80",
      assigned_to_task_force: "bg-cyan-100 text-cyan-700 hover:bg-cyan-100/80",
      assessment_in_progress:
        "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
      assessment_submitted:
        "bg-orange-100 text-orange-700 hover:bg-orange-100/80",
      resources_allocated: "bg-teal-100 text-teal-700 hover:bg-teal-100/80",
      resolution_in_progress: "bg-lime-100 text-lime-700 hover:bg-lime-100/80",
      resolution_submitted:
        "bg-emerald-100 text-emerald-700 hover:bg-emerald-100/80",
      resolved: "bg-green-100 text-green-700 hover:bg-green-100/80",
      closed: "bg-gray-100 text-gray-700 hover:bg-gray-100/80",
    };
    return statusColors[status] || "bg-gray-100 text-gray-700";
  }

  function getPriorityColor(priority: string) {
    const priorityColors: Record<string, string> = {
      urgent: "bg-red-100 text-red-700 hover:bg-red-100/80",
      high: "bg-orange-100 text-orange-700 hover:bg-orange-100/80",
      medium: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100/80",
      low: "bg-gray-100 text-gray-700 hover:bg-gray-100/80",
    };
    return priorityColors[priority] || "bg-gray-100 text-gray-700";
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
            <ChevronUp
              className={`h-4 w-4 transition-transform ${
                !showFilters ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {showFilters && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Search
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search by title, description, or location..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} className="gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FilterSelect
                label="Status"
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                  { value: "all", label: "All Statuses" },
                  { value: "submitted", label: "Submitted" },
                  { value: "under_officer_review", label: "Under Review" },
                  { value: "forwarded_to_admin", label: "Forwarded to Admin" },
                  {
                    value: "assigned_to_task_force",
                    label: "Assigned to Task Force",
                  },
                  { value: "resolved", label: "Resolved" },
                  { value: "closed", label: "Closed" },
                ]}
              />
              <FilterSelect
                label="Category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "infrastructure", label: "Infrastructure" },
                  { value: "health", label: "Health" },
                  { value: "education", label: "Education" },
                  { value: "security", label: "Security" },
                  { value: "environment", label: "Environment" },
                ]}
              />
              <FilterSelect
                label="Priority"
                value={selectedPriority}
                onChange={setSelectedPriority}
                options={[
                  { value: "all", label: "All Priorities" },
                  { value: "urgent", label: "Urgent" },
                  { value: "high", label: "High" },
                  { value: "medium", label: "Medium" },
                  { value: "low", label: "Low" },
                ]}
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleResetFilters}
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
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="ml-3 text-gray-500">Loading issues...</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No issues found</p>
          </div>
        ) : (
          <>
            {/* Desktop View: Table */}
            <div className="hidden lg:block overflow-x-auto">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">CASE ID</TableHead>
                    <TableHead className="min-w-[250px]">TITLE & DESCRIPTION</TableHead>
                    <TableHead className="w-[140px]">CATEGORY</TableHead>
                    <TableHead className="w-[100px]">PRIORITY</TableHead>
                    <TableHead className="w-[160px]">STATUS</TableHead>
                    <TableHead className="w-[100px]">DATE</TableHead>
                    <TableHead className="text-right w-[80px]">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium text-sm text-gray-600 truncate max-w-[140px]" title={issue.case_id || `#${issue.id}`}>
                        {issue.case_id || `#${issue.id}`}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col max-w-[300px]">
                          <span className="font-semibold text-gray-900 truncate" title={issue.title}>
                            {issue.title}
                          </span>
                          <span className="text-muted-foreground text-sm truncate" title={issue.description?.replace(/<[^>]*>/g, "")}>
                            {issue.description?.replace(/<[^>]*>/g, "")}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">
                          {issue.category}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`border-0 ${getPriorityColor(
                            issue.priority
                          )}`}
                        >
                          {issue.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                           <Badge
                            variant="outline"
                            className={`border-0 whitespace-nowrap ${getStatusColor(issue.status)}`}
                          >
                            {issue.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="link"
                          className="h-auto p-0 text-indigo-600 hover:text-indigo-700"
                          asChild
                        >
                          <Link href={`${basePath}/${issue.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View: Cards */}
            <div className="lg:hidden space-y-4">
              {issues.map((issue) => (
                <Card key={issue.id} className="border border-slate-200">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-xs text-slate-500">
                          {issue.case_id || `#${issue.id}`}
                        </p>
                        <h4 className="font-semibold text-base text-slate-900 line-clamp-1">
                          {issue.title}
                        </h4>
                      </div>
                      <Badge
                        variant="outline"
                        className={`border-0 whitespace-nowrap ${getPriorityColor(
                          issue.priority
                        )}`}
                      >
                        {issue.priority}
                      </Badge>
                    </div>

                    <p className="text-sm text-slate-600 line-clamp-2">
                      {issue.description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 font-medium">
                        {issue.category}
                      </span>
                      <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-600">
                        {new Date(issue.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-2">
                      <Badge
                        variant="outline"
                        className={`border-0 ${getStatusColor(issue.status)}`}
                      >
                        {issue.status.replace(/_/g, " ")}
                      </Badge>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                        asChild
                      >
                        <Link href={`${basePath}/${issue.id}`}>
                          View Details <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full border border-slate-200 rounded-md">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
