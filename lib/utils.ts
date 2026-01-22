import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
