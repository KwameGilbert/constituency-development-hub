import { apiClient } from "../api-client";

export interface Event {
  id: number;
  title: string;
  slug?: string;
  description?: string;
  image?: string;
  location: string;
  event_date: string; // Format: "2025-01-15"
  start_time?: string; // Format: "10:00:00" or "10:00"
  end_time?: string;
  status: "upcoming" | "past" | "cancelled";
  registration_required?: boolean;
  max_attendees?: number;
  created_at?: string;
  updated_at?: string;
}

export interface EventsResponse {
  success: boolean;
  message: string;
  data: {
    events?: Event[];
    event?: Event;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
  };
}

export interface CreateEventPayload {
  name?: string; // Backend expects 'name' field
  title?: string;
  description?: string;
  image?: string;
  location: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  registration_required?: boolean;
  max_attendees?: number;
  status?: "upcoming" | "past" | "cancelled";
}

export const eventsService = {
  // ============================================================
  // PUBLIC ROUTES (No Authentication Required)
  // ============================================================

  // Get all events with pagination
  getAllEvents: async (page = 1, limit = 10) => {
    return apiClient<EventsResponse>(`/events?page=${page}&limit=${limit}`, {
      requiresAuth: false,
    });
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 5) => {
    return apiClient<EventsResponse>(`/events/upcoming?limit=${limit}`, {
      requiresAuth: false,
    });
  },

  // Get single event by slug (public)
  getEventBySlug: async (slug: string) => {
    return apiClient<EventsResponse>(`/events/${slug}`, { 
      requiresAuth: false 
    });
  },

  // ============================================================
  // ADMIN ROUTES (Requires web_admin role)
  // ============================================================

  // Get all events including past (admin)
  getAdminEvents: async (page = 1, limit = 10) => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return apiClient<EventsResponse>(`/admin/events?${query.toString()}`);
  },

  // Get single event by ID (admin)
  getEventById: async (id: number) => {
    return apiClient<EventsResponse>(`/admin/events/${id}`);
  },

  // Create new event - accepts any object to handle different backend field requirements
  createEvent: async (data: Record<string, unknown>, file?: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      return apiClient<EventsResponse>("/admin/events", {
        method: "POST",
        body: formData,
        isFormData: true,
      });
    }

    return apiClient<EventsResponse>("/admin/events", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update event - accepts any object for flexibility
  updateEvent: async (id: number, data: Record<string, unknown>, file?: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      return apiClient<EventsResponse>(`/admin/events/${id}`, {
        method: "PUT",
        body: formData,
        isFormData: true,
      });
    }

    return apiClient<EventsResponse>(`/admin/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete event
  deleteEvent: async (id: number) => {
    return apiClient<{ success: boolean; message: string }>(`/admin/events/${id}`, {
      method: "DELETE",
    });
  },
};
