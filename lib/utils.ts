import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("data:")) return path;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  let apiOrigin = "";
  try {
    apiOrigin = new URL(apiUrl).origin;
  } catch {
    return path;
  }

  // Handle absolute URLs
  if (path.startsWith("http")) {
    // If the path contains /uploads/, we force it to use the current API origin
    // This fixes issues where the DB has localhost/IP URLs but we're on a different domain
    if (path.includes("/uploads/")) {
      const relativePath = path.substring(path.indexOf("/uploads/"));
      return `${apiOrigin}${relativePath}`;
    }
    return path;
  }

  // Handle relative paths
  // Ensure we don't have double slashes
  return `${apiOrigin}/${path.replace(/^\/+/, "")}`;
}

export function cleanupHtml(html: string): string {
  if (!html) return "";
  if (typeof window !== "undefined") {
    // Use DOMParser to handle potentially escaped HTML entities
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || "";
    // If the text still contains HTML tags (was escaped), strip them
    return text.replace(/<[^>]*>/g, "");
  }
  // Fallback for server-side rendering: decode common HTML entities then strip tags
  const decodeEntities = (str: string) => {
    return str
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  };

  const decoded = decodeEntities(html);
  return decoded.replace(/<[^>]*>/g, "");
}

// Sanitize HTML for safe rendering in the client. Uses isomorphic-dompurify
// which works on both server and client environments.
import DOMPurify from "isomorphic-dompurify";

function decodeEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

export function sanitizeHtml(html: string): string {
  if (!html) return "";
  try {
    const decoded = decodeEntities(html);
    // Allow a reasonable HTML profile (basic formatting)
    return DOMPurify.sanitize(decoded, { USE_PROFILES: { html: true } });
  } catch (err) {
    // On error, fallback to stripping tags
    return cleanupHtml(html);
  }
}
