import { apiClient } from "@/lib/api-client";

// Category Interface
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  display_order: number;
  status: "active" | "inactive";
  sectors_count?: number;
  created_at?: string;
  updated_at?: string;
}

// Request Interfaces
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status?: "active" | "inactive";
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string | null;
  icon?: string | null;
  color?: string | null;
  status?: "active" | "inactive";
}

// Response Interfaces
export interface CategoriesListResponse {
  success: boolean;
  message: string;
  data: {
    categories: Category[];
  };
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: {
    category: Category;
  };
}

export interface CategoryWithSectorsResponse {
  success: boolean;
  message: string;
  data: {
    category: Category;
    sectors: Array<{
      id: number;
      name: string;
      slug: string;
      description: string | null;
      icon: string | null;
      color: string | null;
      projects_count: number;
    }>;
  };
}

// Categories Service
export const categoriesService = {
  // Get all categories (public - active only)
  getCategories: async (): Promise<CategoriesListResponse> => {
    return apiClient<CategoriesListResponse>("/categories", { method: "GET" });
  },

  // Get all categories (admin - includes inactive)
  getAdminCategories: async (params?: {
    status?: string;
    search?: string;
  }): Promise<CategoriesListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);

    const url = `/categories${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;
    return apiClient<CategoriesListResponse>(url, { method: "GET" });
  },

  // Get single category by ID
  getCategoryById: async (id: number): Promise<CategoryResponse> => {
    return apiClient<CategoryResponse>(`/categories/${id}`, {
      method: "GET",
    });
  },

  // Get category by slug with sectors
  getCategoryBySlug: async (
    slug: string,
  ): Promise<CategoryWithSectorsResponse> => {
    return apiClient<CategoryWithSectorsResponse>(`/categories/${slug}`, {
      method: "GET",
    });
  },

  // Create new category
  createCategory: async (
    data: CreateCategoryRequest,
  ): Promise<CategoryResponse> => {
    return apiClient<CategoryResponse>("/categories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Update category
  updateCategory: async (
    id: number,
    data: UpdateCategoryRequest,
  ): Promise<CategoryResponse> => {
    return apiClient<CategoryResponse>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // Delete category
  deleteCategory: async (
    id: number,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(
      `/categories/${id}`,
      { method: "DELETE" },
    );
  },

  // Reorder categories
  reorderCategories: async (
    orderedIds: number[],
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient<{ success: boolean; message: string }>(
      "/categories/reorder",
      {
        method: "PUT",
        body: JSON.stringify({ ordered_ids: orderedIds }),
      },
    );
  },
};
