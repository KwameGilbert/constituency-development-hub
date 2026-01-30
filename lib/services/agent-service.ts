import { apiClient } from "@/lib/api-client";

// --- Interfaces ---

export interface AgentProfile {
  id: number;
  user_id: number;
  agent_code: string;
  supervisor_id: number | null;
  assigned_communities: string | null;
  assigned_location: string | null;
  can_submit_reports: boolean;
  can_collect_data: boolean;
  can_register_residents: boolean;
  profile_image: string | null;
  id_type: string | null;
  id_number: string | null;
  id_verified: boolean;
  address: string | null;
  reports_submitted: number;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    role: string;
    status: string;
  };
  supervisor?: {
    id: number;
    user: {
      name: string;
      email: string;
    };
  } | null;
}

export interface AgentReport {
  id: number;
  case_id?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
  priority: string;
  images: string[];
  reporter_name?: string;
  reporter_phone?: string;
  created_at: string;
  updated_at?: string;
}

export interface AgentReportStats {
  total: number;
  pending: number;
  approved: number;
  inProgress: number;
  resolved: number;
  rejected: number;
}

export interface IssueSubmission {
  title: string;
  description: string;
  category: string;
  type?: string; // Legacy field
  issue_type?: "community_based" | "individual_based"; // NEW: Impact type
  priority: string;
  location: string;
  smaller_community?: string;
  suburb?: string;
  cottage?: string;
  latitude?: number;
  longitude?: number;
  sector?: string;
  subsector?: string;
  people_affected?: number;
  estimated_budget?: number;
  additional_notes?: string;
  reporter_name?: string;
  reporter_phone?: string;
  reporter_email?: string;
  reporter_gender?: string;
  reporter_address?: string;
}

export interface IssueDetail {
  id: number;
  case_id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  priority: string;
  status: string;
  location: string;
  smaller_community?: string;
  suburb?: string;
  cottage?: string;
  latitude?: number;
  longitude?: number;
  sector?: string;
  subsector?: string;
  people_affected?: number;
  estimated_budget?: number;
  additional_notes?: string;
  reporter_name?: string;
  reporter_phone?: string;
  reporter_email?: string;
  images?: string[];
  assigned_officer?: {
    id: number;
    user: { name: string; email: string };
  };
  created_at: string;
  updated_at?: string;
}

export interface ProfileUpdate {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// --- Service Class ---

class AgentService {
  /**
   * Admin: Get all agents
   * GET /v1/admin/agents
   */
  async getAllAgents(params?: {
    location?: string;
    verified?: boolean;
    supervisor?: number;
  }): Promise<ApiResponse<{ agents: AgentProfile[] }>> {
    const queryParams = new URLSearchParams();
    if (params?.location) queryParams.append("location", params.location);
    if (params?.verified !== undefined)
      queryParams.append("verified", params.verified.toString());
    if (params?.supervisor)
      queryParams.append("supervisor", params.supervisor.toString());

    const url = `/admin/agents${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    return apiClient(url, {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Admin: Create new agent
   * POST /v1/admin/agents
   */
  async createAgent(
    data: FormData,
  ): Promise<
    ApiResponse<{ agent: AgentProfile; generated_password?: string }>
  > {
    return apiClient("/admin/agents", {
      method: "POST",
      body: data,
      requiresAuth: true,
      isFormData: true, // Let browser set Content-Type with proper multipart boundary
    });
  }

  /**
   * Admin: Get single agent by ID
   * GET /v1/admin/agents/{id}
   */
  async getAgentById(
    id: number,
  ): Promise<ApiResponse<{ agent: AgentProfile }>> {
    return apiClient(`/admin/agents/${id}`, {
      method: "GET",
      requiresAuth: true,
    });
  }

  /**
   * Admin: Update agent
   * PUT /v1/admin/agents/{id}
   */
  async updateAgent(
    id: number,
    data: Partial<AgentProfile>,
  ): Promise<ApiResponse<{ agent: AgentProfile }>> {
    return apiClient(`/admin/agents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  }

  /**
   * Admin: Update agent with file upload
   * POST /v1/admin/agents/{id}?_method=PUT (Used for FormData updates)
   */
  async updateAgentWithFile(
    id: number,
    data: FormData,
  ): Promise<ApiResponse<{ agent: AgentProfile }>> {
    // API might support PUT with FormData directly or require special handling
    // Assuming backend handles PUT or POST for updates correctly
    // If straight PUT with FormData is an issue, often we use POST with _method=PUT or separate endpoints
    // Based on PHP controller, it uses PUT method route.
    // Standard fetch/axios can send FormData with PUT.
    return apiClient(`/admin/agents/${id}`, {
      method: "POST", // Using POST often safer for PHP multipart/form-data unless spoofing method
      body: data,
      requiresAuth: true,
    });
  }

  /**
   * Admin: Verify agent
   * POST /v1/admin/agents/{id}/verify
   */
  async verifyAgent(id: number): Promise<ApiResponse<{ agent: AgentProfile }>> {
    return apiClient(`/admin/agents/${id}/verify`, {
      method: "POST",
      requiresAuth: true,
    });
  }

  /**
   * Admin: Delete agent
   * DELETE /v1/admin/agents/{id}
   */
  async deleteAgent(id: number): Promise<ApiResponse<null>> {
    return apiClient(`/admin/agents/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  }

  /**
   * Get the authenticated agent's profile
   * GET /v1/agent/profile
   */
  async getProfile(): Promise<ApiResponse<{ agent: AgentProfile }>> {
    return apiClient("/agent/profile", {
      requiresAuth: true,
    });
  }

  /**
   * Get the agent's submitted reports
   * GET /v1/agent/my-reports
   */
  async getMyReports(): Promise<
    ApiResponse<{ reports: AgentReport[]; total_submitted: number }>
  > {
    return apiClient("/agent/my-reports", {
      requiresAuth: true,
    });
  }

  /**
   * Submit a new issue report
   * POST /v1/agent/issues
   */
  async submitIssue(
    data: IssueSubmission,
  ): Promise<ApiResponse<{ issue: AgentReport }>> {
    return apiClient("/agent/issues", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  }

  /**
   * Get a single issue by ID
   * GET /v1/agent/issues/{id}
   */
  async getIssueById(id: number): Promise<ApiResponse<{ issue: IssueDetail }>> {
    return apiClient(`/agent/issues/${id}`, {
      requiresAuth: true,
    });
  }

  /**
   * Update agent profile
   * PUT /v1/agent/profile
   */
  async updateProfile(
    data: ProfileUpdate,
  ): Promise<ApiResponse<{ agent: AgentProfile }>> {
    return apiClient("/agent/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  }

  /**
   * Change password
   * PUT /v1/agent/password
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<null>> {
    return apiClient("/agent/password", {
      method: "PUT",
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
      requiresAuth: true,
    });
  }

  /**
   * Calculate report statistics from the reports array
   */
  calculateReportStats(reports: AgentReport[]): AgentReportStats {
    const stats: AgentReportStats = {
      total: reports.length,
      pending: 0,
      approved: 0,
      inProgress: 0,
      resolved: 0,
      rejected: 0,
    };

    reports.forEach((report) => {
      const status = report.status?.toLowerCase();

      // Map statuses to our categories
      if (
        status === "submitted" ||
        status === "pending" ||
        status === "under_officer_review"
      ) {
        stats.pending++;
      } else if (
        status === "forwarded_to_admin" ||
        status === "approved" ||
        status === "assigned_to_task_force"
      ) {
        stats.approved++;
      } else if (
        status === "pending_assessment" ||
        status === "assessment_in_progress" ||
        status === "assessment_submitted" ||
        status === "resources_allocated" ||
        status === "resolution_in_progress" ||
        status === "resolution_submitted" ||
        status === "in_progress"
      ) {
        stats.inProgress++;
      } else if (status === "resolved" || status === "closed") {
        stats.resolved++;
      } else if (status === "rejected") {
        stats.rejected++;
      }
    });

    return stats;
  }
}

export const agentService = new AgentService();
