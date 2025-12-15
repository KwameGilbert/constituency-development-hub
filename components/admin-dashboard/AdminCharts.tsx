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
  AreaChart,
  Area
} from "recharts";

export function AdminCharts() {
  const pieData = [
    { name: "Pending", value: 0, color: "#fbbf24" }, // Amber
    { name: "Reviewed", value: 0, color: "#3b82f6" }, // Blue
    { name: "Approved", value: 1, color: "#10b981" }, // Emerald
    { name: "Rejected", value: 1, color: "#ef4444" }, // Red
    { name: "Resolved", value: 0, color: "#34d399" }, // Teal-ish
    { name: "In Progress", value: 0, color: "#8b5cf6" }, // Violet
  ];

  const lineData = [
    { name: "2025-09", total: 1, resolved: 0 },
    { name: "2025-10", total: 1, resolved: 0 },
  ];

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
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {pieData.map((entry, index) => (
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
                        data={lineData}
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
