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

export function AgentStatusDistribution({ stats }: AgentStatusDistributionProps) {
  const data = [
    { name: "Pending", value: stats?.pending || 0, color: "#EAB308" }, // yellow-500
    // Consolidated 'Reviewed' into Pending/In Progress or Approved depending on definition. 
    // For now based on AgentController logic: pending = submitted/undef_review
    { name: "Approved", value: stats?.approved || 0, color: "#22C55E" }, // green-500
    { name: "Rejected", value: stats?.rejected || 0, color: "#EF4444" }, // red-500
    { name: "Resolved", value: stats?.resolved || 0, color: "#3B82F6" }, // blue-500 (swapped color to blue for resolved to be distinct from approved green)
  ];

  // Filter out zero values to avoid cluttered chart if needed, or keep them.
  // Recharts handles 0 values fine (doesn't render slice).

  const hasData = data.some(d => d.value > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Issue Status Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
            {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
                    No data available
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
