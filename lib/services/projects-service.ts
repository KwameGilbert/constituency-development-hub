import { apiClient } from "../api-client";

// --- Interfaces ---

export interface Sector {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  location: string;
  status: "planning" | "ongoing" | "completed" | "on_hold";
  progress_percent?: number;
  budget: number;
  spent?: number;
  start_date: string;
  end_date: string;
  sector: Sector;
  contractor?: string;
  contact_person?: string;
  contact_phone?: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectStatistics {
  total: number;
  ongoing: number;
  completed: number;
  planning: number;
  by_sector: Array<{
    id: number;
    name: string;
    count: number;
  }>;
}

export interface ProjectFilters {
  status?: string;
  sector?: number;
  page?: number;
  limit?: number;
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: {
    projects: Project[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    project?: Project; // For single project responses
  };
}

export interface ProjectStatsResponse {
  success: boolean;
  message: string;
  data: ProjectStatistics;
}

export interface CreateProjectData {
  title: string;
  description: string;
  sector_id: number;
  location: string;
  status: "planning" | "ongoing" | "completed" | "on_hold";
  start_date: string;
  end_date: string;
  budget: number;
  contractor?: string;
  contact_person?: string;
  contact_phone?: string;
  is_featured?: boolean;
}

export interface UpdateProjectData {
  title?: string;
  description?: string;
  sector_id?: number;
  location?: string;
  status?: "planning" | "ongoing" | "completed" | "on_hold";
  progress_percent?: number;
  spent?: number;
  start_date?: string;
  end_date?: string;
  budget?: number;
  contractor?: string;
  contact_person?: string;
  contact_phone?: string;
  is_featured?: boolean;
}

// --- Service Class ---

class ProjectsService {
  // Public Routes (No Authentication)
  async getPublicProjects(filters: ProjectFilters = {}): Promise<ProjectResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.sector) params.append("sector", filters.sector.toString());
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient<ProjectResponse>(`/projects?${params.toString()}`, {
      requiresAuth: false,
    });
  }

  async getFeaturedProjects(limit = 6): Promise<ProjectResponse> {
    return apiClient<ProjectResponse>(`/projects/featured?limit=${limit}`, {
      requiresAuth: false,
    });
  }

  async getProjectStatistics(): Promise<ProjectStatsResponse> {
    return apiClient<ProjectStatsResponse>("/projects/stats", {
      requiresAuth: false,
    });
  }

  async getProjectBySlug(slug: string): Promise<ProjectResponse> {
    return apiClient<ProjectResponse>(`/projects/${slug}`, {
      requiresAuth: false,
    });
  }

  // Admin Routes (Requires Authentication)
  async getAdminProjects(filters: ProjectFilters = {}): Promise<ProjectResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.sector) params.append("sector", filters.sector.toString());
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient<ProjectResponse>(`/admin/projects?${params.toString()}`);
  }

  async getProjectById(id: number | string): Promise<ProjectResponse> {
    return apiClient<ProjectResponse>(`/admin/projects/${id}`);
  }

  async createProject(data: CreateProjectData): Promise<ProjectResponse> {
    return apiClient<ProjectResponse>("/admin/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: number | string, data: UpdateProjectData): Promise<ProjectResponse> {
    return apiClient<ProjectResponse>(`/admin/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: number | string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/admin/projects/${id}`, {
      method: "DELETE",
    });
  }
}

export const projectsService = new ProjectsService();
