import { apiClient } from "../api-client";

export interface Location {
  id: number;
  name: string;
  type: 'community' | 'suburb' | 'cottage' | 'smaller_community';
  parent_id: number | null;
  parent_name: string | null;
  population: number | null;
  area_size: number | null;
  coordinates: {
    latitude: number | null;
    longitude: number | null;
  };
  description: string | null;
  status: 'active' | 'inactive';
  children_count: number;
  created_at: string;
  updated_at: string;
  statistics?: LocationStats;
}

export interface LocationStats {
  total_issues: number;
  pending_issues: number;
  resolved_issues: number;
  total_projects: number;
  ongoing_projects: number;
  completed_projects: number;
  total_agents: number;
  child_locations: number;
}

export interface CreateLocationRequest {
  name: string;
  type: Location['type'];
  parent_id?: number | null;
  population?: number;
  area_size?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  status?: Location['status'];
}

export interface UpdateLocationRequest {
  name?: string;
  type?: Location['type'];
  parent_id?: number | null;
  population?: number;
  area_size?: number;
  latitude?: number;
  longitude?: number;
  description?: string;
  status?: Location['status'];
}

export interface LocationsListResponse {
  success: boolean;
  message: string;
  data: {
    locations: Location[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface LocationResponse {
  success: boolean;
  message: string;
  data: {
    location: Location;
  };
}

export interface LocationStatsResponse {
  success: boolean;
  message: string;
  data: {
    location: {
      id: number;
      name: string;
      type: string;
    };
    statistics: LocationStats;
  };
}

export interface LocationTypesResponse {
  success: boolean;
  message: string;
  data: {
    types: string[];
    counts: Record<string, number>;
    total: number;
  };
}

export const locationsService = {
  // Get all locations with pagination and filters
  getLocations: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    parent_id?: string | number;
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
  }): Promise<LocationsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.parent_id !== undefined) queryParams.append('parent_id', String(params.parent_id));
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by);
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order);

    const queryString = queryParams.toString();
    const url = `/admin/locations${queryString ? `?${queryString}` : ''}`;

    return apiClient<LocationsListResponse>(url, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Get location by ID
  getLocationById: async (id: number): Promise<LocationResponse> => {
    return apiClient<LocationResponse>(`/admin/locations/${id}`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Get location statistics
  getLocationStats: async (id: number): Promise<LocationStatsResponse> => {
    return apiClient<LocationStatsResponse>(`/admin/locations/${id}/stats`, {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Get location types summary
  getLocationTypes: async (): Promise<LocationTypesResponse> => {
    return apiClient<LocationTypesResponse>('/admin/locations/types', {
      method: 'GET',
      requiresAuth: true,
    });
  },

  // Create new location
  createLocation: async (data: CreateLocationRequest): Promise<LocationResponse> => {
    return apiClient<LocationResponse>('/admin/locations', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Update location
  updateLocation: async (id: number, data: UpdateLocationRequest): Promise<LocationResponse> => {
    return apiClient<LocationResponse>(`/admin/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      requiresAuth: true,
    });
  },

  // Delete location
  deleteLocation: async (id: number): Promise<{ success: boolean; message: string }> => {
    return apiClient(`/admin/locations/${id}`, {
      method: 'DELETE',
      requiresAuth: true,
    });
  },
};
