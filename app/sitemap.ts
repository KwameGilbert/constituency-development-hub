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

  // Sitemap generation must not hang the build if the API is slow/unreachable -
  // race each call against a short timeout instead of relying on apiClient's 60s default.
  const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
    Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms),
      ),
    ]);

  const [blogResult, eventsResult] = await Promise.allSettled([
    withTimeout(blogService.getAllPosts(1, 100), 8000),
    withTimeout(eventsService.getAllEvents(1, 100), 8000),
  ]);

  // Dynamic Blog Posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  if (blogResult.status === "fulfilled") {
    const blogResponse = blogResult.value;
    if (blogResponse && blogResponse.success && blogResponse.data?.posts) {
      blogRoutes = blogResponse.data.posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(
          post.published_at || post.created_at || new Date(),
        ),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } else {
    console.error("Failed to generate blog sitemap:", blogResult.reason);
  }

  // Dynamic Events
  let eventRoutes: MetadataRoute.Sitemap = [];
  if (eventsResult.status === "fulfilled") {
    const eventsResponse = eventsResult.value;
    if (eventsResponse && eventsResponse.success && eventsResponse.data?.events) {
      eventRoutes = eventsResponse.data.events.map((event) => ({
        url: `${baseUrl}/events/${event.slug || event.id}`,
        lastModified: new Date(
          event.updated_at || event.created_at || new Date(),
        ),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
    }
  } else {
    console.error("Failed to generate events sitemap:", eventsResult.reason);
  }

  return [...routes, ...blogRoutes, ...eventRoutes];
}
