import { apiClient } from "../api-client";

// Role constants matching backend
export const ROLES = {
  WEB_ADMIN: 'web_admin',
  OFFICER: 'officer',
  AGENT: 'agent',
  TASK_FORCE: 'task_force',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export interface User {
  id: number;
  email: string;
  name?: string;
  role: UserRole;
  status: 'active' | 'inactive';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Map roles to their dashboard routes
export const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  [ROLES.WEB_ADMIN]: '/web-admin-dashboard',
  [ROLES.OFFICER]: '/officer-dashboard',
  [ROLES.AGENT]: '/agents-dashboard',
  [ROLES.TASK_FORCE]: '/task-force-dashboard',
};

// Map roles to their display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [ROLES.WEB_ADMIN]: 'Web Administrator',
  [ROLES.OFFICER]: 'Officer',
  [ROLES.AGENT]: 'Agent',
  [ROLES.TASK_FORCE]: 'Task Force',
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      requiresAuth: false, // Login doesn't require auth
    });

    // Store token and user info on successful login
    if (response.success && response.data.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }

    return response;
  },

  logout: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          return JSON.parse(userStr) as User;
        } catch {
          return null;
        }
      }
    }
    return null;
  },

  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!authService.getToken();
  },

  getDashboardForRole: (role: UserRole): string => {
    return ROLE_DASHBOARD_MAP[role] || '/';
  },
};
