"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/lib/services/auth-service";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      // Use authService which reads directly from localStorage (no hydration delay)
      const token = authService.getToken();
      const user = authService.getCurrentUser();

      console.log(
        "ProtectedRoute check - Token:",
        !!token,
        "User:",
        user?.role,
      );

      // 1. Check if authenticated and token is valid
      if (!token || !user || authService.isTokenExpired(token)) {
        console.log(
          "Not authenticated or token expired, redirecting to login...",
        );

        // Clear any stale auth data
        authService.logout();

        const returnUrl = encodeURIComponent(pathname);
        router.push(`/login?returnUrl=${returnUrl}`);
        return;
      }

      // 2. Check role permissions if permitted roles are defined
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(user.role)) {
          console.log(
            `User role ${user.role} not allowed for ${allowedRoles.join(", ")}, redirecting to login...`,
          );

          // Clear auth so user can log in with correct account
          authService.logout();

          const returnUrl = encodeURIComponent(pathname);
          router.push(`/login?returnUrl=${returnUrl}`);
          return;
        }
      }

      // If we get here, user is authorized
      setIsAuthorized(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router, pathname, allowedRoles]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
