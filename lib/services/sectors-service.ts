import { apiClient } from "../api-client";

export interface Sector {
  id: number;
  category_id: number | null;
  category_name: string | null;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  status: "active" | "inactive";
  projects_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSectorRequest {
  category_id?: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  display_order?: number;
  status?: "active" | "inactive";
}

export interface UpdateSectorRequest {
  category_id?: number | null;
  name?: string;
  description?: string;
  slug?: string;
  icon?: string;
  color?: string;
  display_order?: number;
  status?: "active" | "inactive";
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
  getSectors: async (categoryId?: number): Promise<SectorsListResponse> => {
    const url = categoryId ? `/sectors?category_id=${categoryId}` : "/sectors";
    return apiClient<SectorsListResponse>(url, {
      method: "GET",
    });
  },

  // Get single sector
  getSector: async (id: number): Promise<SectorResponse> => {
    return apiClient<SectorResponse>(`/sectors/${id}`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Create new sector
  createSector: async (data: CreateSectorRequest): Promise<SectorResponse> => {
    return apiClient<SectorResponse>("/sectors", {
      method: "POST",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Update sector
  updateSector: async (
    id: number,
    data: UpdateSectorRequest,
  ): Promise<SectorResponse> => {
    return apiClient<SectorResponse>(`/sectors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Delete sector
  deleteSector: async (
    id: number,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(
      `/sectors/${id}`,
      {
        method: "DELETE",
        requiresAuth: true,
      },
    );
  },

  // Reorder sectors
  reorderSectors: async (
    orderedIds: number[],
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(
      "/sectors/reorder",
      {
        method: "PUT",
        body: JSON.stringify({ order: orderedIds }),
        requiresAuth: true,
      },
    );
  },

  // ---------------------------------------------------------------------------
  // Sub-Sectors
  // ---------------------------------------------------------------------------

  // Get sub-sectors for a sector
  getSubSectors: async (
    sectorId: number,
  ): Promise<{
    success: boolean;
    data: { sub_sectors: SubSector[]; sector_name?: string };
  }> => {
    return apiClient<{
      success: boolean;
      data: { sub_sectors: SubSector[]; sector_name?: string };
    }>(`/sub-sectors?sector_id=${sectorId}`, {
      method: "GET",
    });
  },

  // Create sub-sector
  createSubSector: async (
    sectorId: number,
    data: CreateSubSectorRequest,
  ): Promise<{ success: boolean; message: string; data: { sub_sector: SubSector } }> => {
    return apiClient<{
      success: boolean;
      message: string;
      data: { sub_sector: SubSector };
    }>("/sub-sectors", {
      method: "POST",
      body: JSON.stringify({ ...data, sector_id: sectorId }),
      requiresAuth: true,
    });
  },

  // Update sub-sector
  updateSubSector: async (
    id: number,
    data: UpdateSubSectorRequest,
  ): Promise<{ success: boolean; message: string; data: { sub_sector: SubSector } }> => {
    return apiClient<{
      success: boolean;
      message: string;
      data: { sub_sector: SubSector };
    }>(`/sub-sectors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Delete sub-sector
  deleteSubSector: async (
    id: number,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(
      `/sub-sectors/${id}`,
      {
        method: "DELETE",
        requiresAuth: true,
      },
    );
  },

  // Reorder sub-sectors
  reorderSubSectors: async (
    orderedIds: number[],
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(
      "/sub-sectors/reorder",
      {
        method: "PUT",
        body: JSON.stringify({ order: orderedIds }),
        requiresAuth: true,
      },
    );
  },
};

export interface SubSector {
  id: number;
  sector_id: number;
  sector_name?: string;
  name: string;
  code: string | null;
  description: string | null;
  icon: string | null;
  display_order: number;
  status: "active" | "inactive";
  issues_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateSubSectorRequest {
  name: string;
  code?: string;
  description?: string;
  icon?: string;
  status?: "active" | "inactive";
}

export interface UpdateSubSectorRequest {
  name?: string;
  code?: string;
  description?: string;
  icon?: string;
  status?: "active" | "inactive";
  display_order?: number;
}
