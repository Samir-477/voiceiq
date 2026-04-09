'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface Filters {
  start_date?: string;
  end_date?: string;
  region?: string;
  state?: string;
  city?: string;
  store?: string;
  search?: string;
}

interface FiltersContextType {
  filters: Filters;
  setFilters: (updates: Partial<Filters>) => void;
  resetFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType>({
  filters: {},
  setFilters: () => {},
  resetFilters: () => {},
});

export function FilterProvider({ children }: { children: ReactNode }) {
  const today = new Date().toISOString().slice(0, 10);
  const [filters, setFiltersState] = useState<Filters>({
    start_date: today,
    end_date: today,
  });

  const setFilters = (updates: Partial<Filters>) =>
    setFiltersState((prev) => ({ ...prev, ...updates }));

  const resetFilters = () =>
    setFiltersState({ start_date: today, end_date: today });

  return (
    <FiltersContext.Provider value={{ filters, setFilters, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
