'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Search,
  Heart,
  Store,
  LogOut,
  IndianRupee,
  BarChart2,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

type NavItem = {
  href: string;
  icon: React.ElementType;
  label: string;
};

const navItems: NavItem[] = [
  { href: '/', icon: LayoutDashboard, label: 'Executive Dashboard' },
  { href: '/revenue', icon: IndianRupee, label: 'Revenue Intelligence' },
  // { href: '/agent-performance', icon: Users, label: 'Agent Performance' },
  { href: '/store-performance', icon: Store, label: 'Store Performance' },
  { href: '/customer-experience', icon: Heart, label: 'Customer Experience' },
  { href: '/operations', icon: BarChart2, label: 'Operations' },
  { href: '/call-explorer', icon: Search, label: 'Call Explorer' },
  { href: '/reports', icon: FileText, label: 'Reports' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-[100] flex h-screen flex-col bg-sidebar py-5 transition-all duration-300 ease-in-out border-r border-white/5",
        isHovered ? "w-72 shadow-[10px_0_30px_rgba(0,0,0,0.2)]" : "w-20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "mb-10 flex items-center gap-3 transition-all duration-300 overflow-hidden h-12",
        isHovered ? "px-5" : "justify-center px-0"
      )}>
        {/* Icon – always visible, bigger */}
        <div className="shrink-0 w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center overflow-hidden">
          <img
            src="/VoiceIQ_.svg"
            alt="VoiceIQ logo"
            className="w-11 h-11 object-contain brightness-0 invert"
          />
        </div>

        {/* Text – always in DOM, fades + slides with CSS transition for smoothness */}
        <span
          className="text-white font-black text-xl tracking-tight whitespace-nowrap transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            maxWidth: isHovered ? '160px' : '0px',
            overflow: 'hidden',
            transform: isHovered ? 'translateX(0)' : 'translateX(-6px)',
          }}
        >
          VoiceIQ
        </span>
      </div>

      <nav className="flex flex-col gap-1 flex-1 w-full overflow-y-auto px-0 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center h-12 transition-all duration-200 overflow-hidden relative mx-2 rounded-xl',
                isHovered ? 'px-4' : 'justify-center'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-bg"
                  className="absolute inset-0 bg-white/20 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                size={22}
                className={cn(
                  'shrink-0 transition-colors duration-200 relative z-10',
                  isActive ? 'text-white' : 'text-white/60 group-hover:text-white/90'
                )}
              />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className={cn(
                      "ml-4 whitespace-nowrap text-[15px] font-medium relative z-10",
                      isActive ? "text-white" : "text-white/70 group-hover:text-white"
                    )}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button Section */}
      <div className="mt-auto px-2">
        <button
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            // Clear the auth cookie using negative max-age
            document.cookie = "isAuthenticated=; path=/; max-age=-1";
            router.push('/login');
          }}
          className={cn(
            'group flex items-center w-full h-12 transition-all duration-200 overflow-hidden relative rounded-xl hover:bg-white/10 text-white/60 hover:text-white',
            isHovered ? 'px-4' : 'justify-center'
          )}
        >
          <LogOut size={22} className="shrink-0 transition-colors duration-200" />
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-4 whitespace-nowrap text-[15px] font-medium"
              >
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </aside>
  );
}
