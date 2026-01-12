import { apiClient } from "../api-client";

// Report Types
export type ReportType = 'issues' | 'projects' | 'users';

// Column Configuration
export interface ReportColumn {
  id: string;
  label: string;
  checked: boolean;
}

// Report Filters
export interface ReportFilters {
  status?: string;
  severity?: string;
  type?: string;
  category?: string;
  role?: string;
}

// Report Request Params
export interface GenerateReportParams {
  reportType: ReportType;
  columns: string[];
  filters: ReportFilters;
  dateRange: string;
  page?: number;
  limit?: number;
}

// Report Row (dynamic based on selected columns)
export type ReportRow = Record<string, string | number | null>;

// Report Response
export interface ReportData {
  reportType: ReportType;
  columns: string[];
  rows: ReportRow[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ReportResponse {
  success: boolean;
  message: string;
  data: ReportData;
}

// Column definitions for each report type
export const issuesColumns: ReportColumn[] = [
  { id: "id", label: "ID", checked: true },
  { id: "title", label: "Title", checked: true },
  { id: "status", label: "Status", checked: true },
  { id: "severity", label: "Severity", checked: false },
  { id: "type", label: "Type", checked: false },
  { id: "category", label: "Category", checked: false },
  { id: "sector", label: "Sector", checked: false },
  { id: "subsector", label: "Subsector", checked: false },
  { id: "agent", label: "Agent", checked: false },
  { id: "officer", label: "Officer", checked: false },
  { id: "people", label: "People Affected", checked: false },
  { id: "budget", label: "Budget Estimate", checked: false },
  { id: "created", label: "Created At", checked: true },
  { id: "resolved", label: "Resolved At", checked: false },
  { id: "community", label: "Main Community", checked: false },
  { id: "smaller", label: "Smaller Community", checked: false },
  { id: "suburb", label: "Suburb", checked: false },
  { id: "cottage", label: "Cottage", checked: false },
];

export const projectsColumns: ReportColumn[] = [
  { id: "id", label: "ID", checked: true },
  { id: "title", label: "Title", checked: true },
  { id: "status", label: "Status", checked: true },
  { id: "sector", label: "Sector", checked: false },
  { id: "budget", label: "Budget", checked: true },
  { id: "created", label: "Created At", checked: true },
  { id: "community", label: "Location", checked: false },
];

export const usersColumns: ReportColumn[] = [
  { id: "id", label: "ID", checked: true },
  { id: "name", label: "Name", checked: true },
  { id: "email", label: "Email", checked: true },
  { id: "role", label: "Role", checked: true },
  { id: "status", label: "Status", checked: true },
  { id: "created", label: "Created At", checked: true },
];

// Helper to get columns for a report type
export function getColumnsForType(type: ReportType): ReportColumn[] {
  switch (type) {
    case 'issues':
      return [...issuesColumns];
    case 'projects':
      return [...projectsColumns];
    case 'users':
      return [...usersColumns];
    default:
      return [...issuesColumns];
  }
}

// Helper to convert report data to CSV
export function convertToCSV(columns: string[], rows: ReportRow[], columnDefs: ReportColumn[]): string {
  // Get column labels for header
  const columnMap = new Map(columnDefs.map(c => [c.id, c.label]));
  const headers = columns.map(col => columnMap.get(col) || col);
  
  // Build CSV
  const csvLines = [headers.join(',')];
  
  for (const row of rows) {
    const values = columns.map(col => {
      const value = row[col];
      if (value === null || value === undefined) return '';
      // Escape quotes and wrap in quotes if contains comma
      const strValue = String(value);
      if (strValue.includes(',') || strValue.includes('"')) {
        return `"${strValue.replace(/"/g, '""')}"`;
      }
      return strValue;
    });
    csvLines.push(values.join(','));
  }
  
  return csvLines.join('\n');
}

// Helper to download CSV file
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Reports Service
export const reportsService = {
  /**
   * Generate a custom report based on parameters
   */
  async generateReport(params: GenerateReportParams): Promise<ReportResponse> {
    return apiClient<ReportResponse>('/admin/data/reports/generate', {
      method: 'POST',
      requiresAuth: true,
      body: JSON.stringify(params),
    });
  },
  
  /**
   * Export report as CSV and trigger download
   */
  exportAsCSV(data: ReportData, columnDefs: ReportColumn[]): void {
    const csvContent = convertToCSV(data.columns, data.rows, columnDefs);
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${data.reportType}-report-${timestamp}.csv`;
    downloadCSV(csvContent, filename);
  },
};
