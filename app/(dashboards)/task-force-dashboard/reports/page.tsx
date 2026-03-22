"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Download,
  FileText,
  Calendar as CalendarIcon,
  Users,
  Loader2,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import {
  taskForceService,
  TeamMember,
  TaskForceReports,
} from "@/lib/services/task-force-service";
import * as XLSX from "xlsx";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";
import { ReportPrintLayout } from "@/components/task-force-dashboard/reports/ReportPrintLayout";

const COLORS = {
  primary: "#7e22ce",
  secondary: "#a855f7",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
  neutral: "#94a3b8",
};

// Custom Tooltip to avoid 'lab' parsing errors in Recharts
interface TooltipPayloadEntry {
  name: string;
  value: number | string;
  color: string;
  [key: string]: unknown;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
        <p className="text-sm font-medium text-gray-900 mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-500 capitalize">{entry.name}:</span>
            <span className="font-semibold text-gray-900">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<TaskForceReports | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // Filtering
  const [date, setDate] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  // Interpretation Notes
  const [notes, setNotes] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);

  // Derived days count for date range display
  const daysDiff = useMemo(() => {
    if (date?.from && date?.to) {
      const diffTime = Math.abs(date.to.getTime() - date.from.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 30;
  }, [date]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsRes, teamRes] = await Promise.all([
          taskForceService.getReports(),
          taskForceService.getTeamMembers({ limit: 50 }),
        ]);

        if (reportsRes.success) {
          setReports(reportsRes.data);
        }
        if (teamRes.success) {
          setTeamMembers(teamRes.data.members);
        }
      } catch (error) {
        console.error("Failed to fetch reports data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // daysDiff removed from dependencies as API currently does not support date filtering

  // Derived Metrics
  const statusData = useMemo(() => {
    if (!reports?.status_distribution) return [];
    return [
      {
        name: "Pending",
        value: reports.status_distribution.assigned_to_task_force || 0,
        color: COLORS.info,
      },
      {
        name: "In Progress",
        value:
          (reports.status_distribution.assessment_in_progress || 0) +
          (reports.status_distribution.resolution_in_progress || 0),
        color: "#f97316",
      },
      {
        name: "Resolved",
        value: reports.status_distribution.resolved || 0,
        color: COLORS.success,
      },
      {
        name: "Closed",
        value: reports.status_distribution.closed || 0,
        color: "#166534",
      },
    ].filter((item) => item.value > 0);
  }, [reports]);

  // Automated Interpretation
  const resolutionRate = reports?.total_issues
    ? Math.round((reports.resolved_issues / reports.total_issues) * 100)
    : 0;
  const automatedInsights = useMemo(() => {
    const insights = [];
    if (resolutionRate > 80)
      insights.push("✅ Excellent resolution rate above 80%.");
    else if (resolutionRate < 50)
      insights.push("⚠️ Resolution rate is below 50%, requiring attention.");

    if ((reports?.priority_distribution?.urgent || 0) > 5) {
      insights.push(
        `🚨 High number of Urgent issues (${reports?.priority_distribution?.urgent}).`,
      );
    }

    if (daysDiff < 7)
      insights.push("ℹ️ Report covers a short period (< 7 days).");

    return insights;
  }, [resolutionRate, reports, daysDiff]);

  const handleDetailedExport = () => {
    if (!reports) return;

    const workbook = XLSX.utils.book_new();

    // -- SHEET 1: EXECUTIVE SUMMARY --
    const summaryData = [
      ["EXECUTIVE SUMMARY", ""],
      ["Generated On", new Date().toLocaleString()],
      [
        "Report Period",
        `${date?.from ? format(date.from, "PPP") : "N/A"} - ${date?.to ? format(date.to, "PPP") : "N/A"}`,
      ],
      ["Analyzed By", "Task Force Lead"], // Placeholder
      ["User Notes", notes],
      ["", ""],
      ["KEY METRICS", ""],
      ["Total Issues Reported", reports.total_issues],
      ["Successfully Resolved", reports.resolved_issues],
      ["Resolution Rate", `${resolutionRate}%`],
      ["", ""],
      ["AUTOMATED INSIGHTS", ""],
      ...automatedInsights.map((i) => [i]),
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Executive Summary");

    // -- SHEET 2: DATA --
    const statusRows = statusData.map((s) => ({
      Status: s.name,
      Count: s.value,
    }));
    const statusSheet = XLSX.utils.json_to_sheet(statusRows);
    XLSX.utils.book_append_sheet(workbook, statusSheet, "Status Breakdown");

    // -- SHEET 3: TEAM PERFORMANCE --
    if (teamMembers.length > 0) {
      const teamRows = teamMembers.map((m) => ({
        Name: m.name,
        Role: m.title || "Officer",
        Assessments: m.assessments_completed,
        Resolutions: m.resolutions_completed,
        Efficiency: `${m.completion_rate}%`,
        Status: m.status,
      }));
      const teamSheet = XLSX.utils.json_to_sheet(teamRows);
      XLSX.utils.book_append_sheet(workbook, teamSheet, "Team Performance");
    }

    XLSX.writeFile(
      workbook,
      `TaskForce_Report_${format(new Date(), "yyyy-MM-dd")}.xlsx`,
    );
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !reports) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      <style type="text/css" media="print">
        {`
          @page { size: landscape; margin: 5mm; }
          body {
            background-color: white;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          /* Using the visibility toggle technique for robust print layout */
          @media print {
            body * {
              visibility: hidden;
            }
            #report-content, #report-content * {
              visibility: visible;
            }
            #report-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              border: none;
              box-shadow: none;
              background-color: white;
            }
            /* Hide the analysis notes placeholder text if empty */
            textarea::placeholder {
              color: transparent;
            }
          }
        `}
      </style>

      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6 print:hidden">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Comprehensive reporting with interpretation and specific date
            filtering.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleDetailedExport}
            className="bg-green-600 hover:bg-green-700 shadow-sm transition-all"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>

          <Button
            onClick={handlePrint}
            className="bg-gray-800 hover:bg-black shadow-sm transition-all"
          >
            <FileText className="h-4 w-4 mr-2" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {/* --- REPORT CONTENT (Capture Target) --- */}
      <div
        id="report-content"
        ref={reportRef}
        className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100"
      >
        {/* Report Header in PDF */}
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Task Force Report
            </h2>
            <p className="text-gray-500 text-sm">
              Generated: {format(new Date(), "PPP")} | Period:{" "}
              {date?.from ? format(date.from, "PPP") : "..."} -{" "}
              {date?.to ? format(date.to, "PPP") : "..."}
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-1">
            {daysDiff} Days
          </Badge>
        </div>

        {/* --- KPI GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gray-50 border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-500 uppercase">
                Total Issues
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {reports?.total_issues || 0}
              </h3>
            </CardContent>
          </Card>
          <Card className="bg-gray-50 border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-500 uppercase">
                Resolved
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {reports?.resolved_issues || 0}
              </h3>
            </CardContent>
          </Card>
          <Card className="bg-gray-50 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-500 uppercase">
                Pending
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {reports?.status_distribution?.assigned_to_task_force || 0}
              </h3>
            </CardContent>
          </Card>
          <Card className="bg-gray-50 border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-gray-500 uppercase">
                Efficiency
              </p>
              <h3 className="text-3xl font-bold text-gray-900 mt-2">
                {resolutionRate}%
              </h3>
            </CardContent>
          </Card>
        </div>

        {/* --- CHARTS ROW 1 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:gap-4 print:grid-cols-2">
          {/* MONTHLY TRENDS CHART */}
          <div className="border rounded-lg p-6 break-inside-avoid">
            <h3 className="text-lg font-bold mb-4">Monthly Trends</h3>
            <div className="h-[300px]">
              {(reports?.monthly_trends?.length ?? 0) > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reports?.monthly_trends}>
                    <defs>
                      <linearGradient
                        id="colorSubmitted"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.primary}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.primary}
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorResolved"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS.success}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS.success}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E5E7EB"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="#9CA3AF"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#9CA3AF"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ stroke: "#9CA3AF", strokeWidth: 1 }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="submitted"
                      name="Submitted"
                      stroke={COLORS.primary}
                      fillOpacity={1}
                      fill="url(#colorSubmitted)"
                    />
                    <Area
                      type="monotone"
                      dataKey="resolved"
                      name="Resolved"
                      stroke={COLORS.success}
                      fillOpacity={1}
                      fill="url(#colorResolved)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No trend data available yet.
                </div>
              )}
            </div>
            <div className="mt-4 bg-purple-50 p-3 rounded text-sm text-purple-900">
              <strong>Interpretation:</strong>{" "}
              {(() => {
                const trends = reports?.monthly_trends;
                if (!trends || trends.length < 2)
                  return "Not enough data to determine trend.";
                const recent = trends[trends.length - 1];
                const previous = trends[trends.length - 2];
                const submittedDelta = recent.submitted - previous.submitted;
                const resolvedDelta = recent.resolved - previous.resolved;
                const parts = [];
                if (submittedDelta > 0)
                  parts.push(
                    `Submissions increased by ${submittedDelta} vs previous month.`,
                  );
                else if (submittedDelta < 0)
                  parts.push(
                    `Submissions decreased by ${Math.abs(submittedDelta)} vs previous month.`,
                  );
                else parts.push("Submissions are steady.");
                if (resolvedDelta > 0)
                  parts.push(`Resolutions up by ${resolvedDelta}.`);
                else if (resolvedDelta < 0)
                  parts.push(`Resolutions down by ${Math.abs(resolvedDelta)}.`);
                else parts.push("Resolutions are steady.");
                return parts.join(" ");
              })()}
            </div>
          </div>

          {/* STATUS DISTRIBUTION */}
          <div className="border rounded-lg p-6 break-inside-avoid">
            <h3 className="text-lg font-bold mb-4">Current Status Split</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 bg-blue-50 p-3 rounded text-sm text-blue-900">
              <strong>Interpretation:</strong>{" "}
              {statusData[0]?.value > 10
                ? "Backlog needs attention."
                : "Workload is manageable."}
            </div>
          </div>
        </div>

        {/* --- TEAM PERFORMANCE --- */}
        <div className="border rounded-lg p-6 bg-white break-inside-avoid">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Team Performance
          </h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Assessments</TableHead>
                  <TableHead className="text-center">Resolved</TableHead>
                  <TableHead className="text-center">Efficiency</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`}
                        />
                        <AvatarFallback>
                          {member.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      {member.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {member.title || "Officer"}
                    </TableCell>
                    <TableCell className="text-center">
                      {member.assessments_completed}
                    </TableCell>
                    <TableCell className="text-center">
                      {member.resolutions_completed}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          member.completion_rate > 80 ? "default" : "secondary"
                        }
                      >
                        {member.completion_rate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                          member.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700",
                        )}
                      >
                        {member.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
                {teamMembers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      No team members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* --- ANALYSIS & NOTES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:gap-4 print:grid-cols-2 break-inside-avoid">
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Automated Insights
            </h3>
            <ul className="space-y-3">
              {automatedInsights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-700">
                  <ArrowUpRight className="h-5 w-5 text-gray-400 mt-0.5" />
                  {insight}
                </li>
              ))}
              <li className="flex items-start gap-2 text-gray-700">
                <ArrowUpRight className="h-5 w-5 text-gray-400 mt-0.5" />
                Avg resolution time:{" "}
                {reports?.avg_resolution_days
                  ? Number(reports.avg_resolution_days).toFixed(1)
                  : "N/A"}{" "}
                days.
              </li>
            </ul>
          </div>

          <div className="border rounded-lg p-6 bg-yellow-50/30 border-yellow-100">
            <h3 className="text-lg font-bold mb-2 text-yellow-900">
              Officer Notes & Interpretation
            </h3>
            <p className="text-xs text-yellow-700 mb-2 print:hidden">
              Add your analysis before exporting to PDF.
            </p>
            <Textarea
              placeholder="Enter manual interpretation here... e.g., 'Delay in resolution due to weather conditions in Sector 4.'"
              className="min-h-[150px] bg-white border-yellow-200"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* --- PRINT LAYOUT --- */}
      <ReportPrintLayout
        reports={reports}
        teamMembers={teamMembers}
        velocityData={reports?.monthly_trends ?? []}
        dateRange={{ from: date?.from, to: date?.to }}
        notes={notes}
        automatedInsights={automatedInsights}
      />
    </div>
  );
}
