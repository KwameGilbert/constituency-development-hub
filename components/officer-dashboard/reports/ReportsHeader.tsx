import React from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";

export function ReportsHeader() {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-lg border shadow-sm">
            <div>
                <h1 className="text-2xl font-bold text-[#1e1b4b]">Reports & Analytics</h1>
                <p className="text-muted-foreground">Comprehensive system insights and performance metrics</p>
            </div>
            <div className="flex items-center gap-3">
                <Button className="bg-[#312e81] hover:bg-[#312e81]/90 gap-2">
                    <Download className="h-4 w-4" />
                    Export Report
                </Button>
                <Button variant="outline" className="gap-2 bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700">
                    <Printer className="h-4 w-4" />
                    Print Report
                </Button>
            </div>
        </div>
    );
}
