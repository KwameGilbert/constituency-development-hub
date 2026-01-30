"use client";

import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  FileText,
  Calendar,
  MapPin,
  User,
  Download,
  Eye,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  getStatusColor,
  getPriorityColor,
  formatDate,
  getRelativeTime,
  getMetadata,
} from "@/lib/data";
import {
  issuesService,
  Issue as ApiIssue,
  IssueStatistics as ApiStatistics,
} from "@/lib/services/issues-service";
import Link from "next/link";
import * as XLSX from "xlsx";

function TaskForceMainDashboardPage() {
  const metadata = getMetadata();

  const [stats, setStats] = useState<ApiStatistics | null>(null);
  const [filteredIssues, setFilteredIssues] = useState<ApiIssue[]>([]);
  const [recentIssues, setRecentIssues] = useState<ApiIssue[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch stats and recent issues (for sidebar)
        const [statsRes, recentRes, filteredRes] = await Promise.all([
          issuesService.getStatistics(),
          issuesService.getAllIssues({ limit: 5 }), // Recent global
          issuesService.getAllIssues({
            // Filtered for main view
            search: searchTerm,
            status: statusFilter !== "all" ? statusFilter : undefined,
            category: categoryFilter !== "all" ? categoryFilter : undefined,
            limit: 5, // Dashboard only shows top 5 of filtered results
          }),
        ]);

        if (statsRes.success) {
          setStats(statsRes.data);
        }

        if (recentRes.success) {
          setRecentIssues(recentRes.data.reports);
        }

        if (filteredRes.success) {
          setFilteredIssues(filteredRes.data.reports);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, categoryFilter]);

  const handleExportReports = () => {
    const dataToExport = filteredIssues.length > 0 ? filteredIssues : [];

    if (dataToExport.length === 0) {
      // Could show a toast here if we had one set up
      return;
    }

    const exportData = dataToExport.map((issue) => ({
      ID: issue.id,
      Title: issue.title,
      Status: issue.status,
      Priority: issue.priority,
      Category: issue.category,
      Location: issue.location,
      Reporter: issue.reporter_name || "Anonymous",
      Date: formatDate(issue.created_at),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reports");
    XLSX.writeFile(workbook, "Task_Force_Reports.xlsx");
  };

  if (loading && !stats) {
    return (
      <div className="flex h-screen items-center justify-center p-6">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Assessment Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Review and assess community issues for parliamentary action
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportReports}
          >
            <Download className="h-4 w-4" />
            Export Reports
          </Button>
          <Link href="/task-force-dashboard/issues">
            <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
              <Eye className="h-4 w-4" />
              View All Issues
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Pending Assessment
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.by_status?.["assigned_to_task_force"] || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Under Assessment
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.by_status?.["assessment_in_progress"] || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.resolved || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Issues
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Issues Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Issues Overview
                <Link href="/task-force-dashboard/issues">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </CardTitle>
              <CardDescription>
                Recent community issues submitted for assessment
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
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
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
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

              {/* Issues List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                  </div>
                ) : filteredIssues.length > 0 ? (
                  filteredIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {issue.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={getStatusColor(issue.status)}
                          >
                            {metadata.statuses.find(
                              (s) => s.value === issue.status,
                            )?.label || issue.status}
                          </Badge>
                          <Badge className={getPriorityColor(issue.priority)}>
                            {issue.priority}
                          </Badge>
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
                        <Link href={`/task-force-dashboard/issues/${issue.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/task-force-dashboard/assess/${issue.id}`}>
                          <Button
                            size="sm"
                            className="bg-purple-600 hover:bg-purple-700"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Assess
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No issues found matching your criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Issues</span>
                <span className="font-semibold">{stats?.total || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resolved</span>
                <span className="font-semibold text-green-600">
                  {stats?.resolved || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-yellow-600">
                  {stats?.pending || 0}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">Just now</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentIssues.map((issue) => (
                  <div key={issue.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {issue.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {issue.location} • {getRelativeTime(issue.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Items */}
          <Card>
            <CardHeader>
              <CardTitle>Action Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {stats?.by_priority?.["urgent"] || 0} urgent issues need
                    attention
                  </AlertDescription>
                </Alert>
                <Link href="/task-force-dashboard/issues?status=assigned_to_task_force">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <Clock className="h-4 w-4 mr-2" />
                    Review Pending Issues
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default TaskForceMainDashboardPage;
