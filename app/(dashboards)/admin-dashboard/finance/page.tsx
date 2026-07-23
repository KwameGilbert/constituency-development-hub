"use client";

import React, { useEffect, useState } from "react";
import { AdminHeader } from "@/components/admin-dashboard/AdminHeader";
import { FinanceTable } from "@/components/admin-dashboard/finance/FinanceTable";
import {
  financeService,
  FinanceProject,
  FinanceIssue,
  FinanceSummary,
} from "@/lib/services/finance-service";
import { Loader2 } from "lucide-react";

export default function FinancePage() {
  const [projects, setProjects] = useState<FinanceProject[]>([]);
  const [issues, setIssues] = useState<FinanceIssue[]>([]);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await financeService.getFinanceOverview();

        if (res && res.success && res.data) {
          setProjects(res.data.projects || []);
          setIssues(res.data.issues || []);
          setSummary(res.data.summary || null);
          setError(null);
        } else {
          setError(res?.message || "Failed to load finance data");
        }
      } catch (e) {
        console.error("Failed to fetch finance data:", e);
        setError(
          e instanceof Error ? e.message : "Failed to load finance data",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 overflow-hidden">
      <AdminHeader
        title="Finance"
        description="Budget allocation and expenditure oversight"
        roleAbbr="MP"
      />
      <div className="flex-1 p-6 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full overflow-y-auto custom-scrollbar pb-20">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-amber-500 rounded-full" />
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Financial Overview
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Strategic budget tracking and fiscal accountability
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 font-medium">
            Error: {error}
          </div>
        ) : (
          <FinanceTable projects={projects} issues={issues} summary={summary} />
        )}
      </div>
    </div>
  );
}
