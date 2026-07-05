"use client";

import { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, Loader2, Settings2, Columns, Filter, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  ReportType,
  ReportColumn,
  ReportFilters,
  ReportData,
  getColumnsForType,
  reportsService,
} from "@/lib/services/reports-service";

interface ReportBuilderProps {
  onPreview?: (data: ReportData, columns: ReportColumn[]) => void;
}

export function ReportBuilder({ onPreview }: ReportBuilderProps) {
  const [reportType, setReportType] = useState<ReportType>("issues");
  const [columns, setColumns] = useState<ReportColumn[]>(
    getColumnsForType("issues"),
  );
  const [filters, setFilters] = useState<ReportFilters>({
    status: "any",
    severity: "any",
    type: "any",
  });
  const [dateRange, setDateRange] = useState("all");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Handle report type change
  const handleReportTypeChange = (type: ReportType) => {
    setReportType(type);
    setColumns(getColumnsForType(type));
  };

  // Toggle column selection
  const toggleColumn = (columnId: string) => {
    setColumns((prev) =>
      prev.map((col) =>
        col.id === columnId ? { ...col, checked: !col.checked } : col,
      ),
    );
  };

  // Select all columns
  const selectAllColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, checked: true })));
  };

  // Clear all columns
  const clearAllColumns = () => {
    setColumns((prev) => prev.map((col) => ({ ...col, checked: false })));
  };

  // Get selected column IDs
  const getSelectedColumns = useCallback(() => {
    return columns.filter((col) => col.checked).map((col) => col.id);
  }, [columns]);

  // Generate report preview
  const handlePreview = async () => {
    const selectedCols = getSelectedColumns();
    if (selectedCols.length === 0) {
      toast.error("Process Blocked: At least one column required for synthesis.");
      return;
    }

    setLoading(true);
    try {
      const response = await reportsService.generateReport({
        reportType,
        columns: selectedCols,
        filters,
        dateRange,
        page: 1,
        limit: 50,
      });

      if (response.success) {
        toast.success(`Contextual survey loaded: ${response.data.rows.length} entries`);
        onPreview?.(response.data, columns);
      } else {
        toast.error(response.message || "Synthesis failure");
      }
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("System synchronization failure");
    } finally {
      setLoading(false);
    }
  };

  // Export report as CSV
  const handleExport = async () => {
    const selectedCols = getSelectedColumns();
    if (selectedCols.length === 0) {
      toast.error("Process Blocked: Selection registry mandatory");
      return;
    }

    setExporting(true);
    try {
      const response = await reportsService.generateReport({
        reportType,
        columns: selectedCols,
        filters,
        dateRange,
        page: 1,
        limit: 10000, // Get all records for export
      });

      if (response.success) {
        reportsService.exportAsCSV(response.data, columns);
        toast.success(`Strategic ledger exported: ${response.data.rows.length} records`);
      } else {
        toast.error(response.message || "Export failure");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("System process error during export");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card className="border-none shadow-md shadow-slate-200/40 rounded-3xl overflow-hidden bg-white">
      <CardHeader className="p-8 bg-slate-950 text-white relative">
        <div className="absolute top-8 left-8 w-1 h-8 bg-amber-500 rounded-full" />
        <div className="pl-6">
           <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-3">
             <Settings2 className="w-6 h-6 text-amber-500" />
             Report Synthesis Matrix
           </CardTitle>
           <CardDescription className="text-sm font-normal text-muted-foreground mt-1">
             Declare data source parameters and strategic fields for contextual ledger generation
           </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-8 space-y-8">
        {/* Report Type & Columns Configuration Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Report Type Selection */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-1 h-4 bg-amber-500 rounded-full" />
               <Label htmlFor="report-type" className="text-base font-semibold text-slate-800">Source Registry</Label>
            </div>
            <Select
              value={reportType}
              onValueChange={(val) => handleReportTypeChange(val as ReportType)}
            >
              <SelectTrigger id="report-type" className="h-12 rounded-xl bg-slate-50 border-none font-medium text-slate-900 text-sm">
                <SelectValue placeholder="Select context" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
                <SelectItem value="issues" className="font-normal text-sm">Issues Registry</SelectItem>
                <SelectItem value="projects" className="font-normal text-sm">Project Ledger</SelectItem>
                <SelectItem value="users" className="font-normal text-sm">Personnel Matrix</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs font-normal text-muted-foreground italic px-2">Primary data cluster for strategic synthesis.</p>
          </div>

          {/* Columns Selection Matrix */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                 <div className="w-1 h-4 bg-amber-500 rounded-full" />
                 <Label className="text-base font-semibold text-slate-800">Metric Visibility</Label>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={selectAllColumns} className="text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors">Select All</button>
                <button onClick={clearAllColumns} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Clear</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-6 bg-slate-50/50 rounded-2xl border border-slate-50">
              {columns.map((col) => (
                <div key={col.id} className="flex items-center space-x-3 group cursor-pointer" onClick={() => toggleColumn(col.id)}>
                  <Checkbox
                    id={col.id}
                    checked={col.checked}
                    className="h-5 w-5 rounded-lg border-slate-200 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500 transition-all shadow-sm"
                  />
                  <Label
                    htmlFor={col.id}
                    className="text-sm font-normal text-slate-700 cursor-pointer group-hover:text-slate-950 transition-colors"
                  >
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator className="bg-slate-50" />

        {/* Dynamic Filters & Temporal Range Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contextual Filters Hub */}
          <div className="space-y-6 p-8 bg-slate-50/30 rounded-3xl border border-slate-50/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Filter className="w-12 h-12 text-slate-900" />
            </div>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Filter className="w-4 h-4 text-amber-500" />
               </div>
               <span className="text-base font-semibold text-slate-800">Parameter Refinement</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700 ml-1">Lifecycle Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(val) => setFilters((f) => ({ ...f, status: val }))}
                >
                  <SelectTrigger className="h-11 bg-white border-slate-100 rounded-xl font-medium text-sm">
                    <SelectValue placeholder="Unified Status" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-100">
                    <SelectItem value="any" className="font-normal text-sm">Unified</SelectItem>
                    <SelectItem value="pending" className="font-normal text-sm">Pending</SelectItem>
                    <SelectItem value="in_progress" className="font-normal text-sm">Active</SelectItem>
                    <SelectItem value="resolved" className="font-normal text-sm">Resolved</SelectItem>
                    <SelectItem value="closed" className="font-normal text-sm">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {reportType === "issues" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 ml-1">Threat Level</Label>
                  <Select
                    value={filters.severity}
                    onValueChange={(val) => setFilters((f) => ({ ...f, severity: val }))}
                  >
                    <SelectTrigger className="h-11 bg-white border-slate-100 rounded-xl font-bold text-xs">
                      <SelectValue placeholder="All severities" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                      <SelectItem value="any" className="font-normal text-sm">Unified</SelectItem>
                      <SelectItem value="high" className="font-normal text-sm text-red-600">Critical</SelectItem>
                      <SelectItem value="medium" className="font-normal text-sm text-amber-600">Standard</SelectItem>
                      <SelectItem value="low" className="font-normal text-sm text-emerald-600">Operational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {reportType === "users" && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700 ml-1">Contextual Role</Label>
                  <Select
                    value={filters.role || "any"}
                    onValueChange={(val) => setFilters((f) => ({ ...f, role: val }))}
                  >
                    <SelectTrigger className="h-11 bg-white border-slate-100 rounded-xl font-bold text-xs">
                      <SelectValue placeholder="All roles" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-slate-100">
                      <SelectItem value="any" className="font-normal text-sm">Unified</SelectItem>
                      <SelectItem value="admin" className="font-normal text-sm">Admin</SelectItem>
                      <SelectItem value="web_admin" className="font-normal text-sm">Web Admin</SelectItem>
                      <SelectItem value="officer" className="font-normal text-sm">Officer</SelectItem>
                      <SelectItem value="agent" className="font-normal text-sm">Agent</SelectItem>
                      <SelectItem value="task_force" className="font-normal text-sm">Task Force</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Temporal Consistency Hub */}
          <div className="space-y-6 p-8 bg-slate-50/30 rounded-3xl border border-slate-50/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <Calendar className="w-12 h-12 text-slate-900" />
            </div>
            <div className="flex items-center gap-3">
               <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Calendar className="w-4 h-4 text-amber-500" />
               </div>
               <span className="text-base font-semibold text-slate-800">Temporal Scope</span>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700 ml-1">Period Assignment</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="h-11 bg-white border-slate-100 rounded-xl font-medium text-sm">
                  <SelectValue placeholder="Full Registry" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100">
                  <SelectItem value="all" className="font-normal text-sm">Full Registry</SelectItem>
                  <SelectItem value="today" className="font-normal text-sm">Last 24h</SelectItem>
                  <SelectItem value="week" className="font-normal text-sm">Active Week</SelectItem>
                  <SelectItem value="month" className="font-normal text-sm">Fiscal Month</SelectItem>
                  <SelectItem value="quarter" className="font-normal text-sm">Quarterly</SelectItem>
                  <SelectItem value="year" className="font-normal text-sm">Calendar Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs font-normal text-muted-foreground italic leading-relaxed pt-2">
              Note: Temporal filters scope content based on entry initialization (created_at) by system default.
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-50 flex-row justify-end gap-4">
        <Button
          variant="outline"
          className="h-12 px-6 rounded-2xl bg-white border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 flex items-center gap-3 transition-all"
          onClick={handlePreview}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
          ) : (
             <div className="p-1 bg-slate-100 rounded-lg">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
             </div>
          )}
          Load Preview
        </Button>
        <Button
          className="h-12 px-8 rounded-2xl bg-slate-950 text-white hover:bg-slate-800 font-medium text-sm flex items-center gap-3 shadow-xl shadow-slate-900/20"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
             <div className="p-1.5 bg-amber-500 rounded-lg">
                <FileDown className="w-3.5 h-3.5 text-slate-950" />
             </div>
          )}
          Capture Strategic CSV
        </Button>
      </CardFooter>
    </Card>
  );
}
