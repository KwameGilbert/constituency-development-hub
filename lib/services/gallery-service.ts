import { apiClient } from "@/lib/api-client";

export type GalleryCategory = "All" | "Events" | "Programs" | "Community" | "Infrastructure" | "General";

export interface GalleryImage {
  url: string;
  caption: string;
}

export interface Gallery {
  id: number;
  title: string;
  slug: string;
  description?: string;
  category: GalleryCategory;
  date: string;
  location: string;
  cover_image: string;
  images: GalleryImage[];
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export interface GalleriesResponse {
  success: boolean;
  message: string;
  data: {
    galleries: Gallery[];
  };
}

export interface GalleryResponse {
  success: boolean;
  message: string;
  data: {
    gallery: Gallery;
  };
}

export interface CreateGalleryPayload {
  title: string;
  description?: string;
  category: string;
  date: string;
  location: string;
  cover_image: File;
  gallery_images?: File[];
  gallery_captions?: string[];
  status?: string;
}

export interface UpdateGalleryPayload {
  title?: string;
  description?: string;
  category?: string;
  date?: string;
  location?: string;
  cover_image?: File;
  gallery_images?: File[];
  new_gallery_captions?: string[];
  existing_images?: GalleryImage[]; // Passed as JSON string if using FormData
  status?: string;
  _method?: string;
}

export const galleryService = {
  /**
   * Get all galleries (public)
   */
  getGalleries: async () => {
    return apiClient<GalleriesResponse>("/gallery");
  },

  /**
   * Get all galleries for admin
   */
  getAdminGalleries: async () => {
    return apiClient<GalleriesResponse>("/admin/gallery");
  },

  /**
   * Get single gallery by ID or slug
   */
  getGallery: async (idOrSlug: string | number) => {
    return apiClient<GalleryResponse>(`/gallery/${idOrSlug}`);
  },

  /**
   * Create new gallery
   */
  createGallery: async (data: CreateGalleryPayload) => {
    const formData = new FormData();
    
    // Add simple fields
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'cover_image' && key !== 'gallery_images' && key !== 'gallery_captions' && value !== undefined) {
        formData.append(key, String(value));
      }
    });

    // Add cover image
    formData.append('cover_image', data.cover_image);

    // Add gallery images and captions
    if (data.gallery_images) {
      data.gallery_images.forEach((file) => {
        formData.append('gallery_images[]', file);
      });
    }

    if (data.gallery_captions) {
      data.gallery_captions.forEach((caption) => {
        formData.append('gallery_captions[]', caption);
      });
    }

    return apiClient<GalleryResponse>("/admin/gallery", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
  },

  /**
   * Update gallery
   */
  updateGallery: async (id: number, data: UpdateGalleryPayload) => {
    const formData = new FormData();
    formData.append("_method", "PUT"); // Method override for FormData updates

    // Add simple fields
    Object.entries(data).forEach(([key, value]) => {
      if (
        key !== 'cover_image' && 
        key !== 'gallery_images' && 
        key !== 'new_gallery_captions' && 
        key !== 'existing_images' && 
        key !== '_method' && 
        value !== undefined
      ) {
        formData.append(key, String(value));
      }
    });

    // Add cover image
    if (data.cover_image) {
      formData.append('cover_image', data.cover_image);
    }

    // Add new gallery images and captions
    if (data.gallery_images) {
      data.gallery_images.forEach((file) => {
        formData.append('gallery_images[]', file);
      });
    }

    if (data.new_gallery_captions) {
      data.new_gallery_captions.forEach((caption) => {
        formData.append('new_gallery_captions[]', caption);
      });
    }

    // Add existing images to keep
    if (data.existing_images) {
      formData.append('existing_images', JSON.stringify(data.existing_images));
    }

    return apiClient<GalleryResponse>(`/admin/gallery/${id}`, {
      method: "POST", // Use POST with _method override for FormData updates
      body: formData,
      isFormData: true,
    });
  },

  /**
   * Delete gallery
   */
  deleteGallery: async (id: number) => {
    return apiClient<{ success: boolean; message: string }>(`/admin/gallery/${id}`, {
      method: "DELETE",
    });
  },
};
