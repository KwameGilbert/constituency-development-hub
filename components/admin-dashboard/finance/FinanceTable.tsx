"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Download,
  Wallet,
  PieChart,
  BarChart3,
  Calendar,
  Layers,
  MapPin,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FinanceProject,
  FinanceIssue,
  FinanceSummary,
} from "@/lib/services/finance-service";

interface FinanceTableProps {
  projects: FinanceProject[];
  issues: FinanceIssue[];
  summary: FinanceSummary | null;
}

const formatCurrency = (amount: number | string | undefined | null) => {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (num == null || isNaN(num)) return "₵0";
  return `₵${num.toLocaleString()}`;
};

const getSpendRatio = (spent: number, budget: number) => {
  if (!budget || budget === 0) return 0;
  return (spent / budget) * 100;
};

const getSpendBadge = (ratio: number) => {
  if (ratio > 100) return "bg-red-50 text-red-700 border-red-100 font-black";
  if (ratio > 80) return "bg-amber-50 text-amber-900 border-amber-200/50 font-black";
  return "bg-emerald-50 text-emerald-700 border-emerald-100 font-black";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "planning":
      return "bg-indigo-50 text-indigo-700 border-indigo-100";
    case "ongoing":
      return "bg-amber-50 text-amber-900 border-amber-200/50";
    case "completed":
      return "bg-emerald-50 text-emerald-800 border-emerald-100";
    case "on_hold":
      return "bg-slate-100 text-slate-600 border-slate-200";
    case "resolved":
    case "closed":
      return "bg-emerald-50 text-emerald-800 border-emerald-100";
    case "resolution_in_progress":
    case "assessment_in_progress":
      return "bg-amber-50 text-amber-900 border-amber-200/50";
    default:
      return "bg-slate-50 text-slate-500 border-slate-100";
  }
};

// ---- Excel Export Helpers ----
function exportProjectsToExcel(projects: FinanceProject[]) {
  const data = projects.map((p, i) => ({
    "#": i + 1,
    Project: p.title,
    Location: p.location,
    Sector: p.sector?.name || "—",
    Status: p.status.replace(/_/g, " "),
    Contractor: p.contractor || "—",
    "Budget (₵)": p.budget || 0,
    "Spent (₵)": p.spent || 0,
    "Remaining (₵)": (p.budget || 0) - (p.spent || 0),
    "Usage (%)":
      p.budget > 0 ? Number(((p.spent / p.budget) * 100).toFixed(1)) : 0,
    "Progress (%)": p.progress_percent ?? 0,
    "Start Date": p.start_date || "—",
    "End Date": p.end_date || "—",
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...data.map((r) => String(r[key as keyof typeof r] ?? "").length)) + 2,
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Projects Finance");
  XLSX.writeFile(wb, `Projects_Finance_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function exportIssuesToExcel(issues: FinanceIssue[]) {
  const data = issues.map((issue, i) => ({
    "#": i + 1,
    Issue: issue.title,
    "Case ID": issue.case_id || `#${issue.id}`,
    Category: issue.category,
    Location: issue.location,
    Status: issue.status.replace(/_/g, " "),
    Priority: issue.priority,
    "Allocated Budget (₵)": issue.allocated_budget || 0,
    "Estimated Cost (₵)": issue.estimated_cost || 0,
    "Actual Cost (₵)": issue.actual_cost || 0,
    "Remaining (₵)": (issue.allocated_budget || issue.estimated_cost || 0) - (issue.actual_cost || 0),
    "Usage (%)": (() => {
      const budget = issue.allocated_budget || issue.estimated_cost || 0;
      return budget > 0 ? Number(((issue.actual_cost / budget) * 100).toFixed(1)) : 0;
    })(),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = Object.keys(data[0] || {}).map((key) => ({
    wch: Math.max(key.length, ...data.map((r) => String(r[key as keyof typeof r] ?? "").length)) + 2,
  }));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Issues Finance");
  XLSX.writeFile(wb, `Issues_Finance_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

function exportAllToExcel(
  projects: FinanceProject[],
  issues: FinanceIssue[],
  summary: FinanceSummary | null,
) {
  const wb = XLSX.utils.book_new();

  if (summary) {
    const summaryData = [
      { Category: "Projects - Total Budget", "Amount (₵)": summary.projects_total_budget },
      { Category: "Projects - Total Spent", "Amount (₵)": summary.projects_total_spent },
      { Category: "Projects - Remaining", "Amount (₵)": summary.projects_total_budget - summary.projects_total_spent },
      { Category: "Projects - Count", "Amount (₵)": summary.projects_count },
      { Category: "", "Amount (₵)": "" },
      { Category: "Issues - Total Allocated", "Amount (₵)": summary.issues_total_allocated },
      { Category: "Issues - Total Spent", "Amount (₵)": summary.issues_total_spent },
      { Category: "Issues - Remaining", "Amount (₵)": summary.issues_total_allocated - summary.issues_total_spent },
      { Category: "Issues - Count", "Amount (₵)": summary.issues_count },
      { Category: "", "Amount (₵)": "" },
      { Category: "Grand Total Budget", "Amount (₵)": summary.grand_total_budget },
      { Category: "Grand Total Spent", "Amount (₵)": summary.grand_total_spent },
      { Category: "Grand Total Remaining", "Amount (₵)": summary.grand_total_budget - summary.grand_total_spent },
    ];
    const summaryWs = XLSX.utils.json_to_sheet(summaryData);
    summaryWs["!cols"] = [{ wch: 30 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, summaryWs, "Summary");
  }

  const projData = projects.map((p, i) => ({
    "#": i + 1, Project: p.title, Location: p.location, Sector: p.sector?.name || "—", Status: p.status, Contractor: p.contractor || "—", "Budget (₵)": p.budget, "Spent (₵)": p.spent, "Progress (%)": p.progress_percent ?? 0,
  }));
  if (projData.length > 0) {
    const projWs = XLSX.utils.json_to_sheet(projData);
    XLSX.utils.book_append_sheet(wb, projWs, "Projects");
  }

  const issueData = issues.map((issue, i) => ({
    "#": i + 1, Issue: issue.title, "Case ID": issue.case_id, Category: issue.category, Location: issue.location, Status: issue.status, "Allocated (₵)": issue.allocated_budget, "Actual (₵)": issue.actual_cost,
  }));
  if (issueData.length > 0) {
    const issueWs = XLSX.utils.json_to_sheet(issueData);
    XLSX.utils.book_append_sheet(wb, issueWs, "Issues");
  }

  XLSX.writeFile(wb, `Finance_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

// ---- Pagination Hook ----
function usePagination<T>(items: T[], defaultPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.ceil(items.length / pageSize);
  const paginated = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const goFirst = () => setCurrentPage(1);
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goLast = () => setCurrentPage(totalPages);
  const changePageSize = (size: string) => { setPageSize(Number(size)); setCurrentPage(1); };

  return { currentPage, pageSize, totalPages, paginated, goFirst, goPrev, goNext, goLast, changePageSize, totalItems: items.length };
}

// ---- Pagination Controls ----
function PaginationControls({
  currentPage, totalPages, totalItems, pageSize, onFirst, onPrev, onNext, onLast, onPageSizeChange,
}: {
  currentPage: number; totalPages: number; totalItems: number; pageSize: number;
  onFirst: () => void; onPrev: () => void; onNext: () => void; onLast: () => void; onPageSizeChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-100">
      <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Rows per page:</span>
        <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
          <SelectTrigger className="w-[70px] h-8 bg-white border-slate-100 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-100">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-4">Page {currentPage} of {totalPages} ({totalItems} records)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={onFirst} disabled={currentPage === 1}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={onPrev} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={onNext} disabled={currentPage === totalPages || totalPages === 0}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white" onClick={onLast} disabled={currentPage === totalPages || totalPages === 0}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ---- Summary Cards ----
function SummaryCards({ totalBudget, totalSpent, itemCount, label }: {
  totalBudget: number; totalSpent: number; itemCount: number; label: string;
}) {
  const remaining = totalBudget - totalSpent;
  const spendPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const metrics = [
    { label: "Aggregate Budget", value: formatCurrency(totalBudget), icon: Wallet, color: "text-amber-500", bg: "from-amber-500/10 to-amber-500/20" },
    { label: "Total Expenditure", value: formatCurrency(totalSpent), icon: TrendingUp, color: "text-slate-900", bg: "from-slate-100 to-slate-200" },
    { label: "Available Liquidity", value: formatCurrency(remaining), icon: AlertTriangle, color: remaining < 0 ? "text-red-500" : "text-emerald-500", bg: remaining < 0 ? "from-red-50 to-red-100" : "from-emerald-50 to-emerald-100" },
    { label: `${label} Allocation`, value: itemCount, icon: PieChart, color: "text-slate-400", bg: "from-slate-50 to-slate-100", sub: `${spendPercent.toFixed(1)}% Uitilization` },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {metrics.map((m, idx) => (
        <Card key={idx} className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
          <CardContent className="p-5 flex items-center gap-4">
             <div className={`p-3 rounded-2xl bg-linear-to-br ${m.bg} ${m.color}`}>
                <m.icon className="w-6 h-6 stroke-[2.5px]" />
             </div>
             <div className="flex flex-col min-w-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{m.label}</p>
                <p className={`text-lg font-black tracking-tight truncate leading-none mt-1 ${m.label === 'Available Liquidity' && remaining < 0 ? 'text-red-600' : 'text-slate-900'}`}>
                  {m.value}
                </p>
                {m.sub && <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider opacity-60">{m.sub}</span>}
             </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ---- Projects Finance Table ----
function ProjectsFinanceTab({ projects }: { projects: FinanceProject[] }) {
  const pg = usePagination(projects);
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);

  return (
    <div>
      <SummaryCards totalBudget={totalBudget} totalSpent={totalSpent} itemCount={projects.length} label="Projects" />
      <div className="flex justify-end mb-6">
        <Button variant="ghost" size="sm" onClick={() => exportProjectsToExcel(projects)} disabled={projects.length === 0} className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 border border-slate-100 shadow-xs">
          <Download className="h-4 w-4" /> Export Ledger
        </Button>
      </div>

      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest w-12">#</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Investment Name</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Capital</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deployed</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Surplus</th>
                <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pg.paginated.map((project, idx) => {
                const spent = project.spent || 0;
                const ratio = getSpendRatio(spent, project.budget);
                return (
                  <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-300">{(pg.currentPage - 1) * pg.pageSize + idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors">{project.title}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                           <MapPin className="w-3 h-3 text-slate-300" />
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{project.location}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 border shadow-xs ${getStatusColor(project.status)}`}>{project.status.replace(/_/g, " ")}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900 text-xs">{formatCurrency(project.budget)}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-600 text-xs">{formatCurrency(spent)}</td>
                    <td className={`px-6 py-4 text-right font-bold text-xs ${project.budget - spent < 0 ? "text-red-600 bg-red-50/50" : "text-emerald-600"}`}>{formatCurrency(project.budget - spent)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className={`h-1.5 rounded-full shadow-xs transition-all duration-1000 ${ratio > 100 ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${Math.min(ratio, 100)}%` }} />
                        </div>
                        <Badge className={`text-[10px] px-1.5 py-0 min-w-[45px] justify-center ${getSpendBadge(ratio)}`}>{ratio.toFixed(1)}%</Badge>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PaginationControls {...pg} onPageSizeChange={pg.changePageSize} onFirst={pg.goFirst} onPrev={pg.goPrev} onNext={pg.goNext} onLast={pg.goLast} />
      </Card>
    </div>
  );
}

// ---- Issues Finance Table ----
function IssuesFinanceTab({ issues }: { issues: FinanceIssue[] }) {
  const pg = usePagination(issues);
  const totalBudget = issues.reduce((sum, i) => sum + (i.allocated_budget || i.estimated_cost || 0), 0);
  const totalSpent = issues.reduce((sum, i) => sum + (i.actual_cost || 0), 0);

  return (
    <div>
      <SummaryCards totalBudget={totalBudget} totalSpent={totalSpent} itemCount={issues.length} label="Operations" />
      <div className="flex justify-end mb-6">
        <Button variant="ghost" size="sm" onClick={() => exportIssuesToExcel(issues)} disabled={issues.length === 0} className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2 hover:bg-slate-100 text-slate-400 hover:text-slate-900 border border-slate-100 shadow-xs">
          <Download className="h-4 w-4" /> Export Report
        </Button>
      </div>

      <Card className="border-none shadow-md shadow-slate-200/40 rounded-2xl overflow-hidden bg-white">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest w-12">#</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Incident Details</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case ID</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Department</th>
                <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Allocation</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utilization</th>
                <th className="px-6 py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Burn Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {pg.paginated.map((issue, idx) => {
                const budget = issue.allocated_budget || issue.estimated_cost || 0;
                const spent = issue.actual_cost || 0;
                const ratio = getSpendRatio(spent, budget);
                return (
                  <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-[10px] font-bold text-slate-300">{(pg.currentPage - 1) * pg.pageSize + idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors truncate max-w-[180px]">{issue.title}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{issue.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-500 uppercase">{issue.case_id || `#${issue.id}`}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{issue.category}</td>
                    <td className="px-6 py-4">
                       <Badge className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border shadow-xs ${issue.priority === "urgent" ? "bg-red-50 text-red-600 border-red-100" : issue.priority === "high" ? "bg-amber-50 text-amber-900 border-amber-200/50" : "bg-slate-50 text-slate-500 border-slate-100"}`}>
                        {issue.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-slate-900 text-xs">{formatCurrency(budget)}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-600 text-xs">{formatCurrency(spent)}</td>
                    <td className="px-6 py-4">
                      {budget > 0 ? (
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`h-1.5 rounded-full shadow-xs transition-all duration-1000 ${ratio > 100 ? "bg-red-500" : "bg-amber-500"}`} style={{ width: `${Math.min(ratio, 100)}%` }} />
                          </div>
                          <Badge className={`text-[10px] px-1.5 py-0 min-w-[45px] justify-center ${getSpendBadge(ratio)}`}>{ratio.toFixed(1)}%</Badge>
                        </div>
                      ) : <span className="text-[10px] font-bold text-slate-300 block text-center italic">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <PaginationControls {...pg} onPageSizeChange={pg.changePageSize} onFirst={pg.goFirst} onPrev={pg.goPrev} onNext={pg.goNext} onLast={pg.goLast} />
      </Card>
    </div>
  );
}

// ---- Main Finance Table Component ----
export function FinanceTable({ projects, issues, summary }: FinanceTableProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="default"
          size="sm"
          onClick={() => exportAllToExcel(projects, issues, summary)}
          disabled={projects.length === 0 && issues.length === 0}
          className="h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest flex items-center gap-3 group transition-all"
        >
          <div className="p-1.5 bg-amber-500 rounded-lg group-hover:rotate-12 transition-transform">
             <Download className="h-4 w-4 text-slate-950" />
          </div>
          Audit Ledger Export
        </Button>
      </div>

      <Tabs defaultValue="projects" className="w-full">
        <TabsList className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-2xl w-fit mb-8 border border-slate-200/60 backdrop-blur-sm">
          <TabsTrigger 
            value="projects"
            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/20 text-slate-400"
          >
            Capital Projects
          </TabsTrigger>
          <TabsTrigger 
            value="issues"
            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-amber-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg data-[state=active]:shadow-amber-500/20 text-slate-400"
          >
            Operational Issues
          </TabsTrigger>
        </TabsList>
        <TabsContent value="projects" className="mt-0 focus-visible:outline-none">
          <ProjectsFinanceTab projects={projects} />
        </TabsContent>
        <TabsContent value="issues" className="mt-0 focus-visible:outline-none">
          <IssuesFinanceTab issues={issues} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
