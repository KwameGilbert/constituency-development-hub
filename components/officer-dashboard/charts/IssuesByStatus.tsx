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
    color: "#22c55e", // Green 500
  },
  closed: {
    label: "Closed",
    color: "#6b7280", // Gray 500
  },
  in_progress: {
    label: "In Progress",
    color: "#f59e0b", // Amber 500
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

          // Map distribution items to chart data format
          // Filter and map distribution items to chart data format
          const allowedStatuses = ["resolved", "closed", "resolution_in_progress", "in_progress"];
          const data: ChartDataItem[] = distribution
            .filter((item) => allowedStatuses.includes(item.status))
            .map((item) => {
              // Map resolution_in_progress to in_progress to match chartConfig
              const statusKey = item.status === "resolution_in_progress" ? "in_progress" : item.status;
              return {
                status: statusKey,
                count: item.value,
                fill: item.status === "resolution_in_progress" ? chartConfig.in_progress.color : item.color,
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
      <Card className="flex flex-col border-none shadow-md">
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[350px]">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Issues by Status
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="flex flex-col border-none shadow-md">
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[350px]">
          <div className="text-center text-gray-500">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load chart</p>
          </div>
        </CardContent>
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Issues by Status
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col border-none shadow-md">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
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
              innerRadius={80}
              strokeWidth={5}
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
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalIssues}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
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
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Issues by Status
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
