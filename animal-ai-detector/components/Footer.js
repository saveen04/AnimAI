'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isCenteredPage = pathname === '/login' || pathname === '/signup' || pathname === '/';

  return (
    <footer className="mt-auto border-t border-white/5 bg-black/10 backdrop-blur-md relative z-10 w-full transition-all duration-300">
      <div className={`w-full px-4 lg:px-8 py-6 flex items-center ${isCenteredPage ? 'flex-col justify-center gap-3' : 'flex-col md:flex-row justify-between gap-6 md:gap-12'}`}>
        {!isCenteredPage && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-black tracking-widest text-white uppercase italic">ANIMAI</span>
          </div>
        )}
        
        <div className="flex gap-8 text-sm font-semibold uppercase tracking-widest text-slate-400">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/dashboard" className="hover:text-white transition-colors">Explorer</Link>
          <Link href="/settings" className="hover:text-white transition-colors">Security</Link>
        </div>
        
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
          © {new Date().getFullYear()} ANIMAI Infrastructure
        </div>
      </div>
    </footer>
  );
}

