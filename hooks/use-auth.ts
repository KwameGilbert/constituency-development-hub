"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService, UserRole, ROLES, User } from "@/lib/services/auth-service";

interface UseAuthOptions {
  requiredRole?: UserRole | UserRole[];
  redirectTo?: string;
}

export function useAuth(options: UseAuthOptions = {}) {
  const { requiredRole, redirectTo = "/login" } = options;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      const token = authService.getToken();

      if (!token || !currentUser) {
        setIsAuthenticated(false);
        setIsLoading(false);
        router.push(redirectTo);
        return;
      }

      // Check role if required
      if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!allowedRoles.includes(currentUser.role)) {
          // User doesn't have the required role - redirect to their correct dashboard
          const correctDashboard = authService.getDashboardForRole(currentUser.role);
          router.push(correctDashboard);
          return;
        }
      }

      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredRole, redirectTo, router]);

  return {
    user,
    isLoading,
    isAuthenticated,
    logout: () => {
      authService.logout();
      router.push("/login");
    },
  };
}

export { ROLES };
