"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";

export function AnalyticsInsights() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Top Performers</CardTitle>
          <p className="text-xs text-gray-500">Staff with highest resolution rates</p>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
             <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                     1
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-gray-900">Agent.Rock</h4>
                    <p className="text-xs text-gray-500">Agent</p>
                 </div>
             </div>
             <div className="text-right">
                <span className="block text-sm font-bold text-emerald-600">0.0%</span>
                <span className="text-xs text-gray-500">0/2 resolved</span>
             </div>
           </div>
        </CardContent>
      </Card>

      {/* Community Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Community Insights</CardTitle>
          <p className="text-xs text-gray-500">Issues by location and resolution time</p>
        </CardHeader>
        <CardContent className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-full text-white">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Sefwi Boako</h4>
                        <p className="text-xs text-gray-500">1 issues reported</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-sm font-medium text-blue-600">N/A</span>
                    <span className="text-xs text-gray-500">Avg. resolution</span>
                </div>
             </div>

             <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-500 rounded-full text-white">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900">Sefwi Asawinso</h4>
                        <p className="text-xs text-gray-500">1 issues reported</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-sm font-medium text-blue-600">N/A</span>
                    <span className="text-xs text-gray-500">Avg. resolution</span>
                </div>
             </div>
        </CardContent>
      </Card>
    </div>
  );
}
