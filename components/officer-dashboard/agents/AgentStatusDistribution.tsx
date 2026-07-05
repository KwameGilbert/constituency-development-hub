"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { AgentStatistics } from "@/lib/services/agent-service";

interface AgentStatusDistributionProps {
  stats?: AgentStatistics | null;
}

export function AgentStatusDistribution({
  stats,
}: AgentStatusDistributionProps) {
  const data = [
    { name: "In Review", value: stats?.pending || 0, color: "#f59e0b" }, // amber-500
    { name: "Validated", value: stats?.approved || 0, color: "#10b981" }, // emerald-500
    { name: "Discarded", value: stats?.rejected || 0, color: "#f43f5e" }, // rose-500
    { name: "Completed", value: stats?.resolved || 0, color: "#6366f1" }, // indigo-500
  ];

  const hasData = data.some((d) => d.value > 0);

  return (
    <Card className="border border-slate-200 shadow-sm rounded-xl overflow-hidden bg-white">
      <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-4 py-3">
        <CardTitle className="text-xs font-semibold text-slate-700">
          Report Status
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-[180px] w-full">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={6}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
                    padding: "8px 12px",
                  }}
                  itemStyle={{ fontWeight: "medium", fontSize: "11px" }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={32}
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => (
                    <span className="text-[11px] font-semibold text-slate-600 pl-1">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col h-full items-center justify-center text-slate-400 gap-2">
              <span className="text-xs text-slate-400 font-medium">
                No Reports Submitted
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
