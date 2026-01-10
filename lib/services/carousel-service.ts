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
  createSlide: async (data: CreateHeroSlidePayload, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    return apiClient<HeroSlidesResponse>("/admin/hero-slides", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },

  // Update hero slide
  updateSlide: async (id: number, data: Partial<CreateHeroSlidePayload>, file?: File) => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      return apiClient<HeroSlidesResponse>(`/admin/hero-slides/${id}`, {
        method: "PUT",
        body: formData,
        isFormData: true,
      });
    }

    return apiClient<HeroSlidesResponse>(`/admin/hero-slides/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete hero slide
  deleteSlide: async (id: number) => {
    return apiClient<{ success: boolean; message: string }>(`/admin/hero-slides/${id}`, {
      method: "DELETE",
    });
  },

  // Reorder hero slides
  reorderSlides: async (orderedIds: number[]) => {
    return apiClient<{ success: boolean; message: string }>("/admin/hero-slides/reorder", {
      method: "PUT",
      body: JSON.stringify({ order: orderedIds }),
    });
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
