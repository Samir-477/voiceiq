import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildQueryString(filters: object): string {
  const params = new URLSearchParams();
  const mapping: Record<string, string> = {
    stateName: 'state',
    cityName:  'city',
    areaName:  'area',
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (value && !value.toString().startsWith('All ')) {
      const paramKey = mapping[key] || key;
      params.append(paramKey, value.toString());
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}
