"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
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
} from "lucide-react";
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
  if (ratio > 100)
    return "bg-red-100 text-red-800 border-red-200";
  if (ratio > 80)
    return "bg-yellow-100 text-yellow-800 border-yellow-200";
  return "bg-green-100 text-green-800 border-green-200";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "planning":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "ongoing":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "on_hold":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "resolved":
    case "closed":
      return "bg-green-100 text-green-800 border-green-200";
    case "resolution_in_progress":
    case "assessment_in_progress":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// ---- Pagination Hook ----
function usePagination<T>(items: T[], defaultPageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.ceil(items.length / pageSize);
  const paginated = items.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const goFirst = () => setCurrentPage(1);
  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const goLast = () => setCurrentPage(totalPages);
  const changePageSize = (size: string) => {
    setPageSize(Number(size));
    setCurrentPage(1);
  };

  return {
    currentPage,
    pageSize,
    totalPages,
    paginated,
    goFirst,
    goPrev,
    goNext,
    goLast,
    changePageSize,
    totalItems: items.length,
  };
}

// ---- Pagination Controls ----
function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onPageSizeChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onPageSizeChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={onPageSizeChange}
        >
          <SelectTrigger className="w-[70px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages} ({totalItems} items)
        </span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onFirst} disabled={currentPage === 1}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onPrev} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onNext} disabled={currentPage === totalPages || totalPages === 0}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={onLast} disabled={currentPage === totalPages || totalPages === 0}>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ---- Summary Cards ----
function SummaryCards({
  totalBudget,
  totalSpent,
  itemCount,
  label,
}: {
  totalBudget: number;
  totalSpent: number;
  itemCount: number;
  label: string;
}) {
  const remaining = totalBudget - totalSpent;
  const spendPercent = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Budget</p>
            <p className="text-lg font-semibold">{formatCurrency(totalBudget)}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Spent</p>
            <p className="text-lg font-semibold">{formatCurrency(totalSpent)}</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${remaining >= 0 ? "bg-green-100" : "bg-red-100"}`}>
            <AlertTriangle className={`h-5 w-5 ${remaining >= 0 ? "text-green-600" : "text-red-600"}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500">Remaining</p>
            <p className={`text-lg font-semibold ${remaining < 0 ? "text-red-600" : ""}`}>
              {formatCurrency(remaining)}
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{label} Count</p>
            <p className="text-lg font-semibold">{itemCount}</p>
            <p className="text-xs text-gray-400">{spendPercent.toFixed(1)}% spent</p>
          </div>
        </div>
      </Card>
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
      <SummaryCards
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        itemCount={projects.length}
        label="Projects"
      />

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {pg.paginated.map((project) => {
          const spent = project.spent || 0;
          const ratio = getSpendRatio(spent, project.budget);
          return (
            <Card key={project.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">{project.title}</h3>
                <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                  {project.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">{project.sector?.name || "—"}</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="font-medium">{formatCurrency(project.budget)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Spent</p>
                  <p className="font-medium">{formatCurrency(spent)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Usage</p>
                  <Badge className={`text-xs ${getSpendBadge(ratio)}`}>
                    {ratio.toFixed(1)}%
                  </Badge>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${ratio > 100 ? "bg-red-500" : ratio > 80 ? "bg-yellow-500" : "bg-green-500"}`}
                  style={{ width: `${Math.min(ratio, 100)}%` }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Project</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Sector</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Budget</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Spent</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Remaining</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pg.paginated.map((project, idx) => {
                  const spent = project.spent || 0;
                  const remaining = project.budget - spent;
                  const ratio = getSpendRatio(spent, project.budget);
                  return (
                    <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500">
                        {(pg.currentPage - 1) * pg.pageSize + idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800">{project.title}</div>
                        <div className="text-xs text-gray-500">{project.location}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{project.sector?.name || "—"}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                          {project.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(project.budget)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(spent)}</td>
                      <td className={`py-3 px-4 text-right font-medium ${remaining < 0 ? "text-red-600" : ""}`}>
                        {formatCurrency(remaining)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${ratio > 100 ? "bg-red-500" : ratio > 80 ? "bg-yellow-500" : "bg-green-500"}`}
                              style={{ width: `${Math.min(ratio, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 w-12 text-right">{ratio.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {pg.paginated.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No projects found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <PaginationControls
        currentPage={pg.currentPage}
        totalPages={pg.totalPages}
        totalItems={pg.totalItems}
        pageSize={pg.pageSize}
        onFirst={pg.goFirst}
        onPrev={pg.goPrev}
        onNext={pg.goNext}
        onLast={pg.goLast}
        onPageSizeChange={pg.changePageSize}
      />
    </div>
  );
}

// ---- Issues Finance Table ----
function IssuesFinanceTab({ issues }: { issues: FinanceIssue[] }) {
  const pg = usePagination(issues);

  const totalBudget = issues.reduce(
    (sum, i) => sum + (i.allocated_budget || i.estimated_cost || 0),
    0
  );
  const totalSpent = issues.reduce(
    (sum, i) => sum + (i.actual_cost || 0),
    0
  );

  return (
    <div>
      <SummaryCards
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        itemCount={issues.length}
        label="Issues"
      />

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {pg.paginated.map((issue) => {
          const budget = issue.allocated_budget || issue.estimated_cost || 0;
          const spent = issue.actual_cost || 0;
          const ratio = getSpendRatio(spent, budget);
          return (
            <Card key={issue.id} className="p-4 space-y-2">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm">{issue.title}</h3>
                <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                  {issue.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">{issue.case_id || `#${issue.id}`}</div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Allocated</p>
                  <p className="font-medium">{formatCurrency(budget)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Spent</p>
                  <p className="font-medium">{formatCurrency(spent)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Usage</p>
                  <Badge className={`text-xs ${getSpendBadge(ratio)}`}>
                    {budget > 0 ? `${ratio.toFixed(1)}%` : "—"}
                  </Badge>
                </div>
              </div>
              {budget > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${ratio > 100 ? "bg-red-500" : ratio > 80 ? "bg-yellow-500" : "bg-green-500"}`}
                    style={{ width: `${Math.min(ratio, 100)}%` }}
                  />
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Issue</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Case ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Priority</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Allocated</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Spent</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pg.paginated.map((issue, idx) => {
                  const budget = issue.allocated_budget || issue.estimated_cost || 0;
                  const spent = issue.actual_cost || 0;
                  const remaining = budget - spent;
                  const ratio = getSpendRatio(spent, budget);
                  return (
                    <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500">
                        {(pg.currentPage - 1) * pg.pageSize + idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-800 max-w-[200px] truncate">{issue.title}</div>
                        <div className="text-xs text-gray-500">{issue.location}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-xs">
                        {issue.case_id || `#${issue.id}`}
                      </td>
                      <td className="py-3 px-4 text-gray-600">{issue.category}</td>
                      <td className="py-3 px-4">
                        <Badge className={`text-xs ${getStatusColor(issue.status)}`}>
                          {issue.status.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={`text-xs ${
                            issue.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : issue.priority === "high"
                                ? "bg-orange-100 text-orange-800"
                                : issue.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {issue.priority}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(budget)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(spent)}</td>
                      <td className="py-3 px-4">
                        {budget > 0 ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${ratio > 100 ? "bg-red-500" : ratio > 80 ? "bg-yellow-500" : "bg-green-500"}`}
                                style={{ width: `${Math.min(ratio, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500 w-12 text-right">{ratio.toFixed(1)}%</span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 text-center block">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {pg.paginated.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No issues found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <PaginationControls
        currentPage={pg.currentPage}
        totalPages={pg.totalPages}
        totalItems={pg.totalItems}
        pageSize={pg.pageSize}
        onFirst={pg.goFirst}
        onPrev={pg.goPrev}
        onNext={pg.goNext}
        onLast={pg.goLast}
        onPageSizeChange={pg.changePageSize}
      />
    </div>
  );
}

// ---- Main Finance Table Component ----
export function FinanceTable({ projects, issues, summary }: FinanceTableProps) {
  return (
    <Tabs defaultValue="projects" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
        <TabsTrigger value="issues">Issues ({issues.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="projects" className="mt-6">
        <ProjectsFinanceTab projects={projects} />
      </TabsContent>
      <TabsContent value="issues" className="mt-6">
        <IssuesFinanceTab issues={issues} />
      </TabsContent>
    </Tabs>
  );
}
