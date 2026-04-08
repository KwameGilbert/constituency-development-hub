/**
 * Task Force Service
 *
 * API service for Task Force Dashboard operations
 */

import { apiClient } from "../api-client";

// Types
export interface DashboardOverview {
  pending_assessment: number;
  assessment_in_progress: number;
  assessment_submitted: number;
  resolution_in_progress: number;
  resolved: number;
}

export interface MyAssignments {
  pending: number;
  in_progress: number;
  completed: number;
}

export interface TeamStats {
  total_members: number;
  active_members: number;
}

export interface PriorityStats {
  urgent: number;
  high: number;
}

export interface DashboardStats {
  overview: DashboardOverview;
  my_assignments: MyAssignments;
  team: TeamStats;
  priority: PriorityStats;
}

export interface TeamMember {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
  employee_id: string | null;
  title: string | null;
  specialization: string | null;
  skills: string[] | null;
  id_verified: boolean;
  assessments_completed: number;
  resolutions_completed: number;
  assigned_count: number;
  completed_count: number;
  active_count: number;
  completion_rate: number;
  last_active_at: string | null;
}

export interface Specialization {
  value: string;
  label: string;
}

export interface TeamResponse {
  members: TeamMember[];
  total: number;
  specializations: Specialization[];
}

export interface TaskForceIssue {
  id: number;
  case_id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  location: string;
  reporter_name?: string;
  assigned_to?: string;
  assigned_task_force_id?: number;
  created_at: string;
  updated_at?: string;
  formatted_date?: string;
  assessment_report?: AssessmentReportData;
}

export interface AssessmentReportData {
  assessment_summary?: string;
  findings?: string;
  issue_confirmed?: boolean;
  severity?: string;
  estimated_cost?: string | number;
  estimated_duration?: string;
  recommendations?: string;
  review_notes?: string;
  required_resources?: {
    item: string;
    quantity: number;
    estimatedCost?: number;
    justification?: string;
  }[];
  images?: string | string[];
  documents?: string | string[];
  created_at?: string;
}

export interface IssuesResponse {
  issues: TaskForceIssue[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface AssignmentsResponse {
  assignments: TaskForceIssue[];
  stats: {
    total_assigned: number;
    pending: number;
    in_progress: number;
    completed: number;
  };
}

// API Service
export const taskForceService = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{
    success: boolean;
    data: DashboardStats;
  }> {
    return apiClient("/task-force/dashboard");
  },

  /**
   * Get team members with performance stats
   */
  async getTeamMembers(params?: {
    limit?: number;
    specialization?: string;
  }): Promise<{ success: boolean; data: TeamResponse }> {
    const searchParams = new URLSearchParams();
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.specialization)
      searchParams.append("specialization", params.specialization);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return apiClient(`/task-force/team${query}`);
  },

  /**
   * Get all issues available to task force (Pool)
   */
  async getAllTaskForceIssues(params?: {
    status?: string;
    priority?: string;
    category?: string;
    limit?: number;
    page?: number;
  }): Promise<{ success: boolean; data: IssuesResponse }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.priority) searchParams.append("priority", params.priority);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.page) searchParams.append("page", params.page.toString());

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return apiClient(`/task-force/all${query}`);
  },

  /**
   * Get issues assigned to task force (My Issues)
   */
  async getIssues(params?: {
    status?: string;
    priority?: string;
    category?: string;
    limit?: number;
    page?: number;
  }): Promise<{ success: boolean; data: IssuesResponse }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.priority) searchParams.append("priority", params.priority);
    if (params?.category) searchParams.append("category", params.category);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.page) searchParams.append("page", params.page.toString());

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return apiClient(`/task-force/issues${query}`);
  },

  /**
   * Get current user's assignments
   */
  async getMyAssignments(params?: {
    status?: string;
    limit?: number;
  }): Promise<{ success: boolean; data: AssignmentsResponse }> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.append("status", params.status);
    if (params?.limit) searchParams.append("limit", params.limit.toString());

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    return apiClient(`/task-force/my-assignments${query}`);
  },

  /**
   * Get single issue details
   */
  async getIssue(
    id: number | string,
  ): Promise<{ success: boolean; data: { issue: TaskForceIssue } }> {
    return apiClient(`/task-force/issues/${id}`);
  },

  /**
   * Start assessment on an issue
   */
  async startAssessment(
    issueId: number,
  ): Promise<{ success: boolean; data: { issue: TaskForceIssue } }> {
    return apiClient(`/task-force/issues/${issueId}/start-assessment`, {
      method: "POST",
    });
  },

  /**
   * Submit assessment for an issue
   */
  async submitAssessment(
    issueId: number,
    data:
      | FormData
      | {
          assessment_summary: string;
          findings?: string;
          issue_confirmed?: boolean;
          severity?: string;
          estimated_cost?: number;
          estimated_duration?: string;
          recommendations?: string;
        },
  ): Promise<{ success: boolean }> {
    const isFormData = data instanceof FormData;
    return apiClient(`/task-force/issues/${issueId}/assessment`, {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
      isFormData: isFormData,
    });
  },

  /**
   * Start resolution on an issue
   */
  async startResolution(
    issueId: number,
  ): Promise<{ success: boolean; data: { issue: TaskForceIssue } }> {
    return apiClient(`/task-force/issues/${issueId}/start-resolution`, {
      method: "POST",
    });
  },

  /**
   * Submit resolution for an issue
   */
  async submitResolution(
    issueId: number,
    data:
      | FormData
      | {
          resolution_summary: string;
          work_description?: string;
          start_date?: string;
          completion_date?: string;
          actual_cost?: number;
        },
  ): Promise<{ success: boolean }> {
    const isFormData = data instanceof FormData;
    return apiClient(`/task-force/issues/${issueId}/resolution`, {
      method: "POST",
      body: isFormData ? data : JSON.stringify(data),
      isFormData: isFormData,
    });
  },

  /**
   * Get task force profile
   */
  async getProfile(): Promise<{
    success: boolean;
    data: { member: TeamMember };
  }> {
    return apiClient("/task-force/profile");
  },

  /**
   * Get reports/analytics
   */
  async getReports(): Promise<{ success: boolean; data: TaskForceReports }> {
    return fetchReportsWithFallback();
  },
};

export interface TaskForceReports {
  status_distribution: Record<string, number>;
  priority_distribution: Record<string, number>;
  category_distribution: { name: string; count: number }[];
  monthly_trends: { month: string; submitted: number; resolved: number }[];
  top_performers: { name: string; assessments: number; resolutions: number }[];
  avg_resolution_days: number;
  total_issues: number;
  resolved_issues: number;
}

const EMPTY_TASK_FORCE_REPORTS: TaskForceReports = {
  status_distribution: {},
  priority_distribution: {},
  category_distribution: [],
  monthly_trends: [],
  top_performers: [],
  avg_resolution_days: 0,
  total_issues: 0,
  resolved_issues: 0,
};

function normalizeTaskForceReports(raw: unknown): TaskForceReports {
  if (!raw || typeof raw !== "object") {
    return EMPTY_TASK_FORCE_REPORTS;
  }

  const payload = raw as Record<string, unknown>;

  // Preferred/expected reports payload.
  if (payload.status_distribution || payload.monthly_trends) {
    return {
      ...EMPTY_TASK_FORCE_REPORTS,
      ...(payload as Partial<TaskForceReports>),
      status_distribution:
        (payload.status_distribution as Record<string, number>) || {},
      priority_distribution:
        (payload.priority_distribution as Record<string, number>) || {},
      category_distribution:
        (payload.category_distribution as { name: string; count: number }[]) ||
        [],
      monthly_trends:
        (payload.monthly_trends as {
          month: string;
          submitted: number;
          resolved: number;
        }[]) || [],
      top_performers:
        (payload.top_performers as {
          name: string;
          assessments: number;
          resolutions: number;
        }[]) || [],
      avg_resolution_days:
        typeof payload.avg_resolution_days === "number"
          ? payload.avg_resolution_days
          : 0,
      total_issues:
        typeof payload.total_issues === "number" ? payload.total_issues : 0,
      resolved_issues:
        typeof payload.resolved_issues === "number"
          ? payload.resolved_issues
          : 0,
    };
  }

  // Fallback for dashboard-style stats payload.
  const assignments =
    (payload.my_assignments as Record<string, unknown>) ||
    (payload.overview as Record<string, unknown>) ||
    {};

  const pendingAssessment =
    typeof assignments.pending_assessment === "number"
      ? assignments.pending_assessment
      : typeof assignments.pending === "number"
        ? assignments.pending
        : 0;

  const assessmentInProgress =
    typeof assignments.assessment_in_progress === "number"
      ? assignments.assessment_in_progress
      : typeof assignments.in_progress === "number"
        ? assignments.in_progress
        : 0;

  const resolved =
    typeof assignments.resolved === "number"
      ? assignments.resolved
      : typeof assignments.completed === "number"
        ? assignments.completed
        : 0;

  const total =
    typeof assignments.total === "number"
      ? assignments.total
      : pendingAssessment + assessmentInProgress + resolved;

  return {
    ...EMPTY_TASK_FORCE_REPORTS,
    status_distribution: {
      assigned_to_task_force: pendingAssessment,
      assessment_in_progress: assessmentInProgress,
      resolved,
    },
    total_issues: total,
    resolved_issues: resolved,
  };
}

type ReportsResponse = { success: boolean; data?: unknown; message?: string };

async function fetchReportsWithFallback(): Promise<{
  success: boolean;
  data: TaskForceReports;
}> {
  const endpoints = [
    "/task-force/reports",
    "/task-force/analytics",
    "/task-force/dashboard/stats",
  ];

  let lastError: unknown;

  for (const endpoint of endpoints) {
    try {
      const response = await apiClient<ReportsResponse>(endpoint);
      if (response?.success) {
        return {
          success: true,
          data: normalizeTaskForceReports(response.data),
        };
      }
    } catch (error) {
      lastError = error;
    }
  }

  if (lastError) {
    throw lastError;
  }

  return { success: true, data: EMPTY_TASK_FORCE_REPORTS };
}

export default taskForceService;
