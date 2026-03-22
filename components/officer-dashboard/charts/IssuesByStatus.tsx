"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Pie, PieChart, Label } from "recharts";
import { Loader2, AlertCircle } from "lucide-react";
import { officerReportsService } from "@/lib/services/officer-reports-service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataItem {
  status: string;
  count: number;
  fill: string;
}

const chartConfig = {
  count: {
    label: "Issues",
  },
  resolved: {
    label: "Resolved",
    color: "#10b981", // Emerald 500
  },
  closed: {
    label: "Closed",
    color: "#64748b", // Slate 500
  },
  in_progress: {
    label: "In Progress",
    color: "#f59e0b", // Amber 500
  },
  submitted: {
    label: "Submitted",
    color: "#3b82f6", // Blue 500
  },
  pending: {
    label: "Pending",
    color: "#eab308", // Yellow 500
  },
} satisfies ChartConfig;

export interface IssuesByStatusProps {
  data?: ChartDataItem[];
  enableAutoFetch?: boolean;
}

export function IssuesByStatus({
  data: providedData,
  enableAutoFetch = true,
}: IssuesByStatusProps) {
  const [loading, setLoading] = useState(!providedData && enableAutoFetch);
  const [chartData, setChartData] = useState<ChartDataItem[]>(
    providedData || [],
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    if (providedData) {
      setChartData(providedData);
      setLoading(false);
      return;
    }

    if (!enableAutoFetch) return;

    async function fetchStats() {
      try {
        const response = await officerReportsService.getStatusDistribution();
        if (response.success && response.data) {
          const distribution = response.data.distribution || [];

          const data: ChartDataItem[] = distribution.map((item) => {
            return {
              status:
                item.name.length > 15
                  ? item.name.substring(0, 15) + "..."
                  : item.name,
              count: item.value,
              fill: item.color,
            };
          });

          setChartData(data);
        }
      } catch (err) {
        console.error("Failed to fetch issue statistics:", err);

        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [providedData, enableAutoFetch]);

  const totalIssues = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.count, 0);
  }, [chartData]);

  if (loading) {
    return (
      <Card className="flex flex-col border-none shadow-md shadow-slate-200/50 overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
          <CardTitle className="text-sm font-extrabold text-slate-900 tracking-tight uppercase">
            Issues by Status{" "}
            <span className="text-indigo-500 ml-1">. Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[350px]">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border-none shadow-md shadow-slate-200/50 overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6">
        <CardTitle className="text-sm font-semibold text-slate-900 tracking-tight">
          Issues by Status{" "}
          <span className="text-indigo-600 text-[10px] ml-1">Distribution</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-4 pt-6">
        {error ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
            <p className="text-sm font-medium">Unable to load chart</p>
          </div>
        ) : chartData.length === 0 || totalIssues === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-slate-400">
            <p className="text-sm font-medium">No status data available</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="mx-auto w-full min-h-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                strokeWidth={0}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-slate-900 text-3xl font-semibold"
                          >
                            {totalIssues}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-slate-500 text-[10px] font-medium tracking-wide"
                          >
                            Total
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="status" />}
                className="flex-wrap gap-4 justify-center mt-4"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
