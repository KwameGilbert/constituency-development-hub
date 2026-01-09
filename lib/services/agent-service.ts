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

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// --- Service Class ---

class AgentService {
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
  async getMyReports(): Promise<ApiResponse<{ reports: AgentReport[]; total_submitted: number }>> {
    return apiClient("/agent/my-reports", {
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
      if (status === 'submitted' || status === 'pending' || status === 'under_officer_review') {
        stats.pending++;
      } else if (status === 'forwarded_to_admin' || status === 'approved' || status === 'assigned_to_task_force') {
        stats.approved++;
      } else if (
        status === 'pending_assessment' ||
        status === 'assessment_in_progress' ||
        status === 'assessment_submitted' ||
        status === 'resources_allocated' ||
        status === 'resolution_in_progress' ||
        status === 'resolution_submitted' ||
        status === 'in_progress'
      ) {
        stats.inProgress++;
      } else if (status === 'resolved' || status === 'closed') {
        stats.resolved++;
      } else if (status === 'rejected') {
        stats.rejected++;
      }
    });

    return stats;
  }
}

export const agentService = new AgentService();
