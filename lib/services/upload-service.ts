// Upload service for handling file uploads

export interface UploadResponse {
  success: boolean;
  message: string;
  data: {
    url: string;
    filename?: string;
  };
}

export const uploadService = {
  // Upload a single file
  uploadFile: async (file: File, folder?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    if (folder) {
      formData.append("folder", folder);
    }

    // Use fetch directly for FormData (don't set Content-Type header)
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
    if (!BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_URL is not defined");
    }

    // Get token
    let token: string | null = null;
    const envToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
    if (envToken && envToken !== "YOUR_JWT_TOKEN_HERE") {
      token = envToken;
    }
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}/admin/upload`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Upload failed");
    }

    return data;
  },

  // Upload image specifically for events
  uploadEventImage: async (file: File): Promise<string> => {
    try {
      const response = await uploadService.uploadFile(file, "events");
      return response.data.url;
    } catch (error) {
      console.error("Failed to upload event image:", error);
      throw error;
    }
  },

  // Upload image specifically for blog posts
  uploadBlogImage: async (file: File): Promise<string> => {
    try {
      const response = await uploadService.uploadFile(file, "blog");
      return response.data.url;
    } catch (error) {
      console.error("Failed to upload blog image:", error);
      throw error;
    }
  },

  // Upload image specifically for carousel
  uploadCarouselImage: async (file: File): Promise<string> => {
    try {
      const response = await uploadService.uploadFile(file, "carousel");
      return response.data.url;
    } catch (error) {
      console.error("Failed to upload carousel image:", error);
      throw error;
    }
  },
};
