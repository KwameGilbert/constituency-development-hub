

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export async function apiClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  if (!BASE_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const headers = new Headers(fetchOptions.headers);

  // Only set Content-Type for requests with a body (POST, PUT, PATCH)
  const method = (fetchOptions.method || 'GET').toUpperCase();
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
  
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    // Try to get token from multiple sources
    let token: string | null = null;
    
    // 1. Try environment variable first
    const envToken = process.env.NEXT_PUBLIC_AUTH_TOKEN;
    if (envToken && envToken !== "YOUR_JWT_TOKEN_HERE") {
      token = envToken;
    }
    
    // 2. Fallback to localStorage (for client-side)
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  // Try to parse JSON response
  let data;
  try {
    data = await response.json();
  } catch {
    // If JSON parsing fails, throw with status info
    throw new Error(`HTTP ${response.status}: Failed to parse response`);
  }

  if (!response.ok) {
    // Log detailed error info for debugging
    console.error('API Error:', {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      responseData: data,
    });
    const errorMessage = data?.message || data?.error || `HTTP ${response.status}: An error occurred`;
    throw new Error(errorMessage);
  }

  return data;
}
