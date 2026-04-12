'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true only after the component has mounted on the client.
 * Use this to defer Recharts rendering (which needs DOM dimensions)
 * until after hydration is complete.
 */
export function useIsMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
