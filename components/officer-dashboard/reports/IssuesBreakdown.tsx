"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { officerReportsService, ReportsBreakdown } from "@/lib/services/officer-reports-service";

export function IssuesBreakdown() {
    const [loading, setLoading] = useState(true);
    const [breakdown, setBreakdown] = useState<ReportsBreakdown | null>(null);

    useEffect(() => {
        async function fetchBreakdown() {
            try {
                const response = await officerReportsService.getBreakdown();
                if (response.success) {
                    setBreakdown(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch breakdown:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBreakdown();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="text-base font-semibold text-[#1e1b4b]">Loading...</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center h-32">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues by Category */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-[#1e1b4b]">Issues by Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {breakdown?.issues_by_category && breakdown.issues_by_category.length > 0 ? (
                        breakdown.issues_by_category.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-[#1e1b4b]">{item.name}</span>
                                    <span className="text-muted-foreground">{item.count}</span>
                                </div>
                                <Progress 
                                    value={item.percentage} 
                                    className="h-2 bg-slate-100" 
                                    indicatorClassName="bg-[#6366f1]" 
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No category data available</p>
                    )}
                </CardContent>
            </Card>

            {/* Issues by Electoral Area */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-[#1e1b4b]">Issues by Electoral Area</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {breakdown?.issues_by_location && breakdown.issues_by_location.length > 0 ? (
                        breakdown.issues_by_location.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-[#1e1b4b]">{item.name}</span>
                                    <span className="text-muted-foreground">{item.count}</span>
                                </div>
                                <Progress 
                                    value={item.percentage} 
                                    className="h-2 bg-slate-100" 
                                    indicatorClassName="bg-[#10b981]" 
                                />
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No location data available</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
