"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/shared/loading-spinner";

export default function GoogleCallbackPage() {
  const { setAccessToken, setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        // Check for Directus OAuth response parameters
        const accessToken = searchParams.get("access_token");
        const errorParam = searchParams.get("error");

        if (errorParam) {
          console.error("Google OAuth error:", errorParam);
          setError("Google authentication failed. Please try again.");
          setTimeout(() => router.push("/auth/login"), 3000);
          return;
        }

        if (!accessToken) {
          setError("No access token received from Google authentication.");
          setTimeout(() => router.push("/auth/login"), 3000);
          return;
        }

        // Fetch user info with the access token
        const userRes = await fetch("/api/profile/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!userRes.ok) {
          console.error("Failed to fetch user profile");
          setError("Failed to retrieve user information. Please try again.");
          setTimeout(() => router.push("/auth/login"), 3000);
          return;
        }

        const userData = await userRes.json();

        // Successfully authenticated
        setAccessToken(accessToken);
        setUser({
          id: userData.id,
          image: userData.image,
          profileId: userData.profileId,
        });

        // Redirect to dashboard or intended page
        const redirectTo = localStorage.getItem("google_auth_redirect") || "/";
        localStorage.removeItem("google_auth_redirect");
        router.push(redirectTo);
      } catch (error) {
        console.error("Google callback error:", error);
        setError("An error occurred during authentication. Please try again.");
        setTimeout(() => router.push("/auth/login"), 3000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, setAccessToken, setUser, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">{error}</div>
          <div className="text-gray-500">Redirecting to login page...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner />
        <div className="mt-4 text-gray-600">Completing Google sign-in...</div>
      </div>
    </div>
  );
}
