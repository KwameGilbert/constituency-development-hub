import { apiClient } from "../api-client";

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'web_admin' | 'officer' | 'agent' | 'task_force' | 'admin';
  status: 'active' | 'inactive';
  location?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: User['role'];
  location: string;
  status?: User['status'];
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

export interface UpdateUserRoleRequest {
  role: User['role'];
}

export interface UpdateUserStatusRequest {
  status: User['status'];
  reason?: string;
}

export interface UsersListResponse {
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

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: Partial<User>;
  };
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export const userService = {
  // Get all users with pagination and filters
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
  }): Promise<UsersListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.role) queryParams.append('role', params.role);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `/admin/users${queryString ? `?${queryString}` : ''}`;

    return apiClient<UsersListResponse>(url, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Get user by ID
  getUserById: async (id: number): Promise<UserResponse> => {
    return apiClient<UserResponse>(`/admin/users/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
    return apiClient<CreateUserResponse>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      requiresAuth: true,
    });
  },

  // Update user details
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<UpdateUserResponse> => {
    return apiClient<UpdateUserResponse>(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
      requiresAuth: true,
    });
  },

  // Update user role
  updateUserRole: async (id: number, roleData: UpdateUserRoleRequest): Promise<UpdateUserResponse> => {
    return apiClient<UpdateUserResponse>(`/admin/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify(roleData),
      requiresAuth: true,
    });
  },

  // Update user status
  updateUserStatus: async (id: number, statusData: UpdateUserStatusRequest): Promise<UpdateUserResponse> => {
    return apiClient<UpdateUserResponse>(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
      requiresAuth: true,
    });
  },

  // Delete user
  deleteUser: async (id: number): Promise<DeleteUserResponse> => {
    return apiClient<DeleteUserResponse>(`/admin/users/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};
