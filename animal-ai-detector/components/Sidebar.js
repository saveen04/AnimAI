'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Binary, 
  FolderHeart, 
  Search, 
  Archive, 
  Info, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import ProfileIcon from '@/components/ProfileIcon';
import Logo from '@/components/Logo';

const menuItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/detection', label: 'Detection Hub', icon: Binary },
  { href: '/my-project', label: 'Project Hub', icon: FolderHeart },
  { href: '/deep-search', label: 'Deep Search', icon: Search },
  { href: '/history', label: 'Archive', icon: Archive },
  { href: '/about', label: 'About Engine', icon: Info },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={toggleMobile}
        className="lg:hidden fixed top-6 right-6 z-[60] p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 backdrop-blur-xl text-white shadow-2xl hover:bg-indigo-600/40 transition-all"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobile}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[50]"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? '72px' : '260px',
          x: isMobileOpen || !isCollapsed ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -260 : 0)
        }}
        style={{
          '--sidebar-width': isCollapsed ? '72px' : '260px'
        }}
        className={`fixed left-0 top-0 h-screen z-[55] bg-black/10 backdrop-blur-2xl border-r border-white/5 transition-all duration-300 ease-in-out flex flex-col overflow-x-hidden
          ${isMobileOpen ? 'translate-x-0 w-[260px]' : 'lg:translate-x-0 -translate-x-full lg:w-auto'}
        `}
      >
        <div className={`p-4 mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'px-6'}`}>
          <Link href="/" className={`flex items-center ${isCollapsed ? '' : 'gap-4'} group`}>
            <Logo className={isCollapsed ? 'w-12 h-12' : 'w-24 h-24'} />
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-black tracking-tighter text-white uppercase italic whitespace-nowrap"
              >
                ANIMAI
              </motion.span>
            )}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} space-y-2 overflow-y-auto overflow-x-hidden no-scrollbar`}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-4 px-4'} py-3 rounded-xl transition-all duration-300 group relative
                  ${isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  <Icon size={22} />
                </div>
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold text-sm tracking-tight uppercase tracking-widest whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
                
                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl z-[100]">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer Spacing */}
        <div className="p-4" />

        {/* Collapse Toggle */}
        <button 
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-indigo-600 border border-indigo-400/50 items-center justify-center text-white shadow-xl hover:scale-110 active:scale-90 transition-all z-[60]"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </motion.aside>
    </>
  );
}
