const BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
  isFormData?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {},
): Promise<T> {
  const { requiresAuth = true, isFormData = false, ...fetchOptions } = options;

  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const headers = new Headers(fetchOptions.headers);

  // Only set Content-Type for requests with a body (POST, PUT, PATCH)
  // Skip setting Content-Type for FormData (browser sets it with boundary)
  const method = (fetchOptions.method || "GET").toUpperCase();
  const hasBody = ["POST", "PUT", "PATCH"].includes(method);

  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    // Try to get token from multiple sources
    let token: string | null = null;

    // 1. Try localStorage (for client-side) - Prioritize this!
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("authToken");
      if (localToken) {
        token = localToken;
      }
    }

    // 2. Fallback to environment variable (for development/testing)
    if (!token) {
      const envToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
      if (envToken && envToken !== "YOUR_JWT_TOKEN_HERE") {
        token = envToken;
      }
    }

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  let response;
  try {
    // Debug: log request details to help diagnose network/CORS issues
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      try {
        // Clone headers for safe logging
        const headersObj: Record<string, string> = {};
        headers.forEach((v, k) => (headersObj[k] = v));
        // eslint-disable-next-line no-console
        console.debug("[API Network Request]", {
          method,
          url: `${BASE_URL}${endpoint}`,
          headers: headersObj,
          requiresAuth,
        });
      } catch (e) {
        // ignore logging errors
      }
    }
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[API Network Error] ${method} ${BASE_URL}${endpoint}`,
        error,
      );
    }
    throw new Error(
      `Network error: Failed to connect to API at ${BASE_URL}${endpoint}`,
    );
  }

  // Try to parse JSON response
  let data;
  try {
    data = await response.json();
  } catch {
    // If JSON parsing fails, throw with status info
    throw new Error(`HTTP ${response.status}: Failed to parse response`);
  }

  if (!response.ok) {
    // Handle 401 Unauthorized globally
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      // Optional: Redirect to login if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login?expired=true";
      }
    }

    // Only log detailed errors in development for debugging
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "[API]",
        response.status,
        endpoint,
        data?.message || data?.error || "",
      );
    }
    const errorMessage =
      data?.message ||
      data?.error ||
      `HTTP ${response.status}: An error occurred`;
    throw new Error(errorMessage);
  }

  return data;
}
