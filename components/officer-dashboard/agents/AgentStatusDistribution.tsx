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
    { name: "In Review", value: stats?.pending || 0, color: "#f59e0b" }, // amber-500
    { name: "Validated", value: stats?.approved || 0, color: "#10b981" }, // emerald-500
    { name: "Discarded", value: stats?.rejected || 0, color: "#f43f5e" }, // rose-500
    { name: "Completed", value: stats?.resolved || 0, color: "#6366f1" }, // indigo-500
  ];

  const hasData = data.some(d => d.value > 0);

  return (
    <Card className="border-slate-200/60 shadow-xl shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
      <CardHeader className="border-b border-slate-50 bg-slate-50/30 pb-4">
        <CardTitle className="text-sm font-bold text-slate-900 uppercase tracking-widest pl-1 font-mono">
          Strategic Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="h-[300px] w-full">
            {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
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
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  itemStyle={{ fontWeight: 'bold', fontSize: '12px' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1">{value}</span>}
                />
                </PieChart>
            </ResponsiveContainer>
            ) : (
                <div className="flex flex-col h-full items-center justify-center text-slate-400 gap-4">
                    <div className="p-4 bg-slate-50 rounded-full">
                       <PieChart className="h-8 w-8 text-slate-200" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest font-mono">No Active Telemetry</span>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
