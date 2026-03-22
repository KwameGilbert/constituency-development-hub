"use client";

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
import { AdminChartsData } from "@/lib/services/dashboard-service";

interface AnalyticsChartsProps {
  chartsData: AdminChartsData | null;
  loading: boolean;
  error: string | null;
}

export function AnalyticsCharts({
  chartsData,
  loading,
  error,
}: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full bg-gray-100 rounded-lg animate-pulse"></div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  if (error || !chartsData) {
    return (
      <div className="space-y-6">
        <Card className="col-span-full">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              {error || "No charts data available"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Status & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">
              Issues by Status
            </CardTitle>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
              Total:{" "}
              {chartsData.charts.issueStatusDistribution.reduce(
                (sum, item) => sum + item.value,
                0,
              )}
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartsData.charts.issueStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartsData.charts.issueStatusDistribution.map(
                      (entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-gray-800">
              Monthly Trends
            </CardTitle>
            <span className="text-xs text-blue-100 bg-blue-600 px-2 py-1 rounded-full">
              Last 12 Months
            </span>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartsData.charts.monthlyTrends}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line
                    type="monotone"
                    dataKey="issues"
                    name="Issues Created"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Issues Resolved"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#fff" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Severity & Categories */}
      {chartsData.charts.categoryDistribution &&
        chartsData.charts.categoryDistribution.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues by Severity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-gray-800">
                  Issues by Severity
                </CardTitle>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                  Priority Analysis
                </span>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartsData.charts.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {chartsData.charts.categoryDistribution.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Issue Categories */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold text-gray-800">
                  Top Issue Categories
                </CardTitle>
                <span className="text-xs text-gray-500">Top 10</span>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartsData.charts.categoryDistribution.map((cat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center text-xs font-medium text-white ${cat.value > 0 ? "bg-indigo-600" : "bg-indigo-400"}`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-2 w-1/3 justify-end">
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${cat.value > 0 ? "bg-indigo-600" : "bg-gray-300"}`}
                            style={{
                              width: `${(cat.value / Math.max(...chartsData.charts.categoryDistribution!.map((c) => c.value))) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-800 w-4 text-right">
                          {cat.value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
    </div>
  );
}
