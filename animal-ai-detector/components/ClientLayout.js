'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import UserControlCenter from '@/components/UserControlCenter';
import AnimatedBackground from '@/components/AnimatedBackground';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/signup';

  return (
    <div className="flex h-screen overflow-hidden">
      {!isPublicPage && <Sidebar />}
      {!isPublicPage && <UserControlCenter />}
      
      <div className={`flex-1 flex flex-col relative overflow-y-auto no-scrollbar transition-all duration-300 ${!isPublicPage ? 'lg:pl-[var(--sidebar-width,260px)]' : ''}`}>
        <AnimatedBackground />
        
        <main className={`flex-1 w-full relative z-10 ${isPublicPage ? 'p-0' : 'p-6 lg:p-12'}`}>
          <div className={`${isPublicPage ? 'max-w-full' : 'max-w-6xl mx-auto'}`}>
            {children}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
