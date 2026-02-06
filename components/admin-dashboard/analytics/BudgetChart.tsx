"use client";

import { useState, useEffect } from "react";
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
import { dashboardService } from "@/lib/services/dashboard-service";

interface BudgetData {
  distribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export function BudgetChart() {
  const [data, setData] = useState<BudgetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboardService.getAdminCharts();
        if (response.success && response.data?.charts?.budgetDistribution) {
          setData({
            distribution: response.data.charts.budgetDistribution,
          });
        }
      } catch (err) {
        console.error("Failed to load budget data", err);
        setError("Failed to load budget data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-gray-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (error || !data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Budget Distribution Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Allocation (Projects vs Issues)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.distribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => `₵${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number) =>
                    `₵${value.toLocaleString()}`
                  }
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Budget Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Distribution Share</CardTitle>
        </CardHeader>
        <CardContent>
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
                >
                  {data.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `₵${value.toLocaleString()}`
                  }
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
