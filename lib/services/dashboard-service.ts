import { apiClient } from "../api-client";

export interface DashboardStats {
  overview: {
    total_issues: number;
    active_users: number;
    total_projects: number;
    total_budget: number;
  };
  users_by_role: {
    admin: number;
    web_admin: number;
    officer: number;
    agent: number;
    task_force: number;
  };
  issues: {
    pending_review: number;
    assigned: number;
    in_progress: number;
    resolved: number;
    closed: number;
  };
  projects: {
    planning: number;
    ongoing: number;
    completed: number;
    on_hold: number;
  };
}

export interface DashboardStatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

export const dashboardService = {
  getAdminStats: async (): Promise<DashboardStatsResponse> => {
    return apiClient<DashboardStatsResponse>('/admin/dashboard/stats', {
      method: 'GET',
      requiresAuth: true,
    });
  },
};
