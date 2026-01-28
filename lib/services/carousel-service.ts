import { apiClient } from "../api-client";

// Hero Slide interface matching the API response
export interface HeroSlide {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  cta_text?: string;
  cta_link?: string;
  display_order: number;
  status?: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

// Alias for backward compatibility
export type CarouselItem = HeroSlide;

export interface HeroSlidesResponse {
  success: boolean;
  message: string;
  data: {
    slides?: HeroSlide[];
    slide?: HeroSlide;
  };
}

// Alias for backward compatibility
export type CarouselResponse = HeroSlidesResponse;

export interface CreateHeroSlidePayload {
  title: string;
  subtitle?: string;
  image: string;
  cta_text?: string;
  cta_link?: string;
  display_order?: number;
  status?: "active" | "inactive";
}

export const heroSlidesService = {
  // ============================================================
  // PUBLIC ROUTES (No Authentication Required)
  // ============================================================

  // Get all active hero slides
  getActiveSlides: async () => {
    return apiClient<HeroSlidesResponse>("/hero-slides", {
      requiresAuth: false,
    });
  },

  // ============================================================
  // ADMIN ROUTES (Requires web_admin role)
  // ============================================================

  // Get all hero slides (including inactive)
  getAllSlides: async () => {
    return apiClient<HeroSlidesResponse>("/admin/hero-slides");
  },

  // Get single hero slide by ID
  getSlideById: async (id: number) => {
    return apiClient<HeroSlidesResponse>(`/admin/hero-slides/${id}`);
  },

  // Create new hero slide
  createSlide: async (data: CreateHeroSlidePayload | FormData) => {
    return apiClient<HeroSlidesResponse>("/admin/hero-slides", {
      method: "POST",
      body: data instanceof FormData ? data : JSON.stringify(data),
      isFormData: data instanceof FormData,
    });
  },

  // Update hero slide
  updateSlide: async (
    id: number,
    data: Partial<CreateHeroSlidePayload> | FormData,
  ) => {
    return apiClient<HeroSlidesResponse>(`/admin/hero-slides/${id}`, {
      method: "POST", // Changed to POST for FormData support (method spoofing if needed, but standard POST usually works for files)
      // Note: Actually, Laravel/Slim often handles PUT with files better if using _method spoofing,
      // but let's try direct PUT or POST based on backend.
      // Checking backend controller: it separates store (POST) and update (PUT).
      // PHP native PUT doesn't handle multipart/form-data well.
      // Best practice for PHP is POST with _method=PUT.
      body: data instanceof FormData ? data : JSON.stringify(data),
      isFormData: data instanceof FormData,
      headers:
        data instanceof FormData
          ? { "X-HTTP-Method-Override": "PUT" }
          : undefined, // Attempt method override if needed
    });
  },

  // Delete hero slide
  deleteSlide: async (id: number) => {
    return apiClient<{ success: boolean; message: string }>(
      `/admin/hero-slides/${id}`,
      {
        method: "DELETE",
      },
    );
  },

  // Reorder hero slides
  reorderSlides: async (orderedIds: number[]) => {
    return apiClient<{ success: boolean; message: string }>(
      "/admin/hero-slides/reorder",
      {
        method: "PUT",
        body: JSON.stringify({ order: orderedIds }),
      },
    );
  },
};

// Alias for backward compatibility with components using carouselService
export const carouselService = {
  getActiveItems: heroSlidesService.getActiveSlides,
  getAllItems: heroSlidesService.getAllSlides,
  getItemById: heroSlidesService.getSlideById,
  createItem: heroSlidesService.createSlide,
  updateItem: heroSlidesService.updateSlide,
  deleteItem: heroSlidesService.deleteSlide,
  reorderItems: heroSlidesService.reorderSlides,
};
