import { useData } from "@/context/data-context";
import { Department, Position } from "@/context/data-context";
import { Category } from "@/lib/types";

/**
 * Hook to get positions, departments, and categories data
 * This data is now fetched server-side and available immediately
 */
export function useServerData() {
  const {
    positions,
    positionsLoading,
    positionsError,
    departments,
    departmentsLoading,
    departmentsError,
    categories,
    categoriesLoading,
    categoriesError,
    refreshPositions,
    refreshDepartments,
    refreshCategories,
  } = useData();

  return {
    // Positions
    positions: positions || [],
    positionsLoading,
    positionsError,
    refreshPositions,

    // Departments
    departments: departments || [],
    departmentsLoading,
    departmentsError,
    refreshDepartments,

    // Categories
    categories: categories || [],
    categoriesLoading,
    categoriesError,
    refreshCategories,

    // Utility functions
    getPositionById: (id: string): Position | undefined =>
      positions?.find((pos) => pos.id === id),

    getDepartmentById: (id: string): Department | undefined =>
      departments?.find((dept) => dept.id === id),

    getPositionByName: (name: string): Position | undefined =>
      positions?.find((pos) => pos.name.toLowerCase() === name.toLowerCase()),

    getDepartmentByName: (name: string): Department | undefined =>
      departments?.find(
        (dept) => dept.name.toLowerCase() === name.toLowerCase()
      ),

    getCategoryById: (id: string | number): Category | undefined =>
      categories?.find((cat) => cat.id.toString() === id.toString()),

    getCategoryByText: (text: string): Category | undefined =>
      categories?.find((cat) => cat.text.toLowerCase() === text.toLowerCase()),

    // Check if data is available
    hasData: Boolean(
      positions?.length && departments?.length && categories?.length
    ),

    // Check if any loading is in progress
    isLoading: positionsLoading || departmentsLoading || categoriesLoading,

    // Check if there are any errors
    hasError: Boolean(positionsError || departmentsError || categoriesError),

    // Get all errors
    errors: [positionsError, departmentsError, categoriesError].filter(Boolean),
  };
}
