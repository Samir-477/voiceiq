import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merges Tailwind class names safely. Used by UI components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
