"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

interface TRPCError {
  message?: string;
  code?: string;
}

interface TRPCErrorHandlerProps {
  error: TRPCError;
  retry: () => void;
  children?: React.ReactNode;
}

export function TRPCErrorHandler({ error, retry, children }: TRPCErrorHandlerProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  // Check if this is an authentication error
  const isAuthError = error?.message?.includes("UNAUTHORIZED") ||
                      error?.message?.includes("must be signed in") ||
                      error?.code === "UNAUTHORIZED";

  const handleRetry = () => {
    setIsRetrying(true);
    try {
      retry();
    } finally {
      setIsRetrying(false);
    }
  };

  if (isAuthError) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Authentication Required</h3>
        <p className="text-gray-600 mb-4">You need to sign in to access this content.</p>
        <div className="space-y-2">
          <button
            onClick={() => signIn()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Sign In
          </button>
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium disabled:opacity-50"
          >
            {isRetrying ? "Retrying..." : "Try Again"}
          </button>
        </div>
      </div>
    );
  }

  // For other errors, show a generic error UI
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
      <p className="text-gray-600 mb-4">{error?.message ?? "An unexpected error occurred. Please try again."}</p>
      <button
        onClick={handleRetry}
        disabled={isRetrying}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
      >
        {isRetrying ? "Retrying..." : "Try Again"}
      </button>
      {children}
    </div>
  );
}
