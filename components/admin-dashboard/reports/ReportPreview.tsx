"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function ReportPreview() {
  return (
    <Card className="shadow-sm border-gray-200 min-h-[200px]">
      <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-800">Preview</CardTitle>
        <p className="text-sm text-gray-500">First 50 rows for your current selection.</p>
      </CardHeader>
      
      <CardContent className="flex items-center justify-center py-16 text-gray-500 text-sm">
        No data yet. Click Preview to load results.
      </CardContent>
    </Card>
  );
}
