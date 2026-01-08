import { apiClient } from "../api-client";

export interface YouthProgram {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  status: 'draft' | 'upcoming' | 'active' | 'registration_closed' | 'completed' | 'cancelled';
  start_date: string | null;
  end_date: string | null;
  registration_deadline: string | null;
  max_participants: number | null;
  current_enrollment: number;
  available_spots: number | null;
  is_registration_open: boolean;
  venue: string | null;
  image_url: string | null;
  location?: {
    id: number;
    name: string;
  } | null;
  requirements?: string[] | null;
  benefits?: string[] | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  created_at: string;
  updated_at?: string;
  participants_count?: number;
  approved_count?: number;
}

export interface YouthProgramParticipant {
  id: number;
  program_id: number;
  user_id: number | null;
  full_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn' | 'completed';
  registered_at: string;
  completed_at: string | null;
}

export interface CreateProgramRequest {
  title: string;
  description?: string;
  category: string;
  start_date?: string;
  end_date?: string;
  registration_deadline?: string;
  status?: YouthProgram['status'];
  max_participants?: number;
  location_id?: number;
  venue?: string;
  image_url?: string;
  requirements?: string[];
  benefits?: string[];
  contact_email?: string;
  contact_phone?: string;
}

export type UpdateProgramRequest = Partial<CreateProgramRequest>;

export interface EnrollmentRequest {
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

export interface ProgramsListResponse {
  success: boolean;
  message: string;
  data: {
    programs: YouthProgram[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface ProgramResponse {
  success: boolean;
  message: string;
  data: {
    program: YouthProgram;
  };
}

export interface ParticipantsListResponse {
  success: boolean;
  message: string;
  data: {
    program: {
      id: number;
      title: string;
    };
    participants: YouthProgramParticipant[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface EnrollmentResponse {
  success: boolean;
  message: string;
  data: {
    enrollment: YouthProgramParticipant;
  };
}

// Program categories for UI
export const PROGRAM_CATEGORIES = [
  { value: 'education', label: 'Education' },
  { value: 'employment', label: 'Employment' },
  { value: 'entrepreneurship', label: 'Entrepreneurship' },
  { value: 'skills_training', label: 'Skills Training' },
  { value: 'sports', label: 'Sports' },
  { value: 'arts_culture', label: 'Arts & Culture' },
  { value: 'technology', label: 'Technology' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' },
];

// Program statuses for UI
export const PROGRAM_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'registration_closed', label: 'Registration Closed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export const youthProgramsService = {
  // PUBLIC ENDPOINTS

  // Get active programs (public)
  getPublicPrograms: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    location_id?: number;
    search?: string;
  }): Promise<ProgramsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.location_id) queryParams.append('location_id', params.location_id.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `/youth-programs${queryString ? `?${queryString}` : ''}`;

    return apiClient<ProgramsListResponse>(url, {
      method: 'GET',
    });
  },

  // Get program by slug (public)
  getProgramBySlug: async (slug: string): Promise<ProgramResponse> => {
    return apiClient<ProgramResponse>(`/youth-programs/${slug}`, {
      method: 'GET',
    });
  },

  // Enroll in a program (public)
  enrollInProgram: async (programId: number, data: EnrollmentRequest): Promise<EnrollmentResponse> => {
    return apiClient<EnrollmentResponse>(`/youth-programs/${programId}/enroll`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // ADMIN ENDPOINTS

  // Get all programs (admin)
  getAllPrograms: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    location_id?: number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<ProgramsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.category) queryParams.append('category', params.category);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.location_id) queryParams.append('location_id', params.location_id.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const queryString = queryParams.toString();
    const url = `/admin/youth-programs${queryString ? `?${queryString}` : ''}`;

    return apiClient<ProgramsListResponse>(url, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Get program by ID (admin)
  getProgramById: async (id: number): Promise<ProgramResponse> => {
    return apiClient<ProgramResponse>(`/admin/youth-programs/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Create program (admin)
  createProgram: async (data: CreateProgramRequest): Promise<ProgramResponse> => {
    return apiClient<ProgramResponse>('/admin/youth-programs', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Update program (admin)
  updateProgram: async (id: number, data: UpdateProgramRequest): Promise<ProgramResponse> => {
    return apiClient<ProgramResponse>(`/admin/youth-programs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Delete program (admin)
  deleteProgram: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiClient(`/admin/youth-programs/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  // Get program participants (admin)
  getParticipants: async (programId: number, params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ParticipantsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const url = `/admin/youth-programs/${programId}/participants${queryString ? `?${queryString}` : ''}`;

    return apiClient<ParticipantsListResponse>(url, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Update participant status (admin)
  updateParticipantStatus: async (
    programId: number,
    participantId: number,
    data: { status: YouthProgramParticipant['status']; notes?: string }
  ): Promise<{ success: boolean; message: string; data: { participant: YouthProgramParticipant } }> => {
    return apiClient(`/admin/youth-programs/${programId}/participants/${participantId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },
};
