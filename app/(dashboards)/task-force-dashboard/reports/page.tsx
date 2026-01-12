'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Download,
  FileText,
  PieChart,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { taskForceService, TeamMember, TaskForceReports } from '@/lib/services/task-force-service';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<TaskForceReports | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [reportPeriod, setReportPeriod] = useState('month');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsRes, teamRes] = await Promise.all([
          taskForceService.getReports(),
          taskForceService.getTeamMembers({ limit: 20 }),
        ]);

        if (reportsRes.success) {
          setReports(reportsRes.data);
        }
        if (teamRes.success) {
          setTeamMembers(teamRes.data.members);
        }
      } catch (error) {
        console.error('Failed to fetch reports data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate metrics from stats
  const statusBreakdown = reports ? [
    { value: 'pending', label: 'Pending Assessment', count: reports.status_distribution?.assigned_to_task_force || 0, color: 'yellow' },
    { value: 'in_progress', label: 'In Progress', count: (reports.status_distribution?.assessment_in_progress || 0) + (reports.status_distribution?.resolution_in_progress || 0), color: 'blue' },
    { value: 'resolved', label: 'Resolved', count: reports.status_distribution?.resolved || 0, color: 'green' },
    { value: 'closed', label: 'Closed', count: reports.status_distribution?.closed || 0, color: 'gray' },
  ] : [];

  const priorityBreakdown = reports ? [
    { level: 'urgent', name: 'Urgent', count: reports.priority_distribution?.urgent || 0, color: 'red' },
    { level: 'high', name: 'High', count: reports.priority_distribution?.high || 0, color: 'orange' },
    { level: 'medium', name: 'Medium', count: reports.priority_distribution?.medium || 0, color: 'yellow' },
    { level: 'low', name: 'Low', count: reports.priority_distribution?.low || 0, color: 'green' },
  ] : [];

  // Note: Category breakdown would need to be added to the API if needed
  const categoryBreakdown = reports?.category_distribution || [];

  const assessorPerformance = teamMembers.map(m => ({
    ...m,
    assignedIssues: m.assigned_count,
    completedIssues: m.completed_count,
  }));

  const totalIssues = reports?.total_issues || 0;

  const handleExportReport = () => {
    alert(`Exporting report for ${reportPeriod}`);
  };

  if (loading && !reports) {
    return (
      <div className="p-6 max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive assessment performance insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportReport} className="bg-purple-600 hover:bg-purple-700">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Issues</p>
                    <p className="text-2xl font-bold text-gray-900">{reports?.total_issues || 0}</p>
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
                    <p className="text-2xl font-bold text-gray-900">{reports?.resolved_issues || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-gray-900">{reports?.status_distribution?.assigned_to_task_force || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-red-100">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Urgent</p>
                    <p className="text-2xl font-bold text-gray-900">{reports?.priority_distribution?.urgent || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusBreakdown.map((status) => (
                    <div key={status.value} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full bg-${status.color}-500`}></div>
                        <span className="text-sm font-medium">{status.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{status.count}</span>
                        <Badge variant="outline">
                          {totalIssues > 0 ? ((status.count / totalIssues) * 100).toFixed(1) : 0}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Priority Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {priorityBreakdown.map((priority) => (
                    <div key={priority.level} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full bg-${priority.color}-500`}></div>
                        <span className="text-sm font-medium">{priority.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{priority.count}</span>
                        <Badge variant="outline">
                          {totalIssues > 0 ? ((priority.count / totalIssues) * 100).toFixed(1) : 0}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Issues by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryBreakdown.map((category) => (
                  <div key={category.name} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 capitalize">{category.name}</h4>
                      <Badge variant="outline">{category.count}</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{
                          width: `${Math.max((category.count / totalIssues) * 100, 5)}%`
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {totalIssues > 0 ? ((category.count / totalIssues) * 100).toFixed(1) : 0}% of total issues
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Assessor Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Assessor Performance
              </CardTitle>
              <CardDescription>
                Assessment activity and completion rates by assessor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assessorPerformance.map((assessor) => (
                  <div key={assessor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{assessor.name}</h4>
                        <p className="text-sm text-gray-600">{assessor.title || assessor.specialization || 'Task Force Member'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{assessor.assignedIssues}</p>
                        <p className="text-gray-600">Assigned</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">{assessor.completedIssues}</p>
                        <p className="text-gray-600">Completed</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900">
                          {assessor.assignedIssues > 0 
                            ? Math.round((assessor.completedIssues / assessor.assignedIssues) * 100)
                            : 0}%
                        </p>
                        <p className="text-gray-600">Rate</p>
                      </div>
                      <Badge 
                        className={
                          assessor.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }
                      >
                        {assessor.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {assessorPerformance.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No team members found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Trends Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Monthly Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Issues Submitted</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">+15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Assessment Speed</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">+8%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Resolution Rate</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">+5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Assessment Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Average Assessment Time</span>
                    <span className="font-medium">3.2 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Fastest Assessment</span>
                    <span className="font-medium">4 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Longest Assessment</span>
                    <span className="font-medium">12 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details" className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
              <CardDescription>Overall assessment statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{reports?.total_issues || 0}</p>
                  <p className="text-sm text-gray-600">Total Issues</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{reports?.resolved_issues || 0}</p>
                  <p className="text-sm text-gray-600">Resolved</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                  <p className="text-sm text-gray-600">Team Members</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">
                    {reports?.total_issues && reports.resolved_issues 
                      ? Math.round((reports.resolved_issues / reports.total_issues) * 100)
                      : 0}%
                  </p>
                  <p className="text-sm text-gray-600">Resolution Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}