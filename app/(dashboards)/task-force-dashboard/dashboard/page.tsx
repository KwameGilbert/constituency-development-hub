'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Search,
  Filter,
  FileText,
  Calendar,
  MapPin,
  User,
  ChevronRight,
  Plus,
  Download,
  Eye,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { 
  getIssues, 
  getStatistics, 
  getStatusColor, 
  getPriorityColor, 
  formatDate, 
  getRelativeTime, 
  getMetadata, 
  searchIssues, 
  getIssuesByStatus, 
  getIssuesByCategory 
} from '@/lib/data';
import Link from 'next/link';

function TaskForceMainDashboardPage() {
  // Load data from JSON files
  const stats = getStatistics();
  const allIssues = getIssues();
  const metadata = getMetadata();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter issues based on search and filters
  const filteredIssues = useMemo(() => {
    let issues = allIssues;

    if (searchTerm) {
      issues = searchIssues(searchTerm);
    }

    if (statusFilter !== 'all') {
      issues = issues.filter(issue => issue.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      issues = issues.filter(issue => issue.category === categoryFilter);
    }

    return issues;
  }, [searchTerm, statusFilter, categoryFilter, allIssues]);

  // Get recent issues (last 5)
  const recentIssues = useMemo(() => {
    return [...allIssues]
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
      .slice(0, 5);
  }, [allIssues]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessment Dashboard</h1>
          <p className="text-gray-600 mt-1">Review and assess community issues for parliamentary action</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
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
                <p className="text-sm font-medium text-gray-600">Pending Assessment</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingAssessment}</p>
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
                <p className="text-sm font-medium text-gray-600">Under Assessment</p>
                <p className="text-2xl font-bold text-gray-900">{stats.underAssessment}</p>
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
                <p className="text-sm font-medium text-gray-600">Assessed This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.assessedThisMonth}</p>
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
                <p className="text-sm font-medium text-gray-600">Total Assessed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAssessed}</p>
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
                  <Button variant="outline" size="sm">View All</Button>
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
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
                {filteredIssues.slice(0, 5).map((issue) => (
                  <div key={issue.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">{issue.title}</h4>
                        <Badge variant="outline" className={getStatusColor(issue.status)}>
                          {metadata.statuses.find(s => s.value === issue.status)?.label || issue.status}
                        </Badge>
                        <Badge className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {issue.community}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {issue.submittedBy}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(issue.submissionDate)}
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
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <FileText className="h-4 w-4 mr-2" />
                          Assess
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {filteredIssues.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No issues found matching your criteria.</p>
                </div>
              )}
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
                <span className="font-semibold">{stats.totalIssues}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Approved</span>
                <span className="font-semibold text-green-600">{stats.approvedIssues}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Rejected</span>
                <span className="font-semibold text-red-600">{stats.rejectedIssues}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium">{getRelativeTime(stats.lastUpdated)}</span>
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
                        {issue.community} • {getRelativeTime(issue.submissionDate)}
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
                    {stats.pendingAssessment} issues need urgent assessment
                  </AlertDescription>
                </Alert>
                <Link href="/task-force-dashboard/issues?status=pending_assessment">
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
