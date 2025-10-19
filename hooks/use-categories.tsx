"use client";

import { useData } from "@/context/data-context";
import { Category } from "@/lib/types";

interface UseCategoriesReturn {
  categories: Category[] | null;
  categoriesLoading: boolean;
  categoriesError: string | null;
  refreshCategories: () => Promise<void>;
}

/**
 * Custom hook to access categories data from DataContext
 * @returns Categories data, loading state, error state, and refresh function
 */
export function useCategories(): UseCategoriesReturn {
  const { categories, categoriesLoading, categoriesError, refreshCategories } =
    useData();

  return {
    categories,
    categoriesLoading,
    categoriesError,
    refreshCategories,
  };
}
