import { apiClient } from "../api-client";

// --- Interfaces ---

export interface JobPosting {
  id: number;
  title: string;
  slug: string;
  description: string;
  company?: string;
  location: string;
  job_type: "full_time" | "part_time" | "contract" | "internship";
  salary_range?: string;
  requirements?: string;
  responsibilities?: string;
  application_deadline: string;
  status: "draft" | "published" | "closed";
  category?: string;
  experience_level?: string;
  applicants_count?: number;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export interface JobApplicant {
  id: number;
  job_id: number;
  name: string;
  email: string;
  phone: string;
  resume_url?: string;
  cover_letter?: string;
  status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted";
  applied_at: string;
}

export interface JobStatistics {
  total: number;
  published: number;
  draft: number;
  closed: number;
  total_applicants: number;
  by_category: Array<{
    category: string;
    count: number;
  }>;
}

export interface JobFilters {
  status?: string;
  job_type?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: {
    jobs: JobPosting[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    job?: JobPosting; // For single job responses
  };
}

export interface ApplicantsResponse {
  success: boolean;
  message: string;
  data: {
    applicants: JobApplicant[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface CreateJobData {
  title: string;
  description: string;
  company?: string;
  location: string;
  job_type: "full_time" | "part_time" | "contract" | "internship";
  salary_range?: string;
  requirements?: string;
  responsibilities?: string;
  application_deadline: string;
  status: "draft" | "published" | "closed";
  category?: string;
  experience_level?: string;
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  company?: string;
  location?: string;
  job_type?: "full_time" | "part_time" | "contract" | "internship";
  salary_range?: string;
  requirements?: string;
  responsibilities?: string;
  application_deadline?: string;
  status?: "draft" | "published" | "closed";
  category?: string;
  experience_level?: string;
}

// --- Service Class ---

class EmploymentService {
  // Public Routes (No Authentication)
  async getPublicJobs(filters: JobFilters = {}): Promise<JobResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.job_type) params.append("job_type", filters.job_type);
    if (filters.category) params.append("category", filters.category);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient<JobResponse>(`/jobs?${params.toString()}`, {
      requiresAuth: false,
    });
  }

  async getJobBySlug(slug: string): Promise<JobResponse> {
    return apiClient<JobResponse>(`/jobs/${slug}`, {
      requiresAuth: false,
    });
  }

  // Admin Routes (Requires Authentication)
  async getAdminJobs(filters: JobFilters = {}): Promise<JobResponse> {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.job_type) params.append("job_type", filters.job_type);
    if (filters.category) params.append("category", filters.category);
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient<JobResponse>(`/admin/jobs?${params.toString()}`);
  }

  async getJobById(id: number | string): Promise<JobResponse> {
    return apiClient<JobResponse>(`/admin/jobs/${id}`);
  }

  async createJob(data: CreateJobData): Promise<JobResponse> {
    return apiClient<JobResponse>("/admin/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateJob(id: number | string, data: UpdateJobData): Promise<JobResponse> {
    return apiClient<JobResponse>(`/admin/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteJob(id: number | string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/admin/jobs/${id}`, {
      method: "DELETE",
    });
  }

  // Applicants Management
  async getJobApplicants(jobId: number | string, page = 1, limit = 20): Promise<ApplicantsResponse> {
    return apiClient<ApplicantsResponse>(`/admin/jobs/${jobId}/applicants?page=${page}&limit=${limit}`);
  }

  async updateApplicantStatus(
    jobId: number | string,
    applicantId: number | string,
    status: "pending" | "reviewed" | "shortlisted" | "rejected" | "accepted"
  ): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(
      `/admin/jobs/${jobId}/applicants/${applicantId}`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      }
    );
  }
}

export const employmentService = new EmploymentService();
