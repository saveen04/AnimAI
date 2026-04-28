'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { Upload, History, Layout, ChevronRight, User, Search, Globe, Binary, Activity, Sparkles, ScanEye, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 relative min-h-screen">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
      >
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(99,102,241,0.15)]">
            <Activity size={14} className="animate-pulse" />
            <span>Secure Terminal Active</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter mb-4 text-white leading-none">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400">AnimAI</span> <br/>
            Command <span className="italic font-light text-slate-500">Center</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg lg:text-xl max-w-xl">
            {loading ? 'Authenticating neural link...' : `Welcome, ${user?.name || user?.email || 'Operative'}. Ready to decode the wild.`}
          </p>
        </div>

        <div className="flex gap-4 shrink-0 z-10">
          <Link href="/upload" className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center gap-3 bg-indigo-600/20 backdrop-blur-xl border border-indigo-500/50 px-8 py-4 rounded-2xl text-white font-bold hover:bg-indigo-600/40 transition-all">
              <ScanEye size={20} className="text-indigo-200" />
              Initialize Scan
            </div>
          </Link>
        </div>
      </motion.div>

      {/* Main Widgets */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 z-10 relative"
      >
        <div className="lg:col-span-2">
          <DashboardCard
            href="/detection"
            variants={cardVariants}
            icon={<Binary className="text-white" size={32} />}
            title="Live Detection Node"
            description="Activate vision sensors and biological data upload protocols. Process high-resolution media instantly."
            gradient="from-indigo-500/20 to-indigo-600/5"
            borderColor="border-indigo-500/30"
            iconBg="bg-indigo-500"
            featured={true}
          />
        </div>
        <DashboardCard
          href="/history"
          variants={cardVariants}
          icon={<History className="text-white" size={24} />}
          title="Data Archive"
          description="Access stored discoveries and comprehensive historical detection reports."
          gradient="from-fuchsia-500/20 to-fuchsia-600/5"
          borderColor="border-fuchsia-500/30"
          iconBg="bg-fuchsia-500"
        />
        <DashboardCard
          href="/deep-search"
          variants={cardVariants}
          icon={<Search className="text-white" size={24} />}
          title="Taxonomy Engine"
          description="Advanced cross-referenced research and deep indexing of global species."
          gradient="from-emerald-500/20 to-emerald-600/5"
          borderColor="border-emerald-500/30"
          iconBg="bg-emerald-500"
        />
        <DashboardCard
          href="/my-project"
          variants={cardVariants}
          icon={<Globe className="text-white" size={24} />}
          title="Global Zones"
          description="Monitor regional species growth and mapping statistics worldwide."
          gradient="from-amber-500/20 to-amber-600/5"
          borderColor="border-amber-500/30"
          iconBg="bg-amber-500"
        />
        <DashboardCard
          href="/camera"
          variants={cardVariants}
          icon={<Zap className="text-white" size={24} />}
          title="Rapid Stream"
          description="Connect direct webcam feeds for ultra-low latency inference."
          gradient="from-rose-500/20 to-rose-600/5"
          borderColor="border-rose-500/30"
          iconBg="bg-rose-500"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-8 relative group"
      >
        <Link href="/settings">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative glass-card p-6 md:p-8 flex items-center justify-between bg-black/40 hover:bg-black/60 border-white/5 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center shadow-inner">
                <User size={24} className="text-slate-300" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white tracking-wide">Operative Profile</h4>
                <p className="text-sm text-slate-400 mt-1">Manage security credentials, API keys, and notification protocols</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 group-hover:scale-110 transition-all">
              <ChevronRight className="text-slate-300" />
            </div>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}

function DashboardCard({ href, icon, title, description, variants, gradient, borderColor, iconBg, featured = false }) {
  return (
    <motion.div variants={variants} className={featured ? "h-full" : ""}>
      <Link
        href={href}
        className={`block relative overflow-hidden rounded-3xl border ${borderColor} bg-gradient-to-br ${gradient} p-8 h-full group hover:shadow-2xl transition-all duration-500 before:absolute before:inset-0 before:bg-black/40 hover:before:bg-black/20 before:-z-10 before:transition-colors`}
      >
        {/* Glow effect on hover */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/10 rounded-full blur-[50px] group-hover:bg-white/20 transition-colors duration-700 pointer-events-none" />
        
        <div className="flex flex-col h-full z-10 relative">
          <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
            {icon}
          </div>
          
          <div className="mt-auto">
            <h2 className={`font-black text-white mb-3 uppercase tracking-tight ${featured ? 'text-3xl' : 'text-xl'}`}>
              {title}
            </h2>
            <p className="text-sm md:text-base text-slate-300/80 leading-relaxed font-light">
              {description}
            </p>
          </div>
          
          <div className="absolute top-8 right-8 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <ChevronRight className="text-white/50" size={24} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

