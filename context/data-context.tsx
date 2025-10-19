"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { MyBlogPost } from "@/lib/types/blogs.types";
import useAxios from "@/hooks/use-axios";
import { CandidateProfile } from "@/lib/types/profile.types";
import { Category } from "@/lib/types";

export interface Department {
  id: string;
  name: string;
  acronym: string;
}

export interface Panel {
  id: string;
  name: string;
  logo?: string;
  banner?: string;
  mission?: string;
  vision?: string;
}

// Types for site data
export interface Position {
  id: string;
  name: string;
  order?: number;
  allocated_slots?: number;
}

interface DataContextType {
  positions: Position[] | null;
  positionsLoading: boolean;
  positionsError: string | null;
  refreshPositions: () => Promise<void>;

  departments: Department[] | null;
  departmentsLoading: boolean;
  departmentsError: string | null;
  refreshDepartments: () => Promise<void>;

  panels: Panel[] | null;
  panelsLoading: boolean;
  panelsError: string | null;
  refreshPanels: () => Promise<void>;

  categories: Category[] | null;
  categoriesLoading: boolean;
  categoriesError: string | null;
  refreshCategories: () => Promise<void>;

  blogs: MyBlogPost[] | null;
  blogsLoading: boolean;
  blogsError: string | null;
  refreshBlogs: () => Promise<void>;
  setBlogs: React.Dispatch<React.SetStateAction<MyBlogPost[] | null>>;

  candidateProfile: CandidateProfile | null;
  candidateProfileLoading: boolean;
  candidateProfileError: string | null;
  refreshCandidateProfile: () => Promise<void>;
}

interface DataProviderProps {
  children: ReactNode;
  initialPositions?: Position[] | null;
  initialDepartments?: Department[] | null;
  initialPanels?: Panel[] | null;
  initialCategories?: Category[] | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({
  children,
  initialPositions = null,
  initialDepartments = null,
  initialPanels = null,
  initialCategories = null,
}: DataProviderProps) {
  const { loading: authLoading, accessToken } = useAuth();
  const axios = useAxios();

  // Positions state - initialize with server data if available
  const [positions, setPositions] = useState<Position[] | null>(
    initialPositions
  );
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState<string | null>(null);

  // Departments state - initialize with server data if available
  const [departments, setDepartments] = useState<Department[] | null>(
    initialDepartments
  );
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  // Panels state - initialize with server data if available
  const [panels, setPanels] = useState<Panel[] | null>(initialPanels);
  const [panelsLoading, setPanelsLoading] = useState(false);
  const [panelsError, setPanelsError] = useState<string | null>(null);

  // Categories state - initialize with server data if available
  const [categories, setCategories] = useState<Category[] | null>(
    initialCategories
  );
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // my blogs state
  const [blogs, setBlogs] = useState<MyBlogPost[] | null>(null);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<string | null>(null);

  // my-candidate profile state
  const [candidateProfile, setCandidateProfile] =
    useState<CandidateProfile | null>(null);
  const [candidateProfileLoading, setCandidateProfileLoading] = useState(false);
  const [candidateProfileError, setCandidateProfileError] = useState<
    string | null
  >(null);

  // Fetch positions
  const fetchPositions = useCallback(async () => {
    setPositionsLoading(true);
    setPositionsError(null);
    try {
      const res = await fetch("/api/positions");
      const data = await res.json();
      setPositions(data);
    } catch (error) {
      console.error("Error fetching positions:", error);
      setPositionsError("Error fetching positions");
    } finally {
      setPositionsLoading(false);
    }
  }, []);

  const refreshPositions = useCallback(async () => {
    await fetchPositions();
  }, [fetchPositions]); // Fetch departments
  const fetchDepartments = useCallback(async () => {
    setDepartmentsLoading(true);
    setDepartmentsError(null);
    try {
      const res = await fetch("/api/departments");
      const data = await res.json();
      if (res.ok) {
        setDepartments(data);
      } else {
        setDepartmentsError(data.message || "Failed to fetch departments");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      setDepartmentsError("Error fetching departments");
    } finally {
      setDepartmentsLoading(false);
    }
  }, []);

  const refreshDepartments = useCallback(async () => {
    await fetchDepartments();
  }, [fetchDepartments]);

  // Fetch panels
  const fetchPanels = useCallback(async () => {
    setPanelsLoading(true);
    setPanelsError(null);
    try {
      const res = await fetch("/api/panel");
      const data = await res.json();
      if (res.ok) {
        setPanels(data);
      } else {
        setPanelsError(data.message || "Failed to fetch panels");
      }
    } catch (error) {
      console.error("Error fetching panels:", error);
      setPanelsError("Error fetching panels");
    } finally {
      setPanelsLoading(false);
    }
  }, []);

  const refreshPanels = useCallback(async () => {
    await fetchPanels();
  }, [fetchPanels]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (res.ok) {
        setCategories(data);
      } else {
        setCategoriesError(data.message || "Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategoriesError("Error fetching categories");
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const refreshCategories = useCallback(async () => {
    await fetchCategories();
  }, [fetchCategories]);

  // Fetch blogs
  const fetchBlogs = useCallback(async () => {
    setBlogsLoading(true);
    setBlogsError(null);
    try {
      const res = await axios.get("/api/blog/my-blog");
      const data = await res.data;
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogsError("Error fetching blogs");
    } finally {
      setBlogsLoading(false);
    }
  }, [axios]);

  const refreshBlogs = useCallback(async () => {
    await fetchBlogs();
  }, [fetchBlogs]);

  // Fetch candidate profile
  const fetchCandidateProfile = useCallback(async () => {
    if (!accessToken) return;
    setCandidateProfileLoading(true);
    setCandidateProfileError(null);
    try {
      const res = await axios.get("/api/profile/candidate");
      const data = await res.data;
      setCandidateProfile(data);
    } catch (error: unknown) {
      console.error("Error fetching candidate profile:", error);
      // If it's a 404 (not found), set profile to null but don't treat it as an error
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      if (err.response?.status === 404) {
        setCandidateProfile(null);
        setCandidateProfileError(null);
      } else {
        setCandidateProfileError(
          err.response?.data?.message || "Error fetching candidate profile"
        );
      }
    } finally {
      setCandidateProfileLoading(false);
    }
  }, [accessToken, axios]);

  const refreshCandidateProfile = useCallback(async () => {
    await fetchCandidateProfile();
  }, [fetchCandidateProfile]);

  useEffect(() => {
    if (!authLoading) {
      // Only fetch client-side if we don't have initial server-side data
      if (!positions || positions.length === 0) {
        fetchPositions();
      }
      if (!departments || departments.length === 0) {
        fetchDepartments();
      }
      if (!panels || panels.length === 0) {
        fetchPanels();
      }
      if (!categories || categories.length === 0) {
        fetchCategories();
      }
    }
  }, [
    authLoading,
    positions,
    departments,
    panels,
    categories,
    fetchPositions,
    fetchDepartments,
    fetchPanels,
    fetchCategories,
  ]);

  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchBlogs();
      fetchCandidateProfile();
    } else if (!authLoading && !accessToken) {
      // Clear the data when user is not authenticated
      setBlogs(null);
      setCandidateProfile(null);
    }
  }, [authLoading, accessToken, fetchBlogs, fetchCandidateProfile]);

  const values: DataContextType = {
    positions,
    positionsLoading,
    positionsError,
    refreshPositions,
    departments,
    departmentsLoading,
    departmentsError,
    refreshDepartments,
    panels,
    panelsLoading,
    panelsError,
    refreshPanels,
    categories,
    categoriesLoading,
    categoriesError,
    refreshCategories,
    blogs,
    blogsLoading,
    blogsError,
    refreshBlogs,
    setBlogs,
    candidateProfile,
    candidateProfileLoading,
    candidateProfileError,
    refreshCandidateProfile,
  };

  return <DataContext.Provider value={values}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
