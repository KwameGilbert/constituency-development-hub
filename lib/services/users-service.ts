import { apiClient } from "../api-client";

// ============================================================
// INTERFACES
// ============================================================

export interface UserStatistics {
  total_issues: number;
  resolved_issues: number;
  pending_issues: number;
  in_progress: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "web_admin" | "officer" | "agent" | "task_force";
  status: "active" | "inactive" | "suspended";
  avatar: string;
  location: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  issues_assigned?: number;
  issues_resolved?: number;
  permissions?: string[];
  statistics?: UserStatistics;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  location?: string;
  status?: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface UpdateRolePayload {
  role: string;
}

export interface UpdateStatusPayload {
  status: string;
  reason?: string;
}

export interface UserStats {
  total_users: number;
  active_users: number;
  inactive_users: number;
  suspended_users: number;
  by_role: {
    admin: number;
    officer: number;
    agent: number;
    task_force: number;
    web_admin: number;
  };
  recent_registrations: number;
  last_30_days_logins: number;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UserStatsResponse {
  success: boolean;
  message: string;
  data: UserStats;
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

// ============================================================
// SERVICE
// ============================================================

export const usersService = {
  /**
   * Get all users with filtering and pagination
   * GET /admin/users
   */
  getUsers: async (filters?: UserFilters) => {
    const params = new URLSearchParams();

    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.role) params.append("role", filters.role);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.search) params.append("search", filters.search);

    const queryString = params.toString();
    const endpoint = queryString
      ? `/admin/users?${queryString}`
      : "/admin/users";

    return apiClient<UsersResponse>(endpoint);
  },

  /**
   * Get single user details by ID
   * GET /admin/users/:id
   */
  getUserById: async (id: number) => {
    return apiClient<UserResponse>(`/admin/users/${id}`);
  },

  /**
   * Get user statistics
   * GET /admin/users/stats
   */
  getUserStats: async () => {
    return apiClient<UserStatsResponse>("/admin/users/stats");
  },

  /**
   * Create new user
   * POST /admin/users
   */
  createUser: async (data: CreateUserPayload) => {
    return apiClient<UserResponse>("/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update user details
   * PUT /admin/users/:id
   */
  updateUser: async (id: number, data: UpdateUserPayload) => {
    return apiClient<UserResponse>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update user role
   * PUT /admin/users/:id/role
   */
  updateUserRole: async (id: number, data: UpdateRolePayload) => {
    return apiClient<UserResponse>(`/admin/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update user status (activate/deactivate/suspend)
   * PUT /admin/users/:id/status
   */
  updateUserStatus: async (id: number, data: UpdateStatusPayload) => {
    return apiClient<UserResponse>(`/admin/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete user
   * DELETE /admin/users/:id
   */
  deleteUser: async (id: number) => {
    return apiClient<DeleteUserResponse>(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },
};
