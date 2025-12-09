"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

const categoryData = [
    { label: "Economic", count: 3, fill: "#2dd4bf" }, // Teal 400
    { label: "Health", count: 8, fill: "#3b82f6" }, // Blue 500
    { label: "Social Services", count: 4, fill: "#6366f1" }, // Indigo 500
    { label: "Education", count: 7, fill: "#f97316" }, // Orange 500
    { label: "Infrastructure", count: 3, fill: "#ef4444" }, // Red 500
]

const severityData = [
    { label: "Medium", count: 2, fill: "#eab308" }, // Yellow 500
    { label: "Critical", count: 6, fill: "#ef4444" }, // Red 500
    { label: "Low", count: 5, fill: "#22c55e" }, // Green 500
    { label: "High", count: 3, fill: "#f97316" }, // Orange 500
]

const chartConfig = {
    count: {
        label: "Count",
    },
} satisfies ChartConfig

export function IssueBreakdown() {
    const [activeTab, setActiveTab] = React.useState<"category" | "severity">("category")

    const data = activeTab === "category" ? categoryData : severityData

    return (
        <Card className="border-none shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                <CardTitle className="text-base font-normal">Issues Breakdown</CardTitle>
                <div className="flex items-center space-x-1 bg-muted/50 p-1 rounded-lg">
                    <Button
                        variant={activeTab === "category" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("category")}
                        className={`h-7 px-3 text-xs rounded-md ${activeTab === "category" ? "bg-[#312e81] hover:bg-[#312e81]/90 text-white" : "hover:bg-transparent"}`}
                    >
                        Category
                    </Button>
                    <Button
                        variant={activeTab === "severity" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("severity")}
                        className={`h-7 px-3 text-xs rounded-md ${activeTab === "severity" ? "bg-[#312e81] hover:bg-[#312e81]/90 text-white" : "hover:bg-transparent"}`}
                    >
                        Severity
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="max-h-[250px] w-full">
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={80}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
