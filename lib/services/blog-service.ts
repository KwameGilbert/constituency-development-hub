import { apiClient } from "../api-client";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featured_image?: string;
  category: string;
  tags?: string[];
  status?: "draft" | "published";
  published_at?: string;
  created_at?: string;
  views?: number;
  author?: string;
}

export interface BlogResponse {
  success: boolean;
  message: string;
  data: {
    posts: BlogPost[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    post?: BlogPost; // For single post responses
  };
}

export const blogService = {
  // Public Routes
  getAllPosts: async (page = 1, limit = 10) => {
    return apiClient<BlogResponse>(`/blog?page=${page}&limit=${limit}`, {
      requiresAuth: false,
    });
  },

  getFeaturedPosts: async (limit = 3) => {
    return apiClient<BlogResponse>(`/blog/featured?limit=${limit}`, {
      requiresAuth: false,
    });
  },

  getCategories: async () => {
    return apiClient<{ success: boolean; data: { categories: string[] } }>(
      "/blog/categories",
      { requiresAuth: false }
    );
  },

  getPostBySlug: async (slug: string) => {
    return apiClient<BlogResponse>(`/blog/${slug}`, { requiresAuth: false });
  },

  // Admin Routes
  getAdminPosts: async (page = 1, limit = 10, status?: string) => {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) query.append("status", status);
    
    return apiClient<BlogResponse>(`/admin/blog?${query.toString()}`);
  },

  getPostById: async (id: number) => {
    return apiClient<BlogResponse>(`/admin/blog/${id}`);
  },

  createPost: async (data: Partial<BlogPost>) => {
    return apiClient<BlogResponse>("/admin/blog", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updatePost: async (id: number, data: Partial<BlogPost>) => {
    return apiClient<BlogResponse>(`/admin/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deletePost: async (id: number) => {
    return apiClient<{ success: true; message: string }>(`/admin/blog/${id}`, {
      method: "DELETE",
    });
  },
};
