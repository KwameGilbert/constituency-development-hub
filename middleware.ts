import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("authToken")?.value;
  const { pathname } = request.nextUrl;

  // Paths that require authentication
  const protectedPaths = [
    "/admin-dashboard",
    "/web-admin-dashboard",
    "/officer-dashboard",
    "/agents-dashboard",
    "/task-force-dashboard",
  ];

  // Check if the current path starts with any of the protected paths
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path),
  );

  if (isProtectedPath) {
    // If no token at all, redirect to login
    // Role-based checks are handled by ProtectedRoute on the client
    if (!authToken) {
      console.log("Middleware: No auth token, redirecting to login");
      const url = new URL("/login", request.url);
      url.searchParams.set("returnUrl", encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    console.log("Middleware: Token found, allowing access");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public folder)
     * - login
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|public).*)",
  ],
};
