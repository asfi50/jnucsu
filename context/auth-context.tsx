"use client";

import LoadingSpinner from "@/components/shared/loading-spinner";
import { UserProfile } from "@/lib/types/profile.types";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  image?: string;
  profileId?: string;
}

export interface Department {
  id: string;
  name: string;
  acronym: string;
}

interface AuthContextType {
  accessToken: string | null;
  login: (
    email: string,
    password: string,
    isRememberMe: boolean,
    recaptchaToken?: string
  ) => Promise<boolean>;
  register: (
    fullName: string,
    email: string,
    password: string,
    recaptchaToken?: string
  ) => Promise<boolean>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  loginLoading: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start with true for initial load
  const [loginLoading, setLoginLoading] = useState(false); // Separate loading state for login actions

  const router = useRouter();

  // Validate token by checking iat/exp
  const validateToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode(token);
      if (!decoded) return false;
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp > now) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token validation error:", error);
      return false;
    }
  };

  // Load token and user from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;
        const userData =
          typeof window !== "undefined" ? localStorage.getItem("user") : null;

        if (token && userData) {
          // Validate the token before setting as authenticated
          const isValidToken = validateToken(token);
          if (isValidToken) {
            setAccessToken(token);
            setUser(JSON.parse(userData));
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear stored data
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            setAccessToken(null);
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Save token and user to localStorage
  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
    } else {
      localStorage.removeItem("access_token");
    }
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [accessToken, user]);

  // Fetch user profile when user or accessToken changes
  useEffect(() => {
    if (accessToken && user) {
      const fetchUserProfile = async () => {
        try {
          const res = await fetch("/api/profile/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const data = await res.json();
          if (res.ok) {
            setUserProfile(data);
          } else {
            console.error("Failed to fetch user profile:", data.message);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      fetchUserProfile();
    }
  }, [user, accessToken]);

  // Login function
  const login = async (
    email: string,
    password: string,
    isRememberMe: boolean,
    recaptchaToken?: string
  ): Promise<boolean> => {
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isRememberMe, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsAuthenticated(false);
        return false;
      }
      setAccessToken(data.data.access_token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoginLoading(false);
    }
  };

  // Register function
  const register = async (
    fullName: string,
    email: string,
    password: string,
    recaptchaToken?: string
  ): Promise<boolean> => {
    setLoginLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password, recaptchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setIsAuthenticated(false);
        return false;
      }
      setAccessToken(data.data.access_token);
      setUser(data.data.user);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoginLoading(false);
    }
  };

  // Google Sign-In function
  const signInWithGoogle = async (): Promise<void> => {
    try {
      // Store the current page as redirect target
      localStorage.setItem("google_auth_redirect", window.location.pathname);

      // Use our API route to handle the redirect
      window.location.href = `/api/auth/google?redirect=${encodeURIComponent(
        window.location.origin
      )}`;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await res.json();
      return res.ok;
    } catch (error) {
      console.error("Reset password error:", error);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  const values = {
    user,
    setUser,
    accessToken,
    setAccessToken,
    login,
    register,
    signInWithGoogle,
    resetPassword,
    logout,
    loading,
    loginLoading,
    isAuthenticated,
    setIsAuthenticated,
    userProfile,
    setUserProfile,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
