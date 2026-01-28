"use client";

import React, { useState, useEffect } from "react";
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
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  FileText,
  Clock,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  taskForceService,
  TaskForceIssue,
} from "@/lib/services/task-force-service";
import {
  getStatusColor,
  getPriorityColor,
  formatDate,
  getMetadata,
} from "@/lib/data";

export default function PendingIssuesPage() {
  const metadata = getMetadata();

  const [issues, setIssues] = useState<TaskForceIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    highPriority: 0,
    overdue: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch pending issues
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await taskForceService.getAllTaskForceIssues({
          status: "assigned_to_task_force",
          // search: searchTerm || undefined, // Search not yet supported in taskForceService endpoint params directly unless added
          priority: priorityFilter !== "all" ? priorityFilter : undefined,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          limit: 50,
        });

        if (response.success) {
          let fetchedIssues = response.data.issues;

          // Client-side search for now (or update backend to support search)
          if (searchTerm) {
            fetchedIssues = fetchedIssues.filter(
              (i) =>
                i.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                i.description.toLowerCase().includes(searchTerm.toLowerCase()),
            );
          }

          setIssues(fetchedIssues);

          // Calculate stats
          const allIssues = response.data.issues;
          const highPriority = allIssues.filter(
            (i) => i.priority === "high" || i.priority === "urgent",
          ).length;
          const overdue = allIssues.filter((i) => {
            const daysSince = Math.floor(
              (new Date().getTime() - new Date(i.created_at).getTime()) /
                (1000 * 60 * 60 * 24),
            );
            return daysSince >= 7;
          }).length;

          setStats({
            total: response.data.pagination.total,
            highPriority,
            overdue,
          });
        }
      } catch (error) {
        console.error("Failed to fetch pending issues:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchData, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, priorityFilter, categoryFilter]);

  const getDaysSinceSubmission = (createdAt: string) => {
    return Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) /
        (1000 * 60 * 60 * 24),
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Issues</h1>
          <p className="text-gray-600 mt-1">
            Issues awaiting assessment - {issues.length} of {stats.total} issues
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Pending
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.highPriority}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Overdue (7+ days)
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.overdue}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pending issues..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Priority Filter */}
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                {metadata.priorities.map((priority) => (
                  <SelectItem key={priority.level} value={priority.level}>
                    {priority.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
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
        </CardContent>
      </Card>

      {/* Issues List */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Issues</CardTitle>
          <CardDescription>
            Issues requiring immediate assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : issues.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No pending issues found matching your criteria</p>
              </div>
            ) : (
              issues.map((issue) => {
                const daysSinceSubmission = getDaysSinceSubmission(
                  issue.created_at,
                );
                const isOverdue = daysSinceSubmission >= 7;

                return (
                  <div
                    key={issue.id}
                    className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                      isOverdue ? "border-red-200 bg-red-50" : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900">
                                {issue.title}
                              </h3>
                              {isOverdue && (
                                <Badge className="bg-red-100 text-red-800">
                                  Overdue ({daysSinceSubmission} days)
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {issue.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-3">
                              <Badge
                                variant="outline"
                                className={getStatusColor(issue.status)}
                              >
                                Pending Assessment
                              </Badge>
                              <Badge
                                className={getPriorityColor(issue.priority)}
                              >
                                {issue.priority} Priority
                              </Badge>
                              <Badge variant="outline">{issue.category}</Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {issue.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {issue.reporter_name || "Anonymous"}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDate(issue.created_at)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/task-force-dashboard/issues/${issue.id}`}
                            >
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Link
                              href={`/task-force-dashboard/assess/${issue.id}`}
                            >
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Assess Now
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
