'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FilterOptions } from '@/types/api';

export interface Filters {
  start_date?: string;
  end_date?: string;
  stateName?: string;
  cityName?: string;
  gmbStoreCode?: string;
  intent?: string;
  sentiment?: string;
  issue_type?: string;
  category?: string;
  search?: string;
}

interface FiltersContextType {
  filters: Filters;
  filterOptions: FilterOptions | null;
  loadingOptions: boolean;
  setFilters: (updates: Partial<Filters>) => void;
  resetFilters: () => void;
}

const FiltersContext = createContext<FiltersContextType>({
  filters: {},
  filterOptions: null,
  loadingOptions: false,
  setFilters: () => {},
  resetFilters: () => {},
});

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_KEY  = process.env.NEXT_PUBLIC_X_API_KEY  || '';

export function FilterProvider({ children }: { children: ReactNode }) {
  const DEFAULT_START = '2026-02-01';
  const DEFAULT_END   = '2026-04-08';

  const [filters, setFiltersState] = useState<Filters>({
    start_date: DEFAULT_START,
    end_date: DEFAULT_END,
  });

  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(false);

  useEffect(() => {
    async function fetchFilterOptions() {
      setLoadingOptions(true);
      try {
        const res = await fetch(`${BASE_URL}/api/v1/insights/filters`, {
          headers: {
            'X-API-Key': API_KEY,
            'Content-Type': 'application/json',
          },
        });
        if (!res.ok) throw new Error('Failed to fetch filter options');
        const data = await res.json();
        // Handle both cases: data is an array or a single object
        const options = Array.isArray(data) ? data[0] : data;
        setFilterOptions(options);
      } catch (err) {
        console.error('Error fetching filter options:', err);
      } finally {
        setLoadingOptions(false);
      }
    }

    fetchFilterOptions();
  }, []);

  const setFilters = (updates: Partial<Filters>) =>
    setFiltersState((prev) => ({ ...prev, ...updates }));

  const resetFilters = () =>
    setFiltersState({ start_date: DEFAULT_START, end_date: DEFAULT_END });

  return (
    <FiltersContext.Provider value={{ filters, filterOptions, loadingOptions, setFilters, resetFilters }}>
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  return useContext(FiltersContext);
}
