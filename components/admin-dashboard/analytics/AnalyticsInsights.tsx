"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin } from "lucide-react";

interface InsightsData {
  insights: {
    topPerformers: Array<{
      id: number;
      name: string;
      role: string;
      resolvedCount: number;
      totalCount: number;
      resolutionRate: number;
      rank: number;
    }>;
    communityInsights: Array<{
      location: string;
      issuesReported: number;
      avgResolutionTime: string;
      resolutionRate: number;
    }>;
  };
}

export function AnalyticsInsights() {
  const [insightsData, setInsightsData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get('/data/admin-analytics-insights.json');
        setInsightsData(response.data);
      } catch (err) {
        setError('Failed to load insights data');
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        {[1, 2].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-3">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !insightsData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <Card className="col-span-full">
          <CardContent className="p-6">
            <div className="text-center text-red-600">
              {error || 'No insights data available'}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Top Performers</CardTitle>
          <p className="text-xs text-gray-500">Staff with highest resolution rates</p>
        </CardHeader>
        <CardContent>
          {insightsData.insights.topPerformers.map((performer) => (
            <div key={performer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                      {performer.rank}
                  </div>
                  <div>
                     <h4 className="text-sm font-semibold text-gray-900">{performer.name}</h4>
                     <p className="text-xs text-gray-500">{performer.role}</p>
                  </div>
              </div>
              <div className="text-right">
                 <span className="block text-sm font-bold text-emerald-600">{performer.resolutionRate}%</span>
                 <span className="text-xs text-gray-500">{performer.resolvedCount}/{performer.totalCount} resolved</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Community Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold text-gray-800">Community Insights</CardTitle>
          <p className="text-xs text-gray-500">Issues by location and resolution time</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {insightsData.insights.communityInsights.map((location, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
               <div className="flex items-center gap-3">
                   <div className="p-2 bg-orange-500 rounded-full text-white">
                       <MapPin className="w-4 h-4" />
                   </div>
                   <div>
                       <h4 className="text-sm font-medium text-gray-900">{location.location}</h4>
                       <p className="text-xs text-gray-500">{location.issuesReported} issues reported</p>
                   </div>
               </div>
               <div className="text-right">
                   <span className="block text-sm font-medium text-blue-600">{location.avgResolutionTime}</span>
                   <span className="text-xs text-gray-500">Avg. resolution</span>
               </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
