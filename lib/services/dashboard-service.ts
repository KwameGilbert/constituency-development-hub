import { apiClient } from "../api-client";
import { BlogResponse } from "./blog-service";
import { EventsResponse } from "./events-service";
import { HeroSlidesResponse } from "./carousel-service";

export interface DashboardStats {
  blog_posts: number;
  events: number;
  carousel_items: number;
  upcoming_events: number;
}

export interface StatsResponse {
  success: boolean;
  message: string;
  data: DashboardStats;
}

export const dashboardService = {
  // Try dedicated stats endpoint first, fallback to counting from individual endpoints
  getStats: async (): Promise<StatsResponse> => {
    try {
      // Try the dedicated stats endpoint first
      return await apiClient<StatsResponse>("/admin/dashboard/stats");
    } catch {
      // If it doesn't exist, aggregate from individual endpoints
      return dashboardService.aggregateStats();
    }
  },

  // Fallback: aggregate stats from individual API calls
  aggregateStats: async (): Promise<StatsResponse> => {
    const stats: DashboardStats = {
      blog_posts: 0,
      events: 0,
      carousel_items: 0,
      upcoming_events: 0,
    };

    // Fetch blog posts count
    try {
      const blogResponse = await apiClient<BlogResponse>("/admin/blog?page=1&limit=1");
      if (blogResponse.success && blogResponse.data.pagination) {
        stats.blog_posts = blogResponse.data.pagination.total;
      }
    } catch {
      // Silently fail, keep default 0
    }

    // Fetch events count
    try {
      const eventsResponse = await apiClient<EventsResponse>("/admin/events?page=1&limit=1");
      if (eventsResponse.success && eventsResponse.data.pagination) {
        stats.events = eventsResponse.data.pagination.total;
      }
    } catch {
      // Silently fail, keep default 0
    }

    // Fetch hero slides count (carousel)
    try {
      const slidesResponse = await apiClient<HeroSlidesResponse>("/admin/hero-slides");
      if (slidesResponse.success && slidesResponse.data.slides) {
        stats.carousel_items = slidesResponse.data.slides.length;
      }
    } catch {
      // Silently fail, keep default 0
    }

    // Fetch upcoming events count
    try {
      const upcomingResponse = await apiClient<EventsResponse>("/events/upcoming?limit=100");
      if (upcomingResponse.success && upcomingResponse.data.events) {
        stats.upcoming_events = upcomingResponse.data.events.length;
      }
    } catch {
      // Silently fail, keep default 0
    }

    return {
      success: true,
      message: "Stats aggregated from individual endpoints",
      data: stats,
    };
  },
};
