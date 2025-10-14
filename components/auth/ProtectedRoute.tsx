"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import AuthLoadingSkeleton from "@/components/shared/AuthLoadingSkeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo,
}: ProtectedRouteProps) {
  const { isAuthenticated, loading: isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login with return URL
      const returnUrl = encodeURIComponent(pathname);
      const loginUrl = redirectTo
        ? redirectTo
        : `/auth/login?returnTo=${returnUrl}`;
      router.push(loginUrl);
    }
  }, [isLoading, isAuthenticated, router, pathname, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <AuthLoadingSkeleton />;
  }

  // Don't render children if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
