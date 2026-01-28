import { apiClient } from "@/lib/api-client";

// --- Interfaces ---

export interface ReportsSummary {
  total_issues: number;
  pending_issues: number;
  resolved_issues: number;
  avg_resolution_time: number;
}

export interface BreakdownItem {
  name: string;
  count: number;
  percentage: number;
}

export interface ReportsBreakdown {
  issues_by_category: BreakdownItem[];
  issues_by_location: BreakdownItem[];
  total: number;
}

export interface RecentActivity {
  id: number;
  case_id: string;
  title: string;
  status: string;
  category: string;
  agent_name: string | null;
  updated_at: string;
  formatted_date: string;
}

export interface TrendData {
  name: string;
  month: string;
  total: number;
  resolved: number;
}

export interface StatusDistributionItem {
  name: string;
  value: number;
  color: string;
  status: string;
}

export interface AgentPerformance {
  id: number;
  name: string;
  agent_code: string;
  issues_submitted: number;
  issues_resolved: number;
  resolution_rate: number;
  avg_resolution_time: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// --- Service Class ---

class OfficerReportsService {
  /**
   * Get summary statistics for reports dashboard
   * GET /v1/officer/reports/summary
   */
  async getSummary(): Promise<ApiResponse<ReportsSummary>> {
    return apiClient("/officer/reports/summary", {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Get issues breakdown by category and location
   * GET /v1/officer/reports/breakdown
   */
  async getBreakdown(): Promise<ApiResponse<ReportsBreakdown>> {
    return apiClient("/officer/reports/breakdown", {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Get recent activity feed
   * GET /v1/officer/reports/recent-activity
   */
  async getRecentActivity(
    limit: number = 10,
  ): Promise<ApiResponse<{ activities: RecentActivity[] }>> {
    return apiClient(`/officer/reports/recent-activity?limit=${limit}`, {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Get monthly trends data for charts
   * GET /v1/officer/reports/trends
   */
  async getTrends(
    months: number = 12,
  ): Promise<ApiResponse<{ trends: TrendData[] }>> {
    return apiClient(`/officer/reports/trends?months=${months}`, {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Get status distribution for pie chart
   * GET /v1/officer/reports/status-distribution
   */
  async getStatusDistribution(): Promise<
    ApiResponse<{ distribution: StatusDistributionItem[] }>
  > {
    return apiClient("/officer/reports/status-distribution", {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Get top agent performance metrics
   * GET /v1/officer/reports/agent-performance
   */
  async getAgentPerformance(
    limit: number = 10,
  ): Promise<ApiResponse<{ agents: AgentPerformance[] }>> {
    return apiClient(`/officer/reports/agent-performance?limit=${limit}`, {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Get officer profile stats for activity overview
   * GET /v1/officer/reports/profile-stats
   */
  async getProfileStats(): Promise<ApiResponse<ProfileStats>> {
    return apiClient("/officer/reports/profile-stats", {
      method: "GET",
      requiresAuth: true,
    });
  }
}

// Profile stats interfaces
export interface ActivityStats {
  total_issues: number;
  pending_review: number;
  resolved: number;
  active_agents: number;
}

export interface OfficerData {
  employee_id: string | null;
  department: string | null;
  position: string | null;
  assigned_locations: string[] | null;
  supervised_agents_count: number;
  pending_reports_count: number;
  permissions: {
    can_manage_projects: boolean;
    can_manage_reports: boolean;
    can_manage_events: boolean;
    can_publish_content: boolean;
  };
}

export interface ProfileStats {
  activity: ActivityStats;
  officer: OfficerData | null;
}

export const officerReportsService = new OfficerReportsService();
