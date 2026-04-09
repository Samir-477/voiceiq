import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return num.toLocaleString('en-IN');
  return num.toString();
}

export function getHeatmapClass(value: number): string {
  if (value <= 15) return 'heatmap-low';
  if (value <= 30) return 'heatmap-medium';
  if (value <= 50) return 'heatmap-high';
  if (value <= 75) return 'heatmap-critical';
  return 'heatmap-extreme';
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'text-emerald-700 bg-emerald-50';
  if (score >= 80) return 'text-amber-700 bg-amber-50';
  return 'text-red-700 bg-red-50';
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
