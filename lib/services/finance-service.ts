import { apiClient } from "../api-client";

// --- Interfaces ---

export interface FinanceProject {
  id: number;
  title: string;
  slug: string;
  location: string;
  status: "planning" | "ongoing" | "completed" | "on_hold";
  progress_percent?: number;
  budget: number;
  spent: number;
  start_date: string;
  end_date: string;
  sector: {
    id: number;
    name: string;
  } | null;
  contractor?: string;
  created_at?: string;
}

export interface FinanceIssue {
  id: number;
  case_id?: string;
  title: string;
  category: string;
  location: string;
  status: string;
  priority: "low" | "medium" | "high" | "urgent";
  allocated_budget: number;
  estimated_cost: number;
  actual_cost: number;
  created_at?: string;
}

export interface FinanceSummary {
  projects_total_budget: number;
  projects_total_spent: number;
  issues_total_allocated: number;
  issues_total_spent: number;
  grand_total_budget: number;
  grand_total_spent: number;
  projects_count: number;
  issues_count: number;
}

export interface FinanceOverviewResponse {
  success: boolean;
  message: string;
  data: {
    projects: FinanceProject[];
    issues: FinanceIssue[];
    summary: FinanceSummary;
  };
}

// --- Service ---

class FinanceService {
  async getFinanceOverview(): Promise<FinanceOverviewResponse> {
    return apiClient<FinanceOverviewResponse>("/admin/dashboard/finance");
  }
}

export const financeService = new FinanceService();
