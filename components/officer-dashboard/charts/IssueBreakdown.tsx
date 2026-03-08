"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts";
import { Loader2, AlertCircle } from "lucide-react";
import { officerReportsService } from "@/lib/services/officer-reports-service";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataItem {
  label: string;
  count: number;
  fill: string;
}

const categoryColors: Record<string, string> = {
  infrastructure: "#334155", // Slate 700
  health: "#0d9488", // Teal 600
  education: "#2563eb", // Blue 600
  security: "#4f46e5", // Indigo 600
  environment: "#059669", // Emerald 600
  social: "#7c3aed", // Violet 600
  economic: "#0891b2", // Cyan 600
  other: "#64748b", // Slate 500
};

const priorityColors: Record<string, string> = {
  urgent: "#dc2626", // Red 600
  high: "#ea580c", // Orange 600
  medium: "#d97706", // Amber 600
  low: "#16a34a", // Green 600
};

const chartConfig = {
  count: {
    label: "Count",
  },
} satisfies ChartConfig;

export interface IssueBreakdownProps {
  data?: {
    categoryData: ChartDataItem[];
    priorityData: ChartDataItem[];
  };
  enableAutoFetch?: boolean;
}

export function IssueBreakdown({
  data: providedData,
  enableAutoFetch = true,
}: IssueBreakdownProps) {
  const [activeTab, setActiveTab] = React.useState<"category" | "priority">(
    "category",
  );
  const [loading, setLoading] = useState(!providedData && enableAutoFetch);
  const [error, setError] = useState(false);
  const [categoryData, setCategoryData] = useState<ChartDataItem[]>(
    providedData?.categoryData || [],
  );
  const [priorityData, setPriorityData] = useState<ChartDataItem[]>(
    providedData?.priorityData || [],
  );

  useEffect(() => {
    if (providedData) {
      setCategoryData(providedData.categoryData);
      setPriorityData(providedData.priorityData);
      setLoading(false);
      return;
    }

    if (!enableAutoFetch) return;

    async function fetchStats() {
      try {
        const response = await officerReportsService.getBreakdown();
        if (response.success && response.data) {
          const stats = response.data;

          const catData: ChartDataItem[] = [];
          
          if (stats.issues_by_category && stats.issues_by_category.length > 0) {
            stats.issues_by_category.forEach((categoryOption) => {
              if (categoryOption.count > 0) {
                const label = categoryOption.name
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase());
                catData.push({
                  label: label.length > 12 ? label.substring(0, 12) + "..." : label,
                  count: categoryOption.count as number,
                  fill: categoryColors[categoryOption.name.toLowerCase()] || categoryColors.other,
                });
              }
            });
          }
          setCategoryData(
            catData.length > 0
              ? catData.slice(0, 5)
              : [{ label: "No Data", count: 0, fill: "#64748b" }],
          );

          const byPriority: Record<string, number> = stats.issues_by_priority || {};
          const priData: ChartDataItem[] = [];
          Object.entries(byPriority).forEach(([priority, count]) => {
            if (typeof count === 'number' && count > 0) {
              priData.push({
                label: priority.charAt(0).toUpperCase() + priority.slice(1),
                count: count,
                fill: priorityColors[priority.toLowerCase()] || "#64748b",
              });
            }
          });
          const priorityOrder = ["urgent", "high", "medium", "low"];
          priData.sort((a, b) => {
            const aIndex = priorityOrder.indexOf(a.label.toLowerCase());
            const bIndex = priorityOrder.indexOf(b.label.toLowerCase());
            return aIndex - bIndex;
          });
          setPriorityData(
            priData.length > 0
              ? priData
              : [{ label: "No Data", count: 0, fill: "#64748b" }],
          );
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

  const data = activeTab === "category" ? categoryData : priorityData;

  if (loading) {
    return (
      <Card className="border-none shadow-md shadow-slate-200/50 overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-900 tracking-tight">
            Issues Breakdown <span className="text-amber-600 text-[10px] ml-1">Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md shadow-slate-200/50 overflow-hidden">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 py-4 px-6 flex flex-row items-center justify-between gap-4">
        <CardTitle className="text-sm font-semibold text-slate-900 tracking-tight min-w-0">
          Issues Breakdown <span className="text-amber-600 ml-1 capitalize">{activeTab}</span>
        </CardTitle>
        <div className="flex items-center shrink-0 space-x-1 bg-slate-200/50 p-1 rounded-full">
          <button
            onClick={() => setActiveTab("category")}
            className={`h-7 px-4 text-xs font-medium rounded-full transition-all ${activeTab === "category" ? "bg-slate-900 text-white shadow-sm" : "hover:bg-slate-300/50 text-slate-600"}`}
          >
            Category
          </button>
          <button
            onClick={() => setActiveTab("priority")}
            className={`h-7 px-4 text-xs font-medium rounded-full transition-all ${activeTab === "priority" ? "bg-slate-900 text-white shadow-sm" : "hover:bg-slate-300/50 text-slate-600"}`}
          >
            Priority
          </button>
        </div>
      </CardHeader>
      <CardContent className="pt-8 px-6">
        {error ? (
          <div className="flex flex-col items-center justify-center min-h-[250px] text-slate-400">
             <AlertCircle className="h-8 w-8 mx-auto mb-2 text-red-400" />
             <p className="text-sm font-medium">Unable to load data</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={12}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }}
                tickFormatter={(value) => value}
              />
              <ChartTooltip
                cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                content={<ChartTooltipContent />}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
