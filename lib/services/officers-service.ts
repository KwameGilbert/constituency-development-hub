import { apiClient } from "../api-client";
import { User } from "./auth-service";

export interface Officer {
  id: number;
  user_id: number;
  employee_id: string;
  title: string | null;
  department: string | null;
  assigned_sectors: string[] | null; // Array of sector IDs or names
  assigned_locations: string[] | null; // Array of location names
  can_manage_projects: boolean;
  can_manage_reports: boolean;
  can_manage_events: boolean;
  can_publish_content: boolean;
  profile_image: string | null;
  bio: string | null;
  office_location: string | null;
  office_phone: string | null;
  created_at: string;
  supervised_agents_count?: number;
  pending_reports_count?: number;
  user?: User;
}

export interface CreateOfficerRequest {
  name: string;
  email: string;
  phone?: string;
  password?: string; // Optional, auto-generated if missing
  employee_id?: string; // Optional, auto-generated if missing
  title?: string;
  department?: string;
  assigned_sectors?: string[];
  assigned_locations?: string[];
  can_manage_projects?: boolean;
  can_manage_reports?: boolean;
  can_manage_events?: boolean;
  can_publish_content?: boolean;
  profile_image?: File;
  bio?: string;
  office_location?: string;
  office_phone?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateOfficerRequest {
  name?: string;
  phone?: string;
  status?: 'active' | 'inactive';
  title?: string;
  department?: string;
  assigned_sectors?: string[];
  assigned_locations?: string[];
  can_manage_projects?: boolean;
  can_manage_reports?: boolean;
  can_manage_events?: boolean;
  can_publish_content?: boolean;
  profile_image?: File;
  bio?: string;
  office_location?: string;
  office_phone?: string;
}

export interface OfficersListResponse {
  success: boolean;
  message: string;
  data: {
    officers: Officer[];
  };
}

export interface OfficerResponse {
  success: boolean;
  message: string;
  data: {
    officer: Officer;
    generated_password?: string;
  };
}

export const officersService = {
  // Get all officers
  getOfficers: async (params?: { department?: string }): Promise<OfficersListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.department) queryParams.append('department', params.department);
    
    return apiClient<OfficersListResponse>(`/admin/officers?${queryParams.toString()}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Get single officer
  getOfficer: async (id: number | string): Promise<OfficerResponse> => {
    return apiClient<OfficerResponse>(`/admin/officers/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Create new officer
  createOfficer: async (data: CreateOfficerRequest): Promise<OfficerResponse> => {
    const formData = new FormData();
    
    // Append standard fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'assigned_sectors' || key === 'assigned_locations') {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(`${key}[]`, item));
        }
      } else if (key === 'profile_image') {
        if (value instanceof File) {
          formData.append(key, value);
        }
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    return apiClient<OfficerResponse>('/admin/officers', {
      method: 'POST',
      body: formData,
      requiresAuth: true,
      isFormData: true,
    });
  },

  // Update officer
  updateOfficer: async (id: number | string, data: UpdateOfficerRequest): Promise<OfficerResponse> => {
    const formData = new FormData();
    
    // Append fields
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'assigned_sectors' || key === 'assigned_locations') {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(`${key}[]`, item));
        }
      } else if (key === 'profile_image') {
        if (value instanceof File) {
          formData.append(key, value);
        }
      } else if (typeof value === 'boolean') {
        formData.append(key, value ? '1' : '0');
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    // Required for PUT requests with FormData in some backends, 
    // but typically Slim/PHP handles POST with _method=PUT better for file uploads.
    // However, apiClient usually handles JSON. For FormData, we might need a POST with _method spoofing if the backend expects it.
    // The backend route is defined as PUT /{id}. PHP (native) doesn't parse multipart/form-data for PUT requests easily.
    // Let's assume we use POST with X-HTTP-Method-Override or similar if standard PUT fails with files.
    // But apiClient does standard fetch.
    // A safe bet for PHP backends with file uploads is POST with `_method` = 'PUT'.
    formData.append('_method', 'PUT');

    return apiClient<OfficerResponse>(`/admin/officers/${id}`, {
      method: 'POST', // Use POST to allow file upload processing in PHP
      body: formData,
      requiresAuth: true,
      isFormData: true,
    });
  },

  // Delete officer
  deleteOfficer: async (id: number | string): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(`/admin/officers/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};
