"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function OAuthHandler() {
  const { setAccessToken, setUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      // Check for OAuth response parameters from Directus
      const accessToken = searchParams.get("access_token");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        console.error("OAuth error:", errorParam);
        // Clean up URL parameters without showing error to user
        const url = new URL(window.location.href);
        url.searchParams.delete("error");
        url.searchParams.delete("error_description");
        window.history.replaceState({}, document.title, url.toString());
        return;
      }

      if (accessToken) {
        try {
          // Fetch user info with the access token
          const userRes = await fetch("/api/profile/me", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (userRes.ok) {
            const userData = await userRes.json();

            // Successfully authenticated
            setAccessToken(accessToken);
            setUser({
              id: userData.id,
              image: userData.image,
              profileId: userData.profileId,
            });

            // Clean up URL parameters
            const url = new URL(window.location.href);
            url.searchParams.delete("access_token");
            url.searchParams.delete("refresh_token");
            url.searchParams.delete("expires");
            url.searchParams.delete("expires_at");
            window.history.replaceState({}, document.title, url.toString());

            // Redirect to intended page if stored
            const redirectTo = localStorage.getItem("google_auth_redirect");
            if (redirectTo && redirectTo !== "/") {
              localStorage.removeItem("google_auth_redirect");
              router.push(redirectTo);
            }
          } else {
            console.error("Failed to fetch user profile");
            // Clean up URL parameters
            const url = new URL(window.location.href);
            url.searchParams.delete("access_token");
            url.searchParams.delete("refresh_token");
            url.searchParams.delete("expires");
            url.searchParams.delete("expires_at");
            window.history.replaceState({}, document.title, url.toString());
          }
        } catch (error) {
          console.error("OAuth callback error:", error);
          // Clean up URL parameters on error
          const url = new URL(window.location.href);
          url.searchParams.delete("access_token");
          url.searchParams.delete("refresh_token");
          url.searchParams.delete("expires");
          url.searchParams.delete("expires_at");
          window.history.replaceState({}, document.title, url.toString());
        }
      }
    };

    handleOAuthCallback();
  }, [searchParams, setAccessToken, setUser, router]);

  // This component doesn't render anything
  return null;
}
