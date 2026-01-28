import { apiClient } from "../api-client";
import { jwtDecode } from "jwt-decode";

// Role constants matching backend
export const ROLES = {
  ADMIN: "admin",
  WEB_ADMIN: "web_admin",
  OFFICER: "officer",
  AGENT: "agent",
  TASK_FORCE: "task_force",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export interface User {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  status: "active" | "inactive";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    token_type: string;
    user: User;
  };
}

interface JwtPayload {
  exp: number;
  iat: number;
  sub: string;
}

// Map roles to their dashboard routes
export const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  [ROLES.ADMIN]: "/admin-dashboard",
  [ROLES.WEB_ADMIN]: "/web-admin-dashboard",
  [ROLES.OFFICER]: "/officer-dashboard",
  [ROLES.AGENT]: "/agents-dashboard",
  [ROLES.TASK_FORCE]: "/task-force-dashboard",
};

// Map roles to their display names
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  [ROLES.ADMIN]: "Administrator",
  [ROLES.WEB_ADMIN]: "Web Administrator",
  [ROLES.OFFICER]: "Officer",
  [ROLES.AGENT]: "Agent",
  [ROLES.TASK_FORCE]: "Task Force",
};

// Helper to set cookies
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

// Helper to remove cookies
const removeCookie = (name: string) => {
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`;
};

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      requiresAuth: false, // Login doesn't require auth
    });

    // Store token and user info on successful login
    if (response.success && response.data.access_token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", response.data.access_token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        // Set cookies for middleware
        setCookie("authToken", response.data.access_token);
        setCookie("userRole", response.data.user.role);
      }
    }

    return response;
  },

  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Remove cookies
      removeCookie("authToken");
      removeCookie("userRole");
    }
  },

  getCurrentUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
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
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;
    return !authService.isTokenExpired(token);
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  },

  getDashboardForRole: (role: UserRole): string => {
    return ROLE_DASHBOARD_MAP[role] || "/";
  },
};
