"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Pie, PieChart, Label } from "recharts"
import { Loader2, AlertCircle } from "lucide-react"
import { issuesService } from "@/lib/services/issues-service"

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

interface ChartDataItem {
    status: string
    count: number
    fill: string
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
    submitted: {
        label: "Submitted",
        color: "#3b82f6", // Blue 500
    },
    under_review: {
        label: "Under Review",
        color: "#8b5cf6", // Violet 500
    },
    in_progress: {
        label: "In Progress",
        color: "#f59e0b", // Amber 500
    },
} satisfies ChartConfig

export function IssuesByStatus() {
    const [loading, setLoading] = useState(true)
    const [chartData, setChartData] = useState<ChartDataItem[]>([])
    const [error, setError] = useState(false)

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await issuesService.getStatistics()
                if (response.success && response.data) {
                    const stats = response.data
                    const byStatus = stats.by_status || {}
                    
                    // Build chart data from status breakdown
                    const data: ChartDataItem[] = []
                    
                    const resolved = (byStatus.resolved || 0) + (byStatus.closed || 0)
                    const pending = (byStatus.submitted || 0) + (byStatus.under_officer_review || 0) + (byStatus.forwarded_to_admin || 0)
                    const inProgress = (byStatus.resolution_in_progress || 0) + (byStatus.assessment_in_progress || 0) + (byStatus.assigned_to_task_force || 0)
                    
                    if (resolved > 0) {
                        data.push({ status: "resolved", count: resolved, fill: "#22c55e" })
                    }
                    if (pending > 0) {
                        data.push({ status: "submitted", count: pending, fill: "#3b82f6" })
                    }
                    if (inProgress > 0) {
                        data.push({ status: "in_progress", count: inProgress, fill: "#f59e0b" })
                    }
                    
                    // If no data, show placeholder
                    if (data.length === 0) {
                        data.push({ status: "submitted", count: 0, fill: "#3b82f6" })
                    }
                    
                    setChartData(data)
                }
            } catch (err) {
                console.error("Failed to fetch issue statistics:", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    const totalIssues = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.count, 0)
    }, [chartData])

    if (loading) {
        return (
            <Card className="flex flex-col border-none shadow-md">
                <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[350px]">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </CardContent>
                <CardHeader className="items-center pb-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Issues by Status</CardTitle>
                </CardHeader>
            </Card>
        )
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
                    <CardTitle className="text-sm font-medium text-muted-foreground">Issues by Status</CardTitle>
                </CardHeader>
            </Card>
        )
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
