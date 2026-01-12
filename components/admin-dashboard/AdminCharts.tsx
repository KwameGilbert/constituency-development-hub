"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { dashboardService } from "@/lib/services/dashboard-service";

interface ChartData {
  issuesStatusDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  monthlyTrends: Array<{
    name: string;
    total: number;
    resolved: number;
  }>;
}

export function AdminCharts() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await dashboardService.getAdminCharts();
        
        if (response.success && response.data?.charts) {
          // Transform API response to component format
          const transformedData: ChartData = {
            issuesStatusDistribution: response.data.charts.issueStatusDistribution || [],
            monthlyTrends: (response.data.charts.monthlyTrends || []).map(item => ({
              name: item.name,
              total: item.issues,
              resolved: item.resolved,
            })),
          };
          setChartData(transformedData);
        } else {
          setError(response.message || 'Failed to load chart data');
        }
      } catch (err) {
        setError('Failed to load chart data');
        console.error('Error fetching chart data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-gray-100 rounded-lg animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              {error || 'No chart data available'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Issues Status Distribution */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold text-gray-800">Issues Status Distribution</CardTitle>
          <a href="#" className="text-sm text-blue-600 hover:underline">View All →</a>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.issuesStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {chartData.issuesStatusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-gray-600 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trends */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">Monthly Trends</CardTitle>
            <a href="#" className="text-sm text-blue-600 hover:underline flex items-center">
                Detailed Analytics 
            </a>
        </CardHeader>
        <CardContent>
            <div className="h-[300px] w-full bg-white rounded-lg">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData.monthlyTrends}
                        margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                        />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} iconType="circle" />
                        <Line type="monotone" dataKey="total" name="Total Issues" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="resolved" name="Resolved Issues" stroke="#10b981" strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
                        {/* Area for fill effect if desired, but Line matches image better */}
                    </LineChart>
                 </ResponsiveContainer>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
