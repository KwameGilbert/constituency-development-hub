import { apiClient } from "../api-client";

export interface YouthRecord {
  id: number;
  full_name: string;
  date_of_birth: string | null;
  age: number | null;
  gender: "male" | "female" | null;
  national_id: string | null;
  phone: string | null;
  email: string | null;
  hometown: string | null;
  community: string | null;
  location_id: number | null;
  location?: {
    id: number;
    name: string;
  } | null;
  education_level: string | null;
  jhs_completed: boolean;
  shs_qualification: string | null;
  certificate_qualification: string | null;
  diploma_qualification: string | null;
  degree_qualification: string | null;
  postgraduate_qualification: string | null;
  professional_qualification: string | null;
  employment_status: "employed" | "unemployed" | "student" | "self_employed";
  availability_status: "available" | "unavailable";
  current_employment: string | null;
  preferred_location: string | null;
  salary_expectation: number | null;
  employment_notes: string | null;
  work_experiences: string[] | null;
  skills: string | null;
  interests: string | null;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateYouthRecordRequest {
  full_name: string;
  date_of_birth?: string;
  gender?: "male" | "female";
  national_id?: string;
  phone?: string;
  email?: string;
  hometown?: string;
  community?: string;
  location_id?: number;
  education_level?: string;
  jhs_completed?: boolean;
  shs_qualification?: string;
  certificate_qualification?: string;
  diploma_qualification?: string;
  degree_qualification?: string;
  postgraduate_qualification?: string;
  professional_qualification?: string;
  employment_status?: "employed" | "unemployed" | "student" | "self_employed";
  availability_status?: "available" | "unavailable";
  current_employment?: string;
  preferred_location?: string;
  salary_expectation?: number;
  employment_notes?: string;
  work_experiences?: string[];
  skills?: string;
  interests?: string;
  status?: "pending" | "approved" | "rejected";
  admin_notes?: string;
}

export type UpdateYouthRecordRequest = Partial<CreateYouthRecordRequest>;

export interface YouthRecordsListResponse {
  success: boolean;
  message: string;
  data: {
    records: YouthRecord[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface YouthRecordResponse {
  success: boolean;
  message: string;
  data: {
    record: YouthRecord;
  };
}

export interface YouthRecordStatsResponse {
  success: boolean;
  message: string;
  data: {
    statistics: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      employed: number;
      unemployed: number;
      students: number;
      self_employed: number;
    };
  };
}

// Employment status options for UI
export const EMPLOYMENT_STATUSES = [
  { value: "employed", label: "Employed" },
  { value: "unemployed", label: "Unemployed" },
  { value: "student", label: "Student" },
  { value: "self_employed", label: "Self-Employed" },
];

// Record status options for UI
export const RECORD_STATUSES = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// Education levels for UI
export const EDUCATION_LEVELS = [
  { value: "non_formal", label: "Non-Formal" },
  { value: "jhs", label: "JHS" },
  { value: "shs", label: "SHS" },
  { value: "certificate", label: "Certificate" },
  { value: "diploma", label: "Diploma" },
  { value: "degree", label: "Degree" },
  { value: "postgraduate", label: "Postgraduate" },
];

export const youthRecordsService = {
  // Get all youth records with filtering and pagination
  getYouthRecords: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    employment_status?: string;
    education_level?: string;
    location_id?: number;
    community?: string;
    search?: string;
    sort_by?: string;
    sort_order?: "asc" | "desc";
  }): Promise<YouthRecordsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.status) queryParams.append("status", params.status);
    if (params?.employment_status)
      queryParams.append("employment_status", params.employment_status);
    if (params?.education_level)
      queryParams.append("education_level", params.education_level);
    if (params?.location_id)
      queryParams.append("location_id", params.location_id.toString());
    if (params?.community) queryParams.append("community", params.community);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
    if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

    const queryString = queryParams.toString();
    const url = `/admin/youth-records${queryString ? `?${queryString}` : ""}`;

    return apiClient<YouthRecordsListResponse>(url, {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Get statistics
  getStatistics: async (): Promise<YouthRecordStatsResponse> => {
    return apiClient<YouthRecordStatsResponse>("/admin/youth-records/stats", {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Get single youth record by ID
  getYouthRecordById: async (id: number): Promise<YouthRecordResponse> => {
    return apiClient<YouthRecordResponse>(`/admin/youth-records/${id}`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Create youth record
  createYouthRecord: async (
    data: CreateYouthRecordRequest
  ): Promise<YouthRecordResponse> => {
    return apiClient<YouthRecordResponse>("/admin/youth-records", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Update youth record
  updateYouthRecord: async (
    id: number,
    data: UpdateYouthRecordRequest
  ): Promise<YouthRecordResponse> => {
    return apiClient<YouthRecordResponse>(`/admin/youth-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Update youth record status (approve/reject)
  updateYouthRecordStatus: async (
    id: number,
    data: { status: "pending" | "approved" | "rejected"; admin_notes?: string }
  ): Promise<YouthRecordResponse> => {
    return apiClient<YouthRecordResponse>(`/admin/youth-records/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Delete youth record
  deleteYouthRecord: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient(`/admin/youth-records/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },
};
