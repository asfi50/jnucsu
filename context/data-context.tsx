"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { MyBlogPost } from "@/lib/types/blogs.types";
import useAxios from "@/hooks/use-axios";

export interface Department {
  id: string;
  name: string;
  acronym: string;
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

  blogs: MyBlogPost[] | null;
  blogsLoading: boolean;
  blogsError: string | null;
  refreshBlogs: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { loading: authLoading, accessToken } = useAuth();
  const axios = useAxios();

  // Positions state
  const [positions, setPositions] = useState<Position[] | null>(null);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState<string | null>(null);

  // Departments state
  const [departments, setDepartments] = useState<Department[] | null>(null);
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [departmentsError, setDepartmentsError] = useState<string | null>(null);

  // my blogs state
  const [blogs, setBlogs] = useState<MyBlogPost[] | null>(null);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<string | null>(null);

  // Fetch positions
  const fetchPositions = async () => {
    setPositionsLoading(true);
    setPositionsError(null);
    try {
      const res = await fetch("/api/positions");
      const data = await res.json();
      if (res.ok) {
        setPositions(data);
      } else {
        setPositionsError(data.message || "Failed to fetch positions");
      }
    } catch (error) {
      console.error("Error fetching positions:", error);
      setPositionsError("Error fetching positions");
    } finally {
      setPositionsLoading(false);
    }
  };

  const refreshPositions = async () => {
    await fetchPositions();
  };

  // Fetch departments
  const fetchDepartments = async () => {
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
  };

  const refreshDepartments = async () => {
    await fetchDepartments();
  };

  // Fetch blogs
  const fetchBlogs = async () => {
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
  };

  const refreshBlogs = async () => {
    await fetchBlogs();
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPositions();
      fetchDepartments();
    }
  }, [authLoading]);

  useEffect(() => {
    if (!authLoading && accessToken) {
      fetchBlogs();
    }
  }, [authLoading]);

  const values: DataContextType = {
    positions,
    positionsLoading,
    positionsError,
    refreshPositions,
    departments,
    departmentsLoading,
    departmentsError,
    refreshDepartments,
    blogs,
    blogsLoading,
    blogsError,
    refreshBlogs,
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
