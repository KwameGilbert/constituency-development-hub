"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export function AdminRecentIssues() {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-lg font-semibold text-gray-800">Recent Issues</CardTitle>
        <a href="#" className="text-sm text-blue-600 hover:underline">View All Issues →</a>
      </CardHeader>
      <CardContent className="p-0">
        <div className="bg-white">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
                <div>Issue</div>
                <div>Agent</div>
                <div>Status</div>
                <div className="col-span-1 grid grid-cols-2">
                    <span>Severity</span>
                    <span className="text-right">Date</span>
                </div>
            </div>
            
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <Inbox className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">No recent issues found.</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
