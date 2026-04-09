/**
 * Calculates percentage trend between the first and last values in a data array.
 * Returns a positive number for upward trend, negative for downward.
 */
export function calculateTrend(data?: number[]): number {
  if (!data || data.length < 2) return 0;
  const first = data[0];
  const last = data[data.length - 1];
  if (first === 0) return last > 0 ? 100 : 0;
  return Math.round(((last - first) / Math.abs(first)) * 100);
}
