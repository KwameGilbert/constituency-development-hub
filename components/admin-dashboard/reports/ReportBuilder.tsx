"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Eye, FileDown, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  ReportType, 
  ReportColumn, 
  ReportFilters, 
  ReportData,
  getColumnsForType,
  reportsService 
} from "@/lib/services/reports-service";

interface ReportBuilderProps {
  onPreview?: (data: ReportData, columns: ReportColumn[]) => void;
}

export function ReportBuilder({ onPreview }: ReportBuilderProps) {
  const [reportType, setReportType] = useState<ReportType>('issues');
  const [columns, setColumns] = useState<ReportColumn[]>(getColumnsForType('issues'));
  const [filters, setFilters] = useState<ReportFilters>({
    status: 'any',
    severity: 'any',
    type: 'any',
  });
  const [dateRange, setDateRange] = useState('all');
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Handle report type change
  const handleReportTypeChange = (type: ReportType) => {
    setReportType(type);
    setColumns(getColumnsForType(type));
  };

  // Toggle column selection
  const toggleColumn = (columnId: string) => {
    setColumns(prev => prev.map(col => 
      col.id === columnId ? { ...col, checked: !col.checked } : col
    ));
  };

  // Select all columns
  const selectAllColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, checked: true })));
  };

  // Clear all columns
  const clearAllColumns = () => {
    setColumns(prev => prev.map(col => ({ ...col, checked: false })));
  };

  // Get selected column IDs
  const getSelectedColumns = useCallback(() => {
    return columns.filter(col => col.checked).map(col => col.id);
  }, [columns]);

  // Generate report preview
  const handlePreview = async () => {
    const selectedCols = getSelectedColumns();
    if (selectedCols.length === 0) {
      toast.error("Please select at least one column");
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
        limit: 50
      });

      if (response.success) {
        toast.success(`Loaded ${response.data.rows.length} records`);
        onPreview?.(response.data, columns);
      } else {
        toast.error(response.message || "Failed to generate report");
      }
    } catch (error) {
      console.error("Report generation error:", error);
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  // Export report as CSV
  const handleExport = async () => {
    const selectedCols = getSelectedColumns();
    if (selectedCols.length === 0) {
      toast.error("Please select at least one column");
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
        limit: 10000 // Get all records for export
      });

      if (response.success) {
        reportsService.exportAsCSV(response.data, columns);
        toast.success(`Exported ${response.data.rows.length} records to CSV`);
      } else {
        toast.error(response.message || "Failed to export report");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export report");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-semibold text-gray-800">Report Builder</CardTitle>
        <CardDescription>Choose data source, fields, filters, and time range. Preview before exporting.</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Report Type & Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
           {/* Report Type */}
           <div className="lg:col-span-3 space-y-2">
             <Label htmlFor="report-type" className="text-sm font-medium text-gray-700">Report Type</Label>
             <Select value={reportType} onValueChange={(val) => handleReportTypeChange(val as ReportType)}>
                <SelectTrigger id="report-type" className="w-full">
                    <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="issues">Issues</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="users">Users</SelectItem>
                </SelectContent>
             </Select>
           </div>

           {/* Columns Selection */}
           <div className="lg:col-span-9 space-y-2">
             <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-gray-700">Columns</Label>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {columns.map((col) => (
                    <div key={col.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={col.id} 
                          checked={col.checked}
                          onCheckedChange={() => toggleColumn(col.id)}
                          className="border-gray-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600" 
                        />
                        <Label htmlFor={col.id} className="text-sm text-gray-600 font-normal cursor-pointer">{col.label}</Label>
                    </div>
                ))}
             </div>
             <div className="flex items-center gap-3 mt-2 text-xs">
                 <button onClick={selectAllColumns} className="text-red-600 font-medium hover:underline">Select all</button>
                 <button onClick={clearAllColumns} className="text-gray-500 hover:text-gray-700 hover:underline">Clear all</button>
             </div>
           </div>
        </div>

        <Separator />

        {/* Filters & Date Range */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Filters */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <Label className="text-sm font-semibold text-gray-800">Filters</Label>
                
                <div className="space-y-3">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-gray-500">Status</Label>
                        <Select value={filters.status} onValueChange={(val) => setFilters(f => ({ ...f, status: val }))}>
                            <SelectTrigger className="w-full bg-white h-9">
                                <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="any">Any</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {reportType === 'issues' && (
                      <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500">Severity</Label>
                          <Select value={filters.severity} onValueChange={(val) => setFilters(f => ({ ...f, severity: val }))}>
                              <SelectTrigger className="w-full bg-white h-9">
                                  <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="any">Any</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                    )}
                    {reportType === 'users' && (
                      <div className="space-y-1.5">
                          <Label className="text-xs text-gray-500">Role</Label>
                          <Select value={filters.role || 'any'} onValueChange={(val) => setFilters(f => ({ ...f, role: val }))}>
                              <SelectTrigger className="w-full bg-white h-9">
                                  <SelectValue placeholder="Any" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="any">Any</SelectItem>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="web_admin">Web Admin</SelectItem>
                                  <SelectItem value="officer">Officer</SelectItem>
                                  <SelectItem value="agent">Agent</SelectItem>
                                  <SelectItem value="task_force">Task Force</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                    )}
                </div>
            </div>

            {/* Date Range */}
             <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <Label className="text-sm font-semibold text-gray-800">Date Range</Label>
                <div className="space-y-1.5">
                    <Label className="text-xs text-gray-500">Period</Label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-full bg-white">
                            <SelectValue placeholder="All time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">This Week</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="quarter">This Quarter</SelectItem>
                            <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <p className="text-xs text-gray-400 pt-2">
                    Date filters apply to the record&apos;s created_at field by default.
                </p>
             </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-3 pt-2 pb-6 px-6">
        <Button variant="outline" className="gap-2" onClick={handlePreview} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            Preview
        </Button>
        <Button className="bg-red-600 hover:bg-red-700 gap-2" onClick={handleExport} disabled={exporting}>
            {exporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileDown className="w-4 h-4" />}
            Export CSV
        </Button>
      </CardFooter>
    </Card>
  );
}
