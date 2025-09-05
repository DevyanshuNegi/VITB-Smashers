"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthError {
  message?: string;
  code?: string;
}

interface UseAuthErrorHandlerOptions {
  redirectOnError?: boolean;
  showAlert?: boolean;
}

export function useAuthErrorHandler(options: UseAuthErrorHandlerOptions = {}) {
  const { status } = useSession();
  const router = useRouter();
  const { redirectOnError = true, showAlert = false } = options;

  const handleAuthError = (error: AuthError) => {
    const isAuthError = !!(error?.message?.includes("UNAUTHORIZED") ||
                          error?.message?.includes("must be signed in") ||
                          error?.code === "UNAUTHORIZED");

    if (isAuthError) {
      if (showAlert) {
        alert("Please sign in to access this content.");
      }
      
      if (redirectOnError) {
        router.push("/api/auth/signin");
      }
      
      return true; // Indicates this was an auth error
    }
    
    return false; // Not an auth error
  };

  useEffect(() => {
    if (status === "unauthenticated" && redirectOnError) {
      router.push("/api/auth/signin");
    }
  }, [status, redirectOnError, router]);

  return {
    handleAuthError,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    isUnauthenticated: status === "unauthenticated"
  };
}
