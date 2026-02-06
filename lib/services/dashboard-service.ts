import { apiClient } from "../api-client";

// Admin Dashboard Stats
export interface AdminDashboardStats {
  overview: {
    total_issues: number;
    active_users: number;
    total_projects: number;
    total_budget: number;
    total_issues_budget: number;
    grand_total_budget: number;
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
  content_stats?: {
    blog_posts: number;
    events: number;
    upcoming_events: number;
    carousel_items: number;
  };
}

// Admin Charts Data
export interface AdminChartsData {
  charts: {
    issueStatusDistribution: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    monthlyTrends: Array<{
      name: string;
      issues: number;
      resolved: number;
    }>;
    categoryDistribution?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    budgetDistribution?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    budgetTrends?: Array<{
      name: string;
      value: number; // Reusing structure or defining new one? Let's use generic value for simplicity in frontend mapping
    }>;
  };
}

// Recent Issue
export interface RecentIssue {
  id: string;
  title: string;
  description: string;
  agent: string;
  status: string;
  severity: string;
  date: string;
  category: string;
}

// Recent Issues Data
export interface RecentIssuesData {
  recentIssues: RecentIssue[];
}

// Audit Log Entry
export interface AuditLogEntry {
  id: number;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  status: string;
  user_agent?: string;
  session_id?: string;
}

// Recent Activity Data
export interface RecentActivityData {
  auditLogs: AuditLogEntry[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  summary?: {
    total_logs: number;
    success_count: number;
    failed_count: number;
    warning_count: number;
    last_updated: string | null;
  };
}

// Analytics Metrics Data
export interface AnalyticsMetricsData {
  metrics: {
    totalIssues: number;
    activeStaff: number;
    totalProjects: number;
    activeBudget: number;
    newIssuesThisWeek: number;
    resolvedThisWeek: number;
    activeUsers7Days: number;
    ongoingProjects: number;
  };
  trends: {
    issuesChange: number;
    staffChange: number;
    projectsChange: number;
    budgetChange: number;
    newIssuesChange: number;
    resolvedChange: number;
    activeUsersChange: number;
    ongoingProjectsChange: number;
  };
}

// Top Performer
export interface TopPerformer {
  id: number;
  name: string;
  role: string;
  resolvedCount: number;
  totalCount: number;
  resolutionRate: number;
  rank: number;
}

// Community Insight
export interface CommunityInsight {
  location: string;
  issuesReported: number;
  avgResolutionTime: string;
  resolutionRate: number;
}

// Analytics Insights Data
export interface AnalyticsInsightsData {
  insights: {
    topPerformers: TopPerformer[];
    communityInsights: CommunityInsight[];
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

export interface AdminChartsResponse {
  success: boolean;
  message: string;
  data: AdminChartsData;
}

export interface RecentIssuesResponse {
  success: boolean;
  message: string;
  data: RecentIssuesData;
}

export interface RecentActivityResponse {
  success: boolean;
  message: string;
  data: RecentActivityData;
}

export interface AnalyticsMetricsResponse {
  success: boolean;
  message: string;
  data: AnalyticsMetricsData;
}

export interface AnalyticsInsightsResponse {
  success: boolean;
  message: string;
  data: AnalyticsInsightsData;
}

// Backward compatibility alias
export type DashboardStats = AdminDashboardStats;
export type DashboardStatsResponse = AdminStatsResponse;

export const dashboardService = {
  // Admin dashboard stats
  getAdminStats: async (): Promise<AdminStatsResponse> => {
    return apiClient<AdminStatsResponse>("/admin/dashboard/stats", {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Officer dashboard stats
  getOfficerStats: async (): Promise<OfficerStatsResponse> => {
    return apiClient<OfficerStatsResponse>("/officer/dashboard/stats", {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Agent dashboard stats
  getAgentStats: async (): Promise<AgentStatsResponse> => {
    return apiClient<AgentStatsResponse>("/agent/dashboard/stats", {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Task Force dashboard stats
  getTaskForceStats: async (): Promise<TaskForceStatsResponse> => {
    return apiClient<TaskForceStatsResponse>("/task-force/dashboard/stats", {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Admin charts data
  getAdminCharts: async (): Promise<AdminChartsResponse> => {
    return apiClient<AdminChartsResponse>("/admin/data/analytics/charts", {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Recent issues data
  getRecentIssues: async (
    limit: number = 10,
  ): Promise<RecentIssuesResponse> => {
    return apiClient<RecentIssuesResponse>(
      `/admin/data/recent-issues?limit=${limit}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );
  },

  // Recent activity (audit logs)
  getRecentActivity: async (
    limit: number = 10,
  ): Promise<RecentActivityResponse> => {
    return apiClient<RecentActivityResponse>(
      `/admin/data/audit-logs?limit=${limit}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );
  },

  // Analytics metrics
  getAnalyticsMetrics: async (): Promise<AnalyticsMetricsResponse> => {
    return apiClient<AnalyticsMetricsResponse>(
      "/admin/data/analytics/metrics",
      {
        method: "GET",
        requiresAuth: true,
      },
    );
  },

  // Analytics insights
  getAnalyticsInsights: async (): Promise<AnalyticsInsightsResponse> => {
    return apiClient<AnalyticsInsightsResponse>(
      "/admin/data/analytics/insights",
      {
        method: "GET",
        requiresAuth: true,
      },
    );
  },
};
