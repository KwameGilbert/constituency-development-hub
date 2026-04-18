"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { AdminChartsData } from "@/lib/services/dashboard-service";

interface BudgetData {
  distribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

interface BudgetChartProps {
  chartsData: AdminChartsData | null;
  loading: boolean;
  error: string | null;
}

export function BudgetChart({ chartsData, loading, error }: BudgetChartProps) {
  const data: BudgetData | null = chartsData?.charts?.budgetDistribution
    ? { distribution: chartsData.charts.budgetDistribution }
    : null;

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="border-none shadow-sm h-[400px]">
            <CardHeader className="p-5">
              <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] bg-slate-50/50 rounded-2xl animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Budget Distribution Bar Chart */}
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
        <CardHeader className="bg-white/50 border-b border-slate-100/60 p-5">
          <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
            Budget Allocation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.distribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                  tickFormatter={(value) => `₵${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  formatter={(value: number) => `₵${value.toLocaleString()}`}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {data.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Budget Distribution Pie Chart */}
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden">
        <CardHeader className="bg-white/50 border-b border-slate-100/60 p-5">
          <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
            Budget Distribution Share
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  formatter={(value: number) => `₵${value.toLocaleString()}`}
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
    </div>
  );
}
