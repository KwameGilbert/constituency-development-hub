import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function AgentStatsCards() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold text-[#1e1b4b]">2</h3>
                    <p className="text-xs text-muted-foreground">Total Issues</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold text-yellow-600">0</h3>
                    <p className="text-xs text-muted-foreground">Pending</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold text-green-600">0</h3>
                    <p className="text-xs text-muted-foreground">Resolved</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-bold text-blue-600">0</h3>
                    <p className="text-xs text-muted-foreground">Avg Days</p>
                </CardContent>
            </Card>
        </div>
    );
}
