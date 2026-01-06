"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import {
  AlertCircle,
  Users,
  FolderKanban,
  DollarSign,
  Clock,
  CheckCircle,
  UserPlus,
  List,
  TrendingUp,
  TrendingDown
} from "lucide-react";

interface MetricsData {
  metrics: {
    totalIssues: number;
    activeStaff: number;
    totalProjects: number;
    activeBudget: number;
    newIssuesThisWeek: number;
    resolvedThisWeek: number;
    activeUsers7Days: number;
    ongoingProjects: number;
  };
  trends: {
    issuesChange: number;
    staffChange: number;
    projectsChange: number;
    budgetChange: number;
    newIssuesChange: number;
    resolvedChange: number;
    activeUsersChange: number;
    ongoingProjectsChange: number;
  };
}

export function AnalyticsMetrics() {
  const [metricsData, setMetricsData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await axios.get('/data/admin-analytics-metrics.json');
        setMetricsData(response.data);
      } catch (err) {
        setError('Failed to load metrics data');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const TrendIndicator = ({ change }: { change: number }) => {
    const isPositive = change >= 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600' : 'text-red-600';

    return (
      <div className={`flex items-center gap-1 text-xs ${color}`}>
        <Icon className="w-3 h-3" />
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Row 1: Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 flex items-center space-x-4 border-none shadow-sm bg-white">
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Row 2: Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-4 flex items-center justify-between shadow-sm animate-pulse">
              <div>
                <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !metricsData) {
    return (
      <div className="space-y-6">
        <Card className="col-span-full p-6">
          <div className="text-center text-red-600">
            {error || 'No metrics data available'}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Issues */}
        <Card className="p-4 flex items-center space-x-4 border-none shadow-sm bg-white">
          <div className="p-3 rounded-lg bg-red-100 text-red-600">
             <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Total Issues</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-800">{metricsData.metrics.totalIssues}</h3>
              <TrendIndicator change={metricsData.trends.issuesChange} />
            </div>
          </div>
        </Card>

        {/* Active Staff */}
        <Card className="p-4 flex items-center space-x-4 border-none shadow-sm bg-white">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Active Staff</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-800">{metricsData.metrics.activeStaff}</h3>
              <TrendIndicator change={metricsData.trends.staffChange} />
            </div>
          </div>
        </Card>

        {/* Total Projects */}
        <Card className="p-4 flex items-center space-x-4 border-none shadow-sm bg-white">
          <div className="p-3 rounded-lg bg-green-100 text-green-600">
             <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Total Projects</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-800">{metricsData.metrics.totalProjects}</h3>
              <TrendIndicator change={metricsData.trends.projectsChange} />
            </div>
          </div>
        </Card>

        {/* Active Budget */}
        <Card className="p-4 flex items-center space-x-4 border-none shadow-sm bg-white">
          <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
             <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase">Active Budget</p>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold text-gray-800">{formatCurrency(metricsData.metrics.activeBudget)}</h3>
              <TrendIndicator change={metricsData.trends.budgetChange} />
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* New Issues This Week */}
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-yellow-400 bg-yellow-50 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-yellow-800">New Issues This Week</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl font-bold text-yellow-900">{metricsData.metrics.newIssuesThisWeek}</h3>
              <TrendIndicator change={metricsData.trends.newIssuesChange} />
            </div>
          </div>
          <div className="p-2 bg-yellow-400 rounded-full text-white">
            <Clock className="w-4 h-4" />
          </div>
        </Card>

        {/* Resolved This Week */}
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-green-400 bg-green-50 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-green-800">Resolved This Week</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl font-bold text-green-900">{metricsData.metrics.resolvedThisWeek}</h3>
              <TrendIndicator change={metricsData.trends.resolvedChange} />
            </div>
          </div>
          <div className="p-2 bg-green-400 rounded-full text-white">
            <CheckCircle className="w-4 h-4" />
          </div>
        </Card>

        {/* Active Users (7 days) */}
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-blue-400 bg-blue-50 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-blue-800">Active Users (7 days)</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl font-bold text-blue-900">{metricsData.metrics.activeUsers7Days}</h3>
              <TrendIndicator change={metricsData.trends.activeUsersChange} />
            </div>
          </div>
          <div className="p-2 bg-blue-400 rounded-lg text-white">
            <UserPlus className="w-4 h-4" />
          </div>
        </Card>

        {/* Ongoing Projects */}
        <Card className="p-4 flex items-center justify-between border-l-4 border-l-purple-400 bg-purple-50 shadow-sm">
          <div>
            <p className="text-xs font-semibold text-purple-800">Ongoing Projects</p>
            <div className="flex items-center gap-2 mt-1">
              <h3 className="text-2xl font-bold text-purple-900">{metricsData.metrics.ongoingProjects}</h3>
              <TrendIndicator change={metricsData.trends.ongoingProjectsChange} />
            </div>
          </div>
          <div className="p-2 bg-purple-200 text-purple-700 rounded-lg">
            <List className="w-4 h-4" />
          </div>
        </Card>
      </div>
    </div>
  );
}
