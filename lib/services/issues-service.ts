import { apiClient } from "@/lib/api-client";

// --- Interfaces ---

export interface Issue {
  id: number;
  case_id?: string;
  title: string;
  description: string;
  category: string;
  location: string; // The API seems to return this as a string based on usage
  latitude?: number;
  longitude?: number;
  status:
    | "submitted"
    | "under_officer_review"
    | "forwarded_to_admin"
    | "assigned_to_task_force"
    | "pending_assessment"
    | "assessment_in_progress"
    | "assessment_submitted"
    | "resources_allocated"
    | "resolution_in_progress"
    | "resolution_submitted"
    | "resolved"
    | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  images: string[];
  reporter_name?: string;
  reporter_phone?: string;
  created_at: string;
  updated_at?: string;
  assigned_task_force_id?: number;
  allocated_budget?: number;
  allocated_resources?: ResourceItem[];
  assessment?: AssessmentReport;
  // Optional extra fields for UI adaptation (if returned)
  timeline?: TimelineEvent[];
}

export interface AssessmentReport {
  id: number;
  assessment_summary: string;
  findings?: string;
  issue_confirmed: boolean;
  severity: string;
  estimated_cost?: string;
  estimated_duration?: string;
  required_resources?: ResourceItem[];
  recommendations?: string;
  images?: string[];
  submitted_by?: number;
  created_at?: string;
  status: "submitted" | "approved" | "rejected" | "needs_revision";
}

export interface TimelineEvent {
  id: string;
  date: string;
  event: string;
  type: string;
  userId?: string;
}

export interface IssueStatistics {
  total: number;
  pending: number;
  resolved: number;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
}

export interface IssueFilters {
  status?: string;
  priority?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface AssessmentData {
  decision: "approve" | "reject" | "request_more_info";
  comments: string;
  recommendations?: string;
  estimatedBudget?: number;
  timeline?: string;
}

export interface ResourceItem {
  type: string;
  item: string;
  quantity: number;
}

export interface ResourceAllocationData {
  budget: number;
  resources: ResourceItem[];
}

export interface IssueComment {
  id: number;
  issue_id: number;
  comment: string;
  created_at: string;
  user_id?: number;
  author_name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// --- Service Class ---

class IssuesService {
  async getAllIssues(filters: IssueFilters = {}): Promise<
    ApiResponse<{
      reports: Issue[];
      total: number;
      page: number;
      limit: number;
    }>
  > {
    const params = new URLSearchParams();
    if (filters.search) params.append("search", filters.search);
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.category) params.append("category", filters.category);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient(`/admin/issues?${params.toString()}`);
  }

  async getIssueById(
    id: number | string,
  ): Promise<ApiResponse<{ report: Issue }>> {
    return apiClient(`/admin/issues/${id}`);
  }

  async getStatistics(): Promise<ApiResponse<IssueStatistics>> {
    return apiClient("/admin/issues/stats");
  }

  async updateStatus(
    id: number | string,
    status: string,
    comment?: string,
  ): Promise<ApiResponse<{ report: Issue }>> {
    return apiClient(`/admin/issues/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, comment }),
    });
  }

  async submitAssessment(
    id: number | string,
    data: AssessmentData,
  ): Promise<ApiResponse<{ assessment: any; report: Issue }>> {
    return apiClient(`/admin/issues/${id}/assessment`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async assignTaskForce(
    id: number | string,
    taskForceId: number,
  ): Promise<ApiResponse<{ report: Issue }>> {
    return apiClient(`/admin/issues/${id}/assign-task-force`, {
      method: "PUT",
      body: JSON.stringify({ task_force_id: taskForceId }),
    });
  }

  async allocateResources(
    id: number | string,
    data: ResourceAllocationData,
  ): Promise<ApiResponse<{ report: Issue }>> {
    return apiClient(`/admin/issues/${id}/allocate-resources`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async getAwaitingAction(): Promise<
    ApiResponse<{
      reports: Issue[];
      counts: {
        awaiting_assignment: number;
        awaiting_assessment_review: number;
        awaiting_resolution_review: number;
      };
    }>
  > {
    return apiClient("/admin/issues/awaiting-action");
  }

  async reviewAssessment(
    id: number | string,
    action: "approve" | "reject" | "revision",
    notes: string,
  ): Promise<ApiResponse<{ resolution: any; report: Issue }>> {
    return apiClient(`/admin/issues/${id}/review-assessment`, {
      method: "PUT",
      body: JSON.stringify({ action, notes }),
    });
  }

  async reviewResolution(
    id: number | string,
    action: "approve" | "reject",
    notes: string,
  ): Promise<ApiResponse<{ resolution: any; report: Issue }>> {
    return apiClient(`/admin/issues/${id}/review-resolution`, {
      method: "PUT",
      body: JSON.stringify({ action, notes }),
    });
  }

  async addComment(
    id: number | string,
    comment: string,
  ): Promise<ApiResponse<IssueComment>> {
    return apiClient(`/admin/issues/${id}/comments`, {
      method: "POST",
      body: JSON.stringify({ comment }),
    });
  }

  async submitOfficerIssue(
    data: FormData,
  ): Promise<ApiResponse<{ report: Issue }>> {
    return apiClient("/officer/issues", {
      method: "POST",
      body: data,
      isFormData: true,
    });
  }
}

export const issuesService = new IssuesService();
