'use client';

import { LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    setLastUpdated(new Date().toLocaleTimeString());
    const timer = setInterval(() => {
      setLastUpdated(new Date().toLocaleTimeString());
    }, 60000);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 relative z-50">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">


        {/* Live System indicator */}
        <div className="hidden md:flex flex-col items-end pr-2">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live System</span>
          </div>
          {mounted && (
            <span className="text-[11px] text-muted-foreground font-bold tabular-nums">Updated: {lastUpdated}</span>
          )}
        </div>

        <div className="h-6 w-[1px] bg-border/60 hidden md:block" />

        {/* Profile Section with Logout */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl hover:bg-secondary/50 transition-all duration-200 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-xs font-black">VIQ</span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-black text-foreground leading-none">Admin</p>
              <p className="text-[10px] font-bold text-muted-foreground mt-1">Super Admin</p>
            </div>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-border/5 overflow-hidden p-2"
              >
                <div className="px-3 py-2.5 mb-1 border-b border-border/50">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Account Info</p>
                  <p className="text-xs font-bold text-foreground">admin@voiceiq.com</p>
                </div>

                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
                  <User size={16} />
                  My Profile
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors">
                  <Settings size={16} />
                  Settings
                </button>

                <div className="h-[1px] bg-border/50 my-2" />

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-black text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
