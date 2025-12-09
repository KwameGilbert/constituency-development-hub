import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function IssuesBreakdown() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Issues by Category */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-[#1e1b4b]">Issues by Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-[#1e1b4b]">Economic Empowerment</span>
                            <span className="text-muted-foreground">1</span>
                        </div>
                        <Progress value={50} className="h-2 bg-slate-100" indicatorClassName="bg-[#6366f1]" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-[#1e1b4b]">Health</span>
                            <span className="text-muted-foreground">1</span>
                        </div>
                        <Progress value={50} className="h-2 bg-slate-100" indicatorClassName="bg-[#6366f1]" />
                    </div>
                </CardContent>
            </Card>

            {/* Issues by Electoral Area */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base font-semibold text-[#1e1b4b]">Issues by Electoral Area</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-[#1e1b4b]">Sefwi Boako</span>
                            <span className="text-muted-foreground">1</span>
                        </div>
                        <Progress value={50} className="h-2 bg-slate-100" indicatorClassName="bg-[#10b981]" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium text-[#1e1b4b]">Sefwi Asawinso</span>
                            <span className="text-muted-foreground">1</span>
                        </div>
                        <Progress value={50} className="h-2 bg-slate-100" indicatorClassName="bg-[#10b981]" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
