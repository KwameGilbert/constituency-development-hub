import { apiClient } from "../api-client";

// ============================================================
// INTERFACES
// ============================================================

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
}

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  bio?: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    user: UserProfile;
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
    return apiClient<ProfileResponse>("/profile");
  },

  /**
   * Update current user's profile
   * PUT /profile
   */
  updateProfile: async (data: UpdateProfilePayload) => {
    return apiClient<ProfileResponse>("/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
