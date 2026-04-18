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
import { FileSearch, Table as TableIcon } from "lucide-react";
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
      return <span className="text-slate-300 font-bold">N/A</span>;

    // Special formatting for known columns
    if (columnId === "status") {
      const statusColors: Record<string, string> = {
        Resolved: "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold",
        "In Progress": "bg-indigo-50 text-indigo-700 border-indigo-100 font-bold",
        Pending: "bg-amber-50 text-amber-700 border-amber-100 font-bold",
        "Pending Review": "bg-amber-50 text-amber-700 border-amber-100 font-bold",
        Closed: "bg-slate-50 text-slate-500 border-slate-100 font-medium",
        New: "bg-red-50 text-red-700 border-red-100 font-bold",
        Active: "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold",
        Inactive: "bg-slate-50 text-slate-500 border-slate-100 font-medium",
      };
      const colorClass =
        statusColors[String(value)] || "bg-slate-50 text-slate-500 border-slate-100";
      return (
        <Badge variant="outline" className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${colorClass}`}>
          {String(value)}
        </Badge>
      );
    }

    if (columnId === "severity") {
      const severityColors: Record<string, string> = {
        High: "bg-red-50 text-red-700 border-red-100 font-bold",
        Medium: "bg-amber-50 text-amber-700 border-amber-100 font-bold",
        Low: "bg-emerald-50 text-emerald-700 border-emerald-100 font-bold",
      };
      const colorClass =
        severityColors[String(value)] || "bg-slate-100 text-slate-500";
      return (
        <Badge variant="outline" className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${colorClass}`}>
          {String(value)}
        </Badge>
      );
    }

    if (columnId === "budget" && typeof value === "number") {
      return (
        <span className="font-black text-slate-900 text-xs">
          GHS {value.toLocaleString()}
        </span>
      );
    }

    if (columnId === "people" && typeof value === "number") {
      return <span className="font-bold text-slate-700">{value.toLocaleString()}</span>;
    }

    return <span className="text-xs font-medium text-slate-600 leading-relaxed">{String(value)}</span>;
  };

  if (!data) {
    return (
      <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl overflow-hidden bg-white min-h-[300px] group">
        <CardHeader className="p-8 bg-slate-50/50 border-b border-slate-100 flex-row items-center gap-4 space-y-0">
           <div className="w-1 h-8 bg-slate-200 rounded-full group-hover:bg-amber-500 transition-colors" />
           <div>
              <CardTitle className="text-xl font-black text-slate-950 tracking-tight">Data Preview Matrix</CardTitle>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Registry visibility: 0 entries detected</p>
           </div>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center py-24 text-slate-400">
           <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
              <FileSearch className="w-10 h-10" />
           </div>
           <p className="text-sm font-bold italic tracking-tight">Synthesis Pending: Declare report parameters above to initiate preview.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
      <CardHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-1 h-8 bg-amber-500 rounded-full" />
             <div>
                <CardTitle className="text-xl font-black text-slate-950 tracking-tight">Strategic Synthesis Preview</CardTitle>
                <div className="flex items-center gap-3 mt-1">
                   <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      Registry Visibility: <span className="text-slate-950">{data.rows.length}</span> of <span className="text-slate-950">{data.pagination.total}</span> entries
                   </p>
                   {data.pagination.total_pages > 1 && (
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-slate-100">
                        Page {data.pagination.page} / {data.pagination.total_pages}
                      </span>
                   )}
                </div>
             </div>
          </div>
          <Badge
            variant="outline"
            className="h-10 px-4 rounded-xl bg-slate-950 text-white border-slate-900 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20"
          >
            {data.reportType} Matrix
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {data.rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
             <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                <TableIcon className="w-8 h-8" />
             </div>
             <p className="text-sm font-bold italic">Process Outcome: Zero result registry matches detect in survey.</p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <Table>
              <TableHeader className="bg-slate-50/30">
                <TableRow className="hover:bg-transparent border-slate-50">
                  {data.columns.map((col) => (
                    <TableHead
                      key={col}
                      className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] border-r border-slate-50 last:border-none"
                    >
                      {getColumnLabel(col)}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-50">
                {data.rows.map((row: ReportRow, rowIndex: number) => (
                  <TableRow key={rowIndex} className="hover:bg-slate-50/50 transition-colors group">
                    {data.columns.map((col) => (
                      <TableCell key={col} className="px-6 py-5 border-r border-slate-50/50 last:border-none">
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
