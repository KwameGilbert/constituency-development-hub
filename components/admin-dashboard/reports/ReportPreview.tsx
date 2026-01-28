"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ReportData,
  ReportColumn,
  ReportRow,
} from "@/lib/services/reports-service";

interface ReportPreviewProps {
  data: ReportData | null;
  columns: ReportColumn[];
}

export function ReportPreview({ data, columns }: ReportPreviewProps) {
  // Get column labels from definitions
  const getColumnLabel = (columnId: string): string => {
    const col = columns.find((c) => c.id === columnId);
    return col?.label || columnId;
  };

  // Format cell value for display
  const formatCellValue = (
    columnId: string,
    value: string | number | null,
  ): React.ReactNode => {
    if (value === null || value === undefined)
      return <span className="text-gray-400">-</span>;

    // Special formatting for known columns
    if (columnId === "status") {
      const statusColors: Record<string, string> = {
        Resolved: "bg-green-100 text-green-700",
        "In Progress": "bg-blue-100 text-blue-700",
        Pending: "bg-yellow-100 text-yellow-700",
        "Pending Review": "bg-yellow-100 text-yellow-700",
        Closed: "bg-gray-100 text-gray-700",
        New: "bg-red-100 text-red-700",
        Active: "bg-green-100 text-green-700",
        Inactive: "bg-gray-100 text-gray-700",
      };
      const colorClass =
        statusColors[String(value)] || "bg-gray-100 text-gray-700";
      return (
        <Badge variant="outline" className={colorClass}>
          {String(value)}
        </Badge>
      );
    }

    if (columnId === "severity") {
      const severityColors: Record<string, string> = {
        High: "bg-red-100 text-red-700",
        Medium: "bg-yellow-100 text-yellow-700",
        Low: "bg-green-100 text-green-700",
      };
      const colorClass =
        severityColors[String(value)] || "bg-gray-100 text-gray-700";
      return (
        <Badge variant="outline" className={colorClass}>
          {String(value)}
        </Badge>
      );
    }

    if (columnId === "budget" && typeof value === "number") {
      return `GHS ${value.toLocaleString()}`;
    }

    if (columnId === "people" && typeof value === "number") {
      return value.toLocaleString();
    }

    return String(value);
  };

  if (!data) {
    return (
      <Card className="shadow-sm border-gray-200 min-h-[200px]">
        <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Preview
          </CardTitle>
          <p className="text-sm text-gray-500">
            First 50 rows for your current selection.
          </p>
        </CardHeader>

        <CardContent className="flex items-center justify-center py-16 text-gray-500 text-sm">
          No data yet. Click Preview to load results.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">
              Preview
            </CardTitle>
            <p className="text-sm text-gray-500">
              Showing {data.rows.length} of {data.pagination.total} records
              {data.pagination.total_pages > 1 &&
                ` (Page ${data.pagination.page} of ${data.pagination.total_pages})`}
            </p>
          </div>
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            {data.reportType.charAt(0).toUpperCase() + data.reportType.slice(1)}{" "}
            Report
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {data.rows.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            No records found matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  {data.columns.map((col) => (
                    <TableHead
                      key={col}
                      className="font-semibold text-gray-700"
                    >
                      {getColumnLabel(col)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rows.map((row: ReportRow, rowIndex: number) => (
                  <TableRow key={rowIndex} className="hover:bg-gray-50/50">
                    {data.columns.map((col) => (
                      <TableCell key={col} className="text-gray-600">
                        {formatCellValue(col, row[col])}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
