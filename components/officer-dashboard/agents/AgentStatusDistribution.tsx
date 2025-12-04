"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
    { name: "Pending", value: 0, color: "#EAB308" }, // yellow-500
    { name: "Reviewed", value: 0, color: "#3B82F6" }, // blue-500
    { name: "Approved", value: 1, color: "#22C55E" }, // green-500
    { name: "Rejected", value: 1, color: "#EF4444" }, // red-500
    { name: "Resolved", value: 0, color: "#6B7280" }, // gray-500
];

export function AgentStatusDistribution() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">Issue Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
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
                </div>
            </CardContent>
        </Card>
    );
}
