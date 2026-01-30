import { apiClient } from "../api-client";

// ============================================================
// INTERFACES
// ============================================================

export interface UserPreferences {
  email_notifications: boolean;
  sms_notifications: boolean;
  language: string;
  timezone: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "web_admin" | "officer" | "agent" | "task_force";
  status: "active" | "inactive" | "suspended";
  avatar?: string;
  location?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  preferences?: UserPreferences;
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  bio?: string;
  preferences?: Partial<UserPreferences>;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
  };
}

export interface UserActivity {
  id: number;
  action: string;
  entity_type: string;
  entity_id: number;
  details: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface ActivityResponse {
  success: boolean;
  message: string;
  data: {
    activities: UserActivity[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

// ============================================================
// SERVICE
// ============================================================

export const profileService = {
  /**
   * Get current user's profile
   * GET /profile
   */
  getProfile: async () => {
    return apiClient<ProfileResponse>("/profile", { requiresAuth: true });
  },

  /**
   * Update current user's profile
   * PUT /profile
   */
  updateProfile: async (data: UpdateProfilePayload) => {
    return apiClient<ProfileResponse>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  /**
   * Upload avatar
   * POST /profile/avatar
   */
  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return apiClient<{
      success: boolean;
      message: string;
      data: { avatar: string };
    }>("/profile/avatar", {
      method: "POST",
      body: formData,
      isFormData: true,
      requiresAuth: true,
    });
  },

  /**
   * Change password
   * PUT /profile/password
   */
  changePassword: async (data: ChangePasswordPayload) => {
    return apiClient<{ success: boolean; message: string }>(
      "/profile/password",
      {
        method: "PUT",
        body: JSON.stringify(data),
        requiresAuth: true,
      },
    );
  },

  /**
   * Get activity history
   * GET /profile/activity
   */
  getActivity: async (page = 1, limit = 5) => {
    return apiClient<ActivityResponse>(
      `/profile/activity?page=${page}&limit=${limit}`,
      {
        requiresAuth: true,
      },
    );
  },
};
