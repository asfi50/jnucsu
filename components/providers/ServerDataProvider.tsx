"use client";

import { DataProvider } from "@/context/data-context";
import { ReactNode } from "react";
import { Department, Position, Panel } from "@/context/data-context";
import { Category } from "@/lib/types";

interface ServerDataProviderProps {
  children: ReactNode;
  initialPositions: Position[] | null;
  initialDepartments: Department[] | null;
  initialCategories: Category[] | null;
  initialPanels: Panel[] | null;
}

/**
 * Client wrapper component that receives server-side data and passes it to DataProvider
 */
export function ServerDataProvider({
  children,
  initialPositions,
  initialDepartments,
  initialCategories,
  initialPanels,
}: ServerDataProviderProps) {
  return (
    <DataProvider
      initialPositions={initialPositions}
      initialDepartments={initialDepartments}
      initialCategories={initialCategories}
      initialPanels={initialPanels}
    >
      {children}
    </DataProvider>
  );
}
