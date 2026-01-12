import { apiClient } from "../api-client";

// --- Interfaces ---

export interface Announcement {
  id: number;
  title: string;
  slug: string;
  content: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "published" | "archived";
  publish_date?: string;
  expiry_date?: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
  published_at?: string;
}

export interface AnnouncementFilters {
  status?: string;
  priority?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface AnnouncementResponse {
  success: boolean;
  message: string;
  data: {
    announcements: Announcement[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    announcement?: Announcement;
  };
}

export interface CreateAnnouncementData {
  title: string;
  content: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "draft" | "published" | "archived";
  publish_date?: string;
  expiry_date?: string;
}

export interface UpdateAnnouncementData {
  title?: string;
  content?: string;
  category?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  status?: "draft" | "published" | "archived";
  publish_date?: string;
  expiry_date?: string;
}

// --- Service Class ---

class AnnouncementsService {
  // Public Routes
  async getPublicAnnouncements(filters: AnnouncementFilters = {}): Promise<AnnouncementResponse> {
    const params = new URLSearchParams();
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.category) params.append("category", filters.category);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient<AnnouncementResponse>(`/announcements/public?${params.toString()}`, {
      requiresAuth: false,
    });
  }

  async getAnnouncementBySlug(slug: string): Promise<AnnouncementResponse> {
    return apiClient<AnnouncementResponse>(`/announcements/${slug}`, {
      requiresAuth: false,
    });
  }

  // Admin Routes
  async getAdminAnnouncements(filters: AnnouncementFilters = {}): Promise<AnnouncementResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.priority) params.append("priority", filters.priority);
    if (filters.category) params.append("category", filters.category);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient<AnnouncementResponse>(`/admin/announcements?${params.toString()}`);
  }

  async getAnnouncementById(id: number | string): Promise<AnnouncementResponse> {
    return apiClient<AnnouncementResponse>(`/admin/announcements/${id}`);
  }

  async createAnnouncement(data: CreateAnnouncementData): Promise<AnnouncementResponse> {
    return apiClient<AnnouncementResponse>("/admin/announcements", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateAnnouncement(
    id: number | string,
    data: UpdateAnnouncementData
  ): Promise<AnnouncementResponse> {
    return apiClient<AnnouncementResponse>(`/admin/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteAnnouncement(id: number | string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/admin/announcements/${id}`, {
      method: "DELETE",
    });
  }

  async publishAnnouncement(id: number | string): Promise<AnnouncementResponse> {
    return apiClient<AnnouncementResponse>(`/admin/announcements/${id}/publish`, {
      method: "POST",
    });
  }
}

export const announcementsService = new AnnouncementsService();
