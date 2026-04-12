'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { cn } from '@/lib/utils';

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const isLoginPage = pathname === '/login';

  useEffect(() => {
    // Redirection is now handled by middleware.ts on the server side.
    // We only need to set isReady to true here to let the client component render.
    setIsReady(true);
  }, [pathname]);

  if (!isReady) {
    return null; // Or a loading spinner
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-20 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
