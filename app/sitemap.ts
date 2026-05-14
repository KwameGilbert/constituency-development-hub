import { MetadataRoute } from "next";
import { blogService } from "@/lib/services/blog-service";
import { eventsService } from "@/lib/services/events-service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://kofibenteh.com";

  // Static routes
  const routes = [
    "",
    "/about",
    "/contact",
    "/youth",
    "/gallery",
    "/blog",
    "/events",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic Blog Posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogResponse = await blogService.getAllPosts(1, 100);
    if (blogResponse.success && blogResponse.data.posts) {
      blogRoutes = blogResponse.data.posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(
          post.published_at || post.created_at || new Date(),
        ),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Failed to generate blog sitemap:", error);
  }

  // Dynamic Events
  let eventRoutes: MetadataRoute.Sitemap = [];
  try {
    const eventsResponse = await eventsService.getAllEvents(1, 100);
    if (eventsResponse.success && eventsResponse.data.events) {
      eventRoutes = eventsResponse.data.events.map((event) => ({
        url: `${baseUrl}/events/${event.slug || event.id}`,
        lastModified: new Date(
          event.updated_at || event.created_at || new Date(),
        ),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error("Failed to generate events sitemap:", error);
  }

  return [...routes, ...blogRoutes, ...eventRoutes];
}
