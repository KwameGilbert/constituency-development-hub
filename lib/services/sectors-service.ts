import { apiClient } from "../api-client";

export interface Sector {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  status: 'active' | 'inactive';
  projects_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSectorRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  display_order?: number;
  status?: 'active' | 'inactive';
}

export interface UpdateSectorRequest {
  name?: string;
  description?: string;
  slug?: string;
  icon?: string;
  color?: string;
  display_order?: number;
  status?: 'active' | 'inactive';
}

export interface SectorsListResponse {
  success: boolean;
  message: string;
  data: {
    sectors: Sector[];
  };
}

export interface SectorResponse {
  success: boolean;
  message: string;
  data: {
    sector: Sector;
  };
}

export const sectorsService = {
  // Get all sectors (Public view)
  getSectors: async (): Promise<SectorsListResponse> => {
    return apiClient<SectorsListResponse>('/sectors', {
      method: 'GET',
    });
  },

  // Get single sector
  getSector: async (id: number): Promise<SectorResponse> => {
    return apiClient<SectorResponse>(`/admin/sectors/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Create new sector
  createSector: async (data: CreateSectorRequest): Promise<SectorResponse> => {
    return apiClient<SectorResponse>('/admin/sectors', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Update sector
  updateSector: async (id: number, data: UpdateSectorRequest): Promise<SectorResponse> => {
    return apiClient<SectorResponse>(`/admin/sectors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Delete sector
  deleteSector: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(`/admin/sectors/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },

  // Reorder sectors
  reorderSectors: async (orderedIds: number[]): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>('/admin/sectors/reorder', {
      method: 'PUT',
      body: JSON.stringify({ order: orderedIds }),
      requiresAuth: true,
    });
  },
};
