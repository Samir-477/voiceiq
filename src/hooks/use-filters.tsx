'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FilterOptions } from '@/types/api';
import { fetchWithAuth } from '@/lib/api-client';

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
        const data = await fetchWithAuth('/api/v1/insights/filters');
        const options = Array.isArray(data) ? data[0] : data;
        setFilterOptions(options);
      } catch {
        // Filter options are non-critical — UI degrades gracefully with no dropdowns
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
