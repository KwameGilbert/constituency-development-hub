import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, FileText } from "lucide-react";

export function AgentsMetrics() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Agents */}
            <Card>
                <CardContent className="px-3 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Agents</p>
                        <h3 className="text-2xl font-bold text-[#1e1b4b]">1</h3>
                    </div>
                </CardContent>
            </Card>

            {/* Active Agents */}
            <Card>
                <CardContent className="px-3 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg text-green-600">
                        <UserCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Agents</p>
                        <h3 className="text-2xl font-bold text-[#1e1b4b]">1</h3>
                    </div>
                </CardContent>
            </Card>

            {/* Inactive Agents */}
            <Card>
                <CardContent className="px-3 flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-lg text-red-600">
                        <UserX className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Inactive Agents</p>
                        <h3 className="text-2xl font-bold text-[#1e1b4b]">0</h3>
                    </div>
                </CardContent>
            </Card>

            {/* Issues Handled */}
            <Card>
                <CardContent className="px-3 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">Issues Handled</p>
                        <h3 className="text-2xl font-bold text-[#1e1b4b]">2</h3>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
