"use client"

import * as React from "react"
import { Pie, PieChart, Label } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { status: "approved", count: 1, fill: "var(--color-approved)" },
    { status: "rejected", count: 1, fill: "var(--color-rejected)" },
]

const chartConfig = {
    count: {
        label: "Issues",
    },
    approved: {
        label: "Approved",
        color: "#4f46e5", // Indigo 600
    },
    rejected: {
        label: "Rejected",
        color: "#312e81", // Indigo 900
    },
} satisfies ChartConfig

export function IssuesByStatus() {
    const totalIssues = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0)
    }, [])

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
                                                {/* Empty center as per image, or could put total */}
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                        <ChartLegend content={<ChartLegendContent nameKey="status" />} className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardHeader className="items-center pb-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">Issues by Status</CardTitle>
            </CardHeader>
        </Card>
    )
}
