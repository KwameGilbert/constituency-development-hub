"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Eye,
  MapPin,
  Calendar,
  User,
  ArrowUpRight,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  getStatusColor,
  getPriorityColor,
  formatDate,
  getMetadata,
} from "@/lib/data";
import {
  taskForceService,
  TaskForceIssue,
} from "@/lib/services/task-force-service";
import { cleanupHtml } from "@/lib/utils";

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "high":
      return <AlertTriangle className="h-4 w-4" />;
    case "medium":
      return <Clock className="h-4 w-4" />;
    case "low":
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "approved":
      return <CheckCircle className="h-4 w-4" />;
    case "rejected":
      return <XCircle className="h-4 w-4" />;
    case "under_assessment":
      return <Clock className="h-4 w-4" />;
    default:
      return <AlertTriangle className="h-4 w-4" />;
  }
};

export default function IssuesPage() {
  const metadata = getMetadata();

  const [allIssues, setAllIssues] = useState<TaskForceIssue[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch a reasonable limit of issues to allow client-side filtering/counting
        const response = await taskForceService.getAllTaskForceIssues({
          limit: 100,
        });
        if (response.success) {
          setAllIssues(response.data.issues);
        }
      } catch (error) {
        console.error("Failed to fetch issues:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter issues based on search and filters
  const filteredIssues = useMemo(() => {
    let filtered = allIssues;

    // Filter by tab
    if (activeTab === "pending") {
      filtered = filtered.filter((issue) =>
        ["assigned_to_task_force", "submitted", "pending_assessment"].includes(
          issue.status,
        ),
      );
    } else if (activeTab === "under-assessment") {
      filtered = filtered.filter((issue) =>
        ["assessment_in_progress", "under_review"].includes(issue.status),
      );
    } else if (activeTab === "assessments-added") {
      filtered = filtered.filter(
        (issue) => issue.status === "assessment_submitted",
      );
    } else if (activeTab === "completed") {
      filtered = filtered.filter(
        (issue) => issue.status === "resolved" || issue.status === "closed",
      );
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (issue) =>
          issue.title.toLowerCase().includes(searchLower) ||
          issue.description.toLowerCase().includes(searchLower) ||
          issue.location?.toLowerCase().includes(searchLower) ||
          issue.reporter_name?.toLowerCase().includes(searchLower),
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((issue) => issue.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((issue) => issue.priority === priorityFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((issue) => issue.category === categoryFilter);
    }

    return filtered;
  }, [
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    activeTab,
    allIssues,
  ]);

  const getTabCount = (tab: string) => {
    switch (tab) {
      case "all":
        return allIssues.length;
      case "pending":
        return allIssues.filter((issue) =>
          [
            "assigned_to_task_force",
            "submitted",
            "pending_assessment",
          ].includes(issue.status),
        ).length;
      case "under-assessment":
        return allIssues.filter((issue) =>
          ["assessment_in_progress", "under_review"].includes(issue.status),
        ).length;
      case "assessments-added":
        return allIssues.filter(
          (issue) => issue.status === "assessment_submitted",
        ).length;
      case "completed":
        return allIssues.filter(
          (issue) => issue.status === "resolved" || issue.status === "closed",
        ).length;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">All Issues</h1>
          <p className="text-slate-600 mt-1">
            Comprehensive view of all constituency issues and their status
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search issues by title, description, location, or submitter..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {metadata.statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              {metadata.priorities.map((priority) => (
                <SelectItem key={priority.level} value={priority.level}>
                  {priority.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {metadata.categories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Issues Display */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="relative">
            All Issues
            <Badge variant="secondary" className="ml-2">
              {getTabCount("all")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="relative">
            Pending
            <Badge variant="secondary" className="ml-2">
              {getTabCount("pending")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="under-assessment" className="relative">
            Under Assessment
            <Badge variant="secondary" className="ml-2">
              {getTabCount("under-assessment")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="assessments-added" className="relative">
            Assessments Added
            <Badge variant="secondary" className="ml-2">
              {getTabCount("assessments-added")}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed" className="relative">
            Completed
            <Badge variant="secondary" className="ml-2">
              {getTabCount("completed")}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 className="h-10 w-10 text-amber-600 animate-spin" />
              </div>
            ) : filteredIssues.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No Issues Found
                </h3>
                <p className="text-slate-600">
                  {searchTerm ||
                  statusFilter !== "all" ||
                  priorityFilter !== "all" ||
                  categoryFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No issues have been submitted yet"}
                </p>
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const isRejected = issue.status === "rejected";
                const isRevision = issue.status === "needs_revision";
                const isPendingAssessment =
                  issue.status === "assigned_to_task_force";

                return (
                  <Card
                    key={issue.id}
                    className={`
                    border-none shadow-md shadow-slate-200/50 hover:shadow-lg transition-all duration-300
                    ${isRejected ? "shadow-red-100 bg-red-50/10" : ""}
                    ${isRevision ? "shadow-orange-100 bg-orange-50/10" : ""}
                    ${isPendingAssessment ? "shadow-indigo-100 bg-indigo-50/10" : ""}
                  `}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {isRejected && (
                            <div className="flex items-center gap-1 text-red-600 text-xs font-bold uppercase tracking-wider mb-1">
                              <AlertTriangle className="h-3 w-3" />
                              Assessment Rejected
                            </div>
                          )}
                          {isRevision && (
                            <div className="flex items-center gap-1 text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
                              <AlertTriangle className="h-3 w-3" />
                              Revision Requested
                            </div>
                          )}
                          {isPendingAssessment && (
                            <div className="flex items-center gap-1 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
                              <Clock className="h-3 w-3" />
                              Ready for Assessment
                            </div>
                          )}
                          <CardTitle className="text-lg leading-tight mb-1">
                            {issue.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={getStatusColor(issue.status)}
                            >
                              <div className="flex items-center gap-1">
                                {getStatusIcon(issue.status)}
                                {metadata.statuses.find(
                                  (s) => s.value === issue.status,
                                )?.label ||
                                  issue.status
                                    .split("_")
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1),
                                    )
                                    .join(" ")}
                              </div>
                            </Badge>
                            <Badge className={getPriorityColor(issue.priority)}>
                              <div className="flex items-center gap-1">
                                {getPriorityIcon(issue.priority)}
                                {issue.priority}
                              </div>
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4 line-clamp-3">
                        {cleanupHtml(issue.description)}
                      </CardDescription>

                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span>{issue.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-slate-400" />
                          <span>{issue.reporter_name || "Anonymous"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{formatDate(issue.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-slate-400" />
                          <span>{issue.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100/60">
                        <div className="flex items-center gap-2">
                          {/* Budget display removed as it is not part of TaskForceIssue */}
                        </div>
                        <div className="flex items-center gap-1">
                          <Link
                            href={`/task-force-dashboard/issues/${issue.id}`}
                          >
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          {[
                            "submitted",
                            "pending_assessment",
                            "assigned_to_task_force",
                            "assessment_in_progress",
                            "under_review",
                          ].includes(issue.status) && (
                            <Link
                              href={`/task-force-dashboard/assess/${issue.id}`}
                            >
                              <Button variant="outline" size="sm">
                                Assess
                              </Button>
                            </Link>
                          )}
                          <ArrowUpRight className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
