import { apiClient } from "../api-client";

// Admin Dashboard Stats
export interface AdminDashboardStats {
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

// Officer Dashboard Stats
export interface OfficerDashboardStats {
  my_issues: {
    total: number;
    pending_review: number;
    in_progress: number;
    resolved: number;
  };
  performance: {
    average_review_time_hours: number;
    issues_reviewed_this_month: number;
  };
  team: {
    total_agents: number;
    active_agents: number;
  };
}

// Agent Dashboard Stats
export interface AgentDashboardStats {
  my_issues: {
    total: number;
    pending: number;
    in_progress: number;
    resolved: number;
  };
  performance: {
    average_response_time_hours: number;
    issues_handled_this_month: number;
    satisfaction_rating: number;
  };
}

// Task Force Dashboard Stats
export interface TaskForceDashboardStats {
  my_task_force: {
    name: string;
    total_members: number;
    active_assignments: number;
  };
  my_assignments: {
    total: number;
    pending_assessment: number;
    in_progress: number;
    completed: number;
  };
  team_performance: {
    average_completion_days: number;
    assignments_completed_this_month: number;
  };
}

// Response types
export interface AdminStatsResponse {
  success: boolean;
  message: string;
  data: AdminDashboardStats;
}

export interface OfficerStatsResponse {
  success: boolean;
  message: string;
  data: OfficerDashboardStats;
}

export interface AgentStatsResponse {
  success: boolean;
  message: string;
  data: AgentDashboardStats;
}

export interface TaskForceStatsResponse {
  success: boolean;
  message: string;
  data: TaskForceDashboardStats;
}

// Backward compatibility alias
export type DashboardStats = AdminDashboardStats;
export type DashboardStatsResponse = AdminStatsResponse;

export const dashboardService = {
  // Admin dashboard stats
  getAdminStats: async (): Promise<AdminStatsResponse> => {
    return apiClient<AdminStatsResponse>('/admin/dashboard/stats', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Officer dashboard stats
  getOfficerStats: async (): Promise<OfficerStatsResponse> => {
    return apiClient<OfficerStatsResponse>('/officer/dashboard/stats', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Agent dashboard stats
  getAgentStats: async (): Promise<AgentStatsResponse> => {
    return apiClient<AgentStatsResponse>('/agent/dashboard/stats', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Task Force dashboard stats
  getTaskForceStats: async (): Promise<TaskForceStatsResponse> => {
    return apiClient<TaskForceStatsResponse>('/task-force/dashboard/stats', {
      method: 'GET',
      requiresAuth: true,
    });
  },
};
