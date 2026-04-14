'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  Users,
  Building2,
  Heart,
  Search,
  UserPlus,
  FileText,
  Settings,
  LogOut,
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
  { href: '/intent-analytics', icon: Target, label: 'Intent Analytics' },
  { href: '/agent-performance', icon: Users, label: 'Agent Performance' },
  { href: '/branch-performance', icon: Building2, label: 'Branch Performance' },
  { href: '/customer-experience', icon: Heart, label: 'Customer Experience' },
  { href: '/call-explorer', icon: Search, label: 'Call Explorer' },
  { href: '/lead-management', icon: UserPlus, label: 'Lead Management' },
  { href: '/reports', icon: FileText, label: 'Reports' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-[100] flex h-screen flex-col bg-sidebar py-5 transition-all duration-300 ease-in-out border-r border-white/5",
        isHovered ? "w-72 shadow-[10px_0_30px_rgba(0,0,0,0.3)]" : "w-20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo / Brand */}
      <div className={cn(
        "mb-8 flex items-center gap-3 transition-all duration-300 overflow-hidden h-14",
        isHovered ? "px-4" : "justify-center px-0"
      )}>
        {/* Chola logo icon */}
        <div className="shrink-0 w-12 h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden shadow-md">
          <img
            src="/chola-logo-C2yo71e8.png"
            alt="Chola logo"
            className="w-10 h-10 object-contain"
          />
        </div>

        {/* Brand text */}
        <div
          className="flex flex-col transition-all duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            maxWidth: isHovered ? '180px' : '0px',
            overflow: 'hidden',
            transform: isHovered ? 'translateX(0)' : 'translateX(-8px)',
          }}
        >
          <span className="text-white font-bold text-lg leading-tight whitespace-nowrap tracking-wide">
            Gold Loan
          </span>
          <span className="text-white/50 text-xs whitespace-nowrap font-normal tracking-wider">
            Voice Analytics
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-5 h-px bg-white/10" />

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
                  className="absolute inset-0 bg-[#e63946] rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-white/8 transition-opacity duration-200" />
              )}
              <Icon
                size={20}
                className={cn(
                  'shrink-0 transition-colors duration-200 relative z-10',
                  isActive ? 'text-white' : 'text-white/55 group-hover:text-white/90'
                )}
              />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2, delay: 0.05 }}
                    className={cn(
                      "ml-4 whitespace-nowrap text-[14px] font-medium relative z-10",
                      isActive ? "text-white font-semibold" : "text-white/65 group-hover:text-white"
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

      {/* Bottom section – email + sign out */}
      <div className="mt-auto px-2">
        {/* Divider */}
        <div className="mx-2 mb-4 h-px bg-white/10" />

        {/* Admin email */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="px-4 mb-2"
            >
              <p className="text-white/35 text-[11px] tracking-wide whitespace-nowrap">
                admin@chola.com
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign Out */}
        <button
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            router.push('/login');
          }}
          className={cn(
            'group flex items-center w-full h-12 transition-all duration-200 overflow-hidden relative rounded-xl hover:bg-white/10 text-white/55 hover:text-white',
            isHovered ? 'px-4' : 'justify-center'
          )}
        >
          <LogOut size={20} className="shrink-0 transition-colors duration-200" />
          <AnimatePresence>
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="ml-4 whitespace-nowrap text-[14px] font-medium"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </aside>
  );
}
