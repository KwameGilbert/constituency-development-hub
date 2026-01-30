import { apiClient } from "../api-client";

export interface Notification {
  id: number;
  type:
    | "info"
    | "success"
    | "warning"
    | "error"
    | "issue"
    | "project"
    | "announcement"
    | "assignment"
    | "system";
  title: string;
  message: string;
  action_url: string | null;
  action_text: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
  time_ago: string | null;
}

export interface NotificationsListResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    };
    unread_count: number;
  };
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: {
    notification: Notification;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  message: string;
  data: {
    unread_count: number;
  };
}

export interface MarkAllReadResponse {
  success: boolean;
  message: string;
  data: {
    marked_count: number;
    unread_count: number;
  };
}

// Notification type icons and colors for UI
export const NOTIFICATION_TYPES = {
  info: {
    icon: "info",
    color: "blue",
    bgColor: "bg-blue-100",
    textColor: "text-blue-600",
  },
  success: {
    icon: "check_circle",
    color: "green",
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
  warning: {
    icon: "warning",
    color: "yellow",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-600",
  },
  error: {
    icon: "error",
    color: "red",
    bgColor: "bg-red-100",
    textColor: "text-red-600",
  },
  issue: {
    icon: "report_problem",
    color: "orange",
    bgColor: "bg-orange-100",
    textColor: "text-orange-600",
  },
  project: {
    icon: "folder",
    color: "purple",
    bgColor: "bg-purple-100",
    textColor: "text-purple-600",
  },
  announcement: {
    icon: "campaign",
    color: "indigo",
    bgColor: "bg-indigo-100",
    textColor: "text-indigo-600",
  },
  assignment: {
    icon: "assignment",
    color: "teal",
    bgColor: "bg-teal-100",
    textColor: "text-teal-600",
  },
  system: {
    icon: "settings",
    color: "gray",
    bgColor: "bg-gray-100",
    textColor: "text-gray-600",
  },
};

export const notificationsService = {
  // Get user's notifications
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    is_read?: boolean;
    type?: string;
  }): Promise<NotificationsListResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.is_read !== undefined)
      queryParams.append("is_read", params.is_read.toString());
    if (params?.type) queryParams.append("type", params.type);

    const queryString = queryParams.toString();
    const url = `/notifications${queryString ? `?${queryString}` : ""}`;

    return apiClient<NotificationsListResponse>(url, {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Get single notification
  getNotificationById: async (id: number): Promise<NotificationResponse> => {
    return apiClient<NotificationResponse>(`/notifications/${id}`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Get unread count
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return apiClient<UnreadCountResponse>("/notifications/unread-count", {
      method: "GET",
      requiresAuth: true,
    });
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<NotificationResponse> => {
    return apiClient<NotificationResponse>(`/notifications/${id}/read`, {
      method: "PUT",
      requiresAuth: true,
    });
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<MarkAllReadResponse> => {
    return apiClient<MarkAllReadResponse>("/notifications/read-all", {
      method: "PUT",
      requiresAuth: true,
    });
  },

  // Delete notification
  deleteNotification: async (
    id: number,
  ): Promise<{ success: boolean; message: string }> => {
    return apiClient(`/notifications/${id}`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },
};
