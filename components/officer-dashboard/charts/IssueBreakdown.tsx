"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, Cell } from "recharts"
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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

interface ChartDataItem {
    label: string
    count: number
    fill: string
}

const categoryColors: Record<string, string> = {
    infrastructure: "#ef4444", // Red 500
    health: "#3b82f6", // Blue 500
    education: "#f97316", // Orange 500
    security: "#8b5cf6", // Violet 500
    environment: "#22c55e", // Green 500
    social: "#6366f1", // Indigo 500
    economic: "#2dd4bf", // Teal 400
    other: "#6b7280", // Gray 500
}

const priorityColors: Record<string, string> = {
    urgent: "#ef4444", // Red 500
    high: "#f97316", // Orange 500
    medium: "#eab308", // Yellow 500
    low: "#22c55e", // Green 500
}

const chartConfig = {
    count: {
        label: "Count",
    },
} satisfies ChartConfig

export interface IssueBreakdownProps {
    data?: {
        categoryData: ChartDataItem[]
        priorityData: ChartDataItem[]
    }
}

export function IssueBreakdown({ data: providedData }: IssueBreakdownProps) {
    const [activeTab, setActiveTab] = React.useState<"category" | "priority">("category")
    const [loading, setLoading] = useState(!providedData)
    const [error, setError] = useState(false)
    const [categoryData, setCategoryData] = useState<ChartDataItem[]>(providedData?.categoryData || [])
    const [priorityData, setPriorityData] = useState<ChartDataItem[]>(providedData?.priorityData || [])

    useEffect(() => {
        if (providedData) {
            setCategoryData(providedData.categoryData)
            setPriorityData(providedData.priorityData)
            setLoading(false)
            return
        }

        async function fetchStats() {
            try {
                const response = await issuesService.getStatistics()
                if (response.success && response.data) {
                    const stats = response.data
                    
                    // Build category data - need to infer from generic stats or fetch separately
                    // For now, if by_status exists, we can create a simple breakdown
                    // Ideally the API would return by_category, but we work with what we have
                    const catData: ChartDataItem[] = []
                    const byStatus = stats.by_status || {}
                    
                    // Since we don't have category breakdown from API, we'll create placeholder
                    // based on available data or show total as single bar
                    if (stats.total > 0) {
                        // Try to show meaningful data - for now use status as categories
                        Object.entries(byStatus).forEach(([status, count]) => {
                            if (count > 0) {
                                const label = status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
                                catData.push({
                                    label: label.length > 12 ? label.substring(0, 12) + "..." : label,
                                    count: count,
                                    fill: categoryColors[status.toLowerCase()] || categoryColors.other
                                })
                            }
                        })
                    }
                    setCategoryData(catData.length > 0 ? catData.slice(0, 5) : [{ label: "No Data", count: 0, fill: "#6b7280" }])
                    
                    // Build priority data
                    const byPriority = stats.by_priority || {}
                    const priData: ChartDataItem[] = []
                    Object.entries(byPriority).forEach(([priority, count]) => {
                        if (count > 0) {
                            priData.push({
                                label: priority.charAt(0).toUpperCase() + priority.slice(1),
                                count: count,
                                fill: priorityColors[priority.toLowerCase()] || "#6b7280"
                            })
                        }
                    })
                    // Sort by priority order
                    const priorityOrder = ["urgent", "high", "medium", "low"]
                    priData.sort((a, b) => {
                        const aIndex = priorityOrder.indexOf(a.label.toLowerCase())
                        const bIndex = priorityOrder.indexOf(b.label.toLowerCase())
                        return aIndex - bIndex
                    })
                    setPriorityData(priData.length > 0 ? priData : [{ label: "No Data", count: 0, fill: "#6b7280" }])
                }
            } catch (err) {
                console.error("Failed to fetch issue statistics:", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [providedData])

    const data = activeTab === "category" ? categoryData : priorityData

    if (loading) {
        return (
            <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <CardTitle className="text-base font-normal">Issues Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[250px]">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
                    <CardTitle className="text-base font-normal">Issues Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center min-h-[250px]">
                    <div className="text-center text-gray-500">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                        <p>Unable to load chart</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

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
                        Status
                    </Button>
                    <Button
                        variant={activeTab === "priority" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab("priority")}
                        className={`h-7 px-3 text-xs rounded-md ${activeTab === "priority" ? "bg-[#312e81] hover:bg-[#312e81]/90 text-white" : "hover:bg-transparent"}`}
                    >
                        Priority
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
