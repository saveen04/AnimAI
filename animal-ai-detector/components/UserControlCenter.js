'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LogOut, 
  Settings, 
  User, 
  ChevronDown,
  ShieldCheck,
  Power
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import ProfileIcon from '@/components/ProfileIcon';

export default function UserControlCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (loading || !user) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="fixed top-6 right-8 z-[100]">
      <div className="relative">
        {/* Main Trigger Pill */}
        <motion.div 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 p-1.5 pr-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 cursor-pointer transition-all hover:bg-black/60 hover:border-indigo-500/30 group ${isOpen ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10' : ''}`}
        >
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-indigo-600/10 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <ProfileIcon className="w-6 h-6 text-indigo-400" />
            )}
          </div>
          
          <div className="hidden sm:block">
            <p className="text-[10px] font-black text-white uppercase italic tracking-tighter leading-none mb-1">{user.name || 'Explorer'}</p>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest leading-none">Security Multi-Pass</p>
          </div>

          <ChevronDown 
            size={14} 
            className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </motion.div>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-[-1]"
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full right-0 mt-3 w-64 rounded-3xl bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden"
              >
                <div className="p-4 border-b border-white/5 bg-white/5">
                  <div className="flex items-center gap-3 mb-1">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Verified Identity</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium truncate">{user.email}</p>
                </div>

                <div className="p-2">
                  <Link 
                    href="/settings"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${pathname === '/settings' ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <Settings size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">Security Settings</span>
                  </Link>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all group"
                  >
                    <Power size={18} className="group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold uppercase tracking-widest">Terminate Session</span>
                  </button>
                </div>

                <div className="p-4 bg-indigo-500/5 text-center">
                  <p className="text-[8px] font-black text-indigo-400/50 uppercase tracking-[0.3em]">Access Level: Researcher</p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
