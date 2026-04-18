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
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
             <Card key={i} className="border-none shadow-sm h-[400px]">
               <CardHeader className="p-5">
                 <Skeleton className="h-6 w-48" />
               </CardHeader>
               <CardContent>
                 <Skeleton className="h-[300px] w-full rounded-2xl" />
               </CardContent>
             </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !chartsData) {
    return (
      <Card className="border-none shadow-sm bg-red-50 p-6">
        <div className="text-center text-red-600 font-bold">
           {error || "No chart analytics available"}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Status & Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues by Status */}
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between bg-white/50 border-b border-slate-100/60 p-5">
            <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
              Distribution by Status
            </CardTitle>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Reports</span>
               <Badge className="bg-slate-100 text-slate-600 border-none font-bold">
                {chartsData.charts.issueStatusDistribution.reduce((sum, item) => sum + item.value, 0)}
               </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[320px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartsData.charts.issueStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={115}
                    paddingAngle={5}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartsData.charts.issueStatusDistribution.map(
                      (entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                      ),
                    )}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={40}
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

        {/* Monthly Trends */}
        <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
          <CardHeader className="flex flex-row items-center justify-between bg-white/50 border-b border-slate-100/60 p-5">
            <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
              Resolution Trends
            </CardTitle>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 font-bold text-[10px] uppercase tracking-widest rounded-full">
               System Performance
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartsData.charts.monthlyTrends}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
                  <Legend verticalAlign="top" height={36} iconType="circle" 
                    formatter={(value) => <span className="text-[11px] font-bold text-slate-500">{value}</span>}
                  />
                  <Line
                    type="monotone"
                    dataKey="issues"
                    name="Issues Reported"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "#f59e0b" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    name="Issues Resolved"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                    activeDot={{ r: 6, strokeWidth: 2, fill: "#10b981" }}
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
            <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between bg-white/50 border-b border-slate-100/60 p-5">
                <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
                  Criticality Levels
                </CardTitle>
                <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold text-slate-400 capitalize bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">
                    Priority Analysis
                   </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[320px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartsData.charts.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={0}
                        outerRadius={115}
                        dataKey="value"
                        strokeWidth={0}
                      >
                        {chartsData.charts.categoryDistribution.map(
                          (entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />
                          ),
                        )}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={40}
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

            {/* Top Issue Categories */}
            <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
              <CardHeader className="flex flex-row items-center justify-between bg-white/50 border-b border-slate-100/60 p-5">
                <CardTitle className="text-lg font-bold text-slate-800 tracking-tight">
                  Prevalent Categories
                </CardTitle>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-lg uppercase tracking-widest">Top 10</span>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {chartsData.charts.categoryDistribution.map((cat, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm group"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-bold transition-all shadow-sm ${cat.value > 0 ? "bg-slate-900 text-amber-500" : "bg-slate-100 text-slate-400"}`}
                        >
                          {index + 1}
                        </span>
                        <span className="text-slate-700 font-bold tracking-tight group-hover:text-amber-600 transition-colors">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-4 w-1/3 justify-end">
                        <div className="h-2 w-full bg-slate-50 flex-1 rounded-full overflow-hidden shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${cat.value > 0 ? "bg-amber-500 shadow-sm shadow-amber-500/30" : "bg-slate-200"}`}
                            style={{
                              width: `${(cat.value / Math.max(...chartsData.charts.categoryDistribution!.map((c) => c.value))) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className="font-black text-slate-900 w-6 text-right text-xs">
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

const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${className}`}>
    {children}
  </span>
);
