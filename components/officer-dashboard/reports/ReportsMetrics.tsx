import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, TrendingUp } from "lucide-react";

export function ReportsMetrics() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Issues */}
            <Card>
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                        <h3 className="text-2xl font-bold text-[#1e1b4b]">2</h3>
                    </div>
                </CardContent>
            </Card>

            {/* Pending Issues */}
            <Card>
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-lg text-yellow-600">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Pending Issues</p>
                        <h3 className="text-2xl font-bold text-[#1e1b4b]">0</h3>
                    </div>
                </CardContent>
            </Card>

            {/* Resolved Issues */}
            <Card>
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Resolved Issues</p>
                        <h3 className="text-2xl font-bold text-[#1e1b4b]">0</h3>
                    </div>
                </CardContent>
            </Card>

            {/* Avg Resolution Time */}
            <Card>
                <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Avg Resolution Time</p>
                        <h3 className="text-2xl font-bold text-[#1e1b4b]">0 days</h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
