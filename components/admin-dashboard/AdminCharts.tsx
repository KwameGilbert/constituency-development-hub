"use client";

import Link from "next/link";
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

interface AdminChartsProps {
  chartsData: AdminChartsData | null;
  loading: boolean;
  error: string | null;
}

const UI_COLORS = {
  amber: "#f59e0b",
  emerald: "#10b981",
  blue: "#3b82f6",
  slate: "#64748b",
  red: "#ef4444",
};

export function AdminCharts({ chartsData, loading, error }: AdminChartsProps) {
  const chartData: ChartData | null = chartsData?.charts
    ? {
        issuesStatusDistribution:
          chartsData.charts.issueStatusDistribution || [],
        monthlyTrends: (chartsData.charts.monthlyTrends || []).map((item) => ({
          name: item.name,
          total: item.issues,
          resolved: item.resolved,
        })),
      }
    : null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {[1, 2].map((i) => (
          <Card key={i} className="border-none shadow-sm h-[400px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-6 bg-slate-100 rounded animate-pulse w-48"></div>
              <div className="h-4 bg-slate-100 rounded animate-pulse w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full bg-slate-50/50 rounded-2xl animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !chartData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card className="border-none shadow-sm">
          <CardContent className="p-6">
            <div className="text-center text-red-500 font-medium">
              {error || "No chart data available"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white/50 border-b border-slate-100/60 p-5">
          <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
            Issues Status Distribution
          </CardTitle>
          <Link
            href="/admin-dashboard/issues"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full transition-all"
          >
            Manage Issues
          </Link>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.issuesStatusDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {chartData.issuesStatusDistribution.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                    fontWeight: "600",
                    padding: "10px 16px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  formatter={(value) => (
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider ml-1">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2 bg-white/50 border-b border-slate-100/60 p-5">
          <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
            Monthly Resolution Trends
          </CardTitle>
          <Link
            href="/admin-dashboard/analytics"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full transition-all"
          >
            Full Report
          </Link>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData.monthlyTrends}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 600 }}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Submissions"
                  stroke={UI_COLORS.amber}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: UI_COLORS.amber }}
                />
                <Line
                  type="monotone"
                  dataKey="resolved"
                  name="Resolutions"
                  stroke={UI_COLORS.emerald}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6, strokeWidth: 2, fill: UI_COLORS.emerald }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
