"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Hourglass, ThumbsUp, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { issuesService } from "@/lib/services/issues-service";

interface Metric {
    label: string;
    value: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
}

export function MetricsCards() {
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState<Metric[]>([]);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await issuesService.getStatistics();
                if (response.success && response.data) {
                    const stats = response.data;
                    setMetrics([
                        {
                            label: "Total Issues",
                            value: String(stats.total || 0),
                            icon: FileText,
                            color: "text-blue-600",
                            bgColor: "bg-blue-100",
                        },
                        {
                            label: "Pending",
                            value: String(stats.by_status?.submitted || 0),
                            icon: Hourglass,
                            color: "text-orange-600",
                            bgColor: "bg-orange-100",
                        },
                        {
                            label: "Under Review",
                            value: String(stats.by_status?.under_officer_review || 0),
                            icon: ThumbsUp,
                            color: "text-indigo-600",
                            bgColor: "bg-indigo-100",
                        },
                        {
                            label: "In Progress",
                            value: String(stats.by_status?.resolution_in_progress || 0),
                            icon: Loader2,
                            color: "text-purple-600",
                            bgColor: "bg-purple-100",
                        },
                        {
                            label: "Resolved",
                            value: String(stats.by_status?.resolved || 0),
                            icon: CheckCircle,
                            color: "text-green-600",
                            bgColor: "bg-green-100",
                        },
                        {
                            label: "Closed",
                            value: String(stats.by_status?.closed || 0),
                            icon: XCircle,
                            color: "text-gray-600",
                            bgColor: "bg-gray-100",
                        },
                    ]);
                }
            } catch (error) {
                console.error("Failed to fetch issue statistics:", error);
                // Fallback to empty metrics
                setMetrics([]);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="border-none shadow-md animate-pulse">
                        <CardContent className="px-4 py-4 flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-gray-200 h-11 w-11" />
                            <div className="space-y-2">
                                <div className="h-3 w-16 bg-gray-200 rounded" />
                                <div className="h-5 w-8 bg-gray-200 rounded" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (metrics.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                <p>Unable to load statistics</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {metrics.map((metric) => (
                <Card key={metric.label} className="border-none shadow-md">
                    <CardContent className="px-4 py-2 flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                            <metric.icon className={`w-5 h-5 ${metric.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                {metric.label}
                            </p>
                            <h3 className="text-xl font-bold">{metric.value}</h3>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

