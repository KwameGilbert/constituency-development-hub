import { apiClient } from "../api-client";

// --- Interfaces ---

export interface Idea {
  id: number;
  title: string;
  slug: string;
  description: string;
  category: string;
  submitter_name: string;
  submitter_email: string;
  submitter_contact?: string;
  status: "pending" | "under_review" | "approved" | "rejected" | "implemented";
  votes?: number;
  downvotes?: number;
  admin_notes?: string;
  created_at: string;
  updated_at?: string;
  reviewed_at?: string;
}

export interface IdeaFilters {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface IdeaResponse {
  success: boolean;
  message: string;
  data: {
    ideas: Idea[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    idea?: Idea; // For single idea responses
  };
}

export interface UpdateIdeaStatusData {
  status: "pending" | "under_review" | "approved" | "rejected" | "implemented";
  admin_notes?: string;
}

// --- Service Class ---

export interface IdeaSubmissionData {
  title: string;
  description: string;
  category: string;
  submitter_name: string;
  submitter_email: string;
  submitter_contact?: string;
  location?: string;
  documents?: string[];
}

// --- Service Class ---

class IdeasService {
  // Public Routes (No Authentication) - for community submissions
  async getPublicIdeas(filters: IdeaFilters = {}): Promise<IdeaResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient<IdeaResponse>(`/ideas/public?${params.toString()}`, {
      requiresAuth: false,
    });
  }

  async getIdeaBySlug(slug: string): Promise<IdeaResponse> {
    return apiClient<IdeaResponse>(`/ideas/${slug}`, {
      requiresAuth: false,
    });
  }

  async submitIdea(data: IdeaSubmissionData): Promise<IdeaResponse> {
    return apiClient<IdeaResponse>("/ideas", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: false,
    });
  }

  async voteIdea(
    id: number | string,
    voteType: "up" | "down" = "up",
  ): Promise<IdeaResponse> {
    return apiClient<IdeaResponse>(`/ideas/${id}/vote`, {
      method: "POST",
      body: JSON.stringify({ type: voteType }),
      requiresAuth: false,
    });
  }

  // Admin Routes (Requires Authentication)
  async getAdminIdeas(filters: IdeaFilters = {}): Promise<IdeaResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.category) params.append("category", filters.category);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient<IdeaResponse>(`/ideas?${params.toString()}`);
  }

  async getIdeaById(id: number | string): Promise<IdeaResponse> {
    return apiClient<IdeaResponse>(`/ideas/${id}`);
  }

  async updateIdeaStatus(
    id: number | string,
    data: UpdateIdeaStatusData,
  ): Promise<IdeaResponse> {
    const payload = {
      status: data.status,
      notes: data.admin_notes || undefined,
      admin_notes: data.admin_notes || undefined,
    };
    return apiClient<IdeaResponse>(`/ideas/${id}/status`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async deleteIdea(
    id: number | string,
  ): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/ideas/${id}`, {
      method: "DELETE",
    });
  }
}

export const ideasService = new IdeasService();
