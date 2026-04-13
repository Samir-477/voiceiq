'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Hardcoded credentials logic
    setTimeout(() => {
      if (email === 'admin@voiceiq.com' && password === 'admin123') {
        localStorage.setItem('isAuthenticated', 'true');
        // Set cookie for middleware access (expires in 7 days)
        document.cookie = "isAuthenticated=true; path=/; max-age=" + (7 * 24 * 60 * 60);
        
        toast.success('Successfully logged in!');
        router.push('/');
      } else {
        toast.error('Invalid credentials');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] relative overflow-hidden font-sans">
      {/* Abstract Background Design Element */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#b91c1c]/[0.03] rounded-full -mr-64 -mt-64 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-600/[0.04] rounded-full -ml-32 -mb-32 blur-3xl" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md px-8 relative z-10"
      >
        <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] backdrop-blur-sm">
          {/* Logo Heading */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-3"
            >
              <Image src="/VoiceIQ_.svg" alt="VoiceIQ" width={112} height={56} className="h-14 w-auto object-contain" priority />
            </motion.div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Call Analytics</h1>
            <p className="text-slate-500 text-sm mt-2 font-medium">Please sign in to your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#b91c1c] transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@voiceiq.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/10 focus:border-[#b91c1c] transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#b91c1c] transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50/50 border border-slate-200/80 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#b91c1c]/10 focus:border-[#b91c1c] transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#b91c1c] hover:bg-[#a11818] text-white font-bold py-4 rounded-2xl transition-all shadow-[0_8px_20px_-5px_rgba(185,28,28,0.3)] hover:shadow-[0_12px_24px_-5px_rgba(185,28,28,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center gap-2 group overflow-hidden relative"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Logging in...</span>
                </div>
              ) : (
                <>
                  <span className="relative z-10">Sign In</span>
                  <LogIn size={20} className="relative z-10 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs text-slate-400 font-medium tracking-tight">
              &copy; 2026 VoiceIQ. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
