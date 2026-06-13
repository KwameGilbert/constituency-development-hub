"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Loader2,
} from "lucide-react";
import {
  officerReportsService,
  ReportsSummary,
} from "@/lib/services/officer-reports-service";

export function ReportsMetrics() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<ReportsSummary | null>(null);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const response = await officerReportsService.getSummary();
        if (response.success) {
          setSummary(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch reports summary:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex items-center justify-center h-24">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Issues */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Total Issues
            </p>
            <h3 className="text-2xl font-bold text-[#1e1b4b]">
              {summary?.total_issues ?? 0}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Pending Issues */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Pending Issues
            </p>
            <h3 className="text-2xl font-bold text-[#1e1b4b]">
              {summary?.pending_issues ?? 0}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Resolved Issues */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Resolved Issues
            </p>
            <h3 className="text-2xl font-bold text-[#1e1b4b]">
              {summary?.resolved_issues ?? 0}
            </h3>
          </div>
        </CardContent>
      </Card>

      {/* Avg Resolution Time */}
      <Card>
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Avg Resolution Time
            </p>
            <h3 className="text-2xl font-bold text-[#1e1b4b]">
              {summary?.avg_resolution_time ?? 0} days
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
