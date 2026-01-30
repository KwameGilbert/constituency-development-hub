import { apiClient } from "../api-client";

export interface AuditLog {
  id: number;
  user: string;
  action: string;
  resource: string;
  ip: string;
  timestamp: string;
  status: "success" | "failed" | "warning";
  user_agent?: string;
  session_id?: string; // Optional if not returned by backend
}

export interface AuditData {
  auditLogs: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  summary: {
    total_logs: number;
    success_count: number;
    failed_count: number;
    warning_count: number;
    last_updated: string;
  };
}

export interface AuditLogsResponse {
  success: boolean;
  message: string;
  data: AuditData;
}

export interface AuditLogParams {
  page?: number;
  limit?: number;
  search?: string;
  action_type?: string;
}

export const auditService = {
  getAuditLogs: async (params?: AuditLogParams): Promise<AuditLogsResponse> => {
    const queryParams = new URLSearchParams();
    if (params) {
      if (params.page) queryParams.append("page", params.page.toString());
      if (params.limit) queryParams.append("limit", params.limit.toString());
      if (params.search) queryParams.append("search", params.search);
      if (params.action_type && params.action_type !== "all") {
        queryParams.append("action_type", params.action_type);
      }
    }

    return apiClient<AuditLogsResponse>(
      `/admin/audit-logs?${queryParams.toString()}`,
      {
        method: "GET",
        requiresAuth: true,
      },
    );
  },
};
