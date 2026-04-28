'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Upload, Camera, ArrowRight, Zap, Sparkles, Binary, Search, Database } from 'lucide-react';

export default function DetectionHub() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-16 text-center md:text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Binary size={14} />
          <span>Core Interface</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-4 italic text-white uppercase">Detection <span className="text-slate-500 lowercase">Hub</span></h1>
        <p className="text-slate-400 max-w-2xl font-medium leading-relaxed">
          Select your detection protocol. Access high-resolution upload analysis or real-time vision sensors.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8"
      >
        <Link href="/upload" className="group">
          <motion.div 
            variants={itemVariants}
            className="glass-card p-10 h-full border-white/10 group-hover:bg-white/10 group-hover:border-indigo-500/30 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-600/10 rounded-full blur-3xl group-hover:bg-indigo-600/20 transition-all" />
            
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Upload size={32} className="text-indigo-400" />
            </div>
            
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Upload Image</h2>
            <p className="text-slate-500 leading-relaxed font-medium mb-8">
              Analyze static biological data through our cloud-based processing engine. Ideal for high-fidelity research.
            </p>
            
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-bold uppercase tracking-[0.2em] group-hover:translate-x-2 transition-transform italic italic italic italic italic italic italic italic">
              Synchronize Data <ArrowRight size={16} />
            </div>
          </motion.div>
        </Link>

        <Link href="/camera" className="group">
          <motion.div 
            variants={itemVariants}
            className="glass-card p-10 h-full border-white/10 group-hover:bg-white/20 group-hover:border-purple-500/30 transition-all cursor-pointer relative overflow-hidden"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all" />

            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
              <Camera size={32} className="text-purple-400" />
            </div>
            
            <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">Live Camera</h2>
            <p className="text-slate-500 leading-relaxed font-medium mb-8">
              Establish a direct link to vision sensors. Real-time identification of species in proximity.
            </p>

            <div className="flex items-center gap-3 text-purple-400 text-sm font-bold uppercase tracking-[0.2em] group-hover:translate-x-3 transition-transform italic italic italic italic italic italic italic italic italic">
              Activate Sensors <ArrowRight size={16} />
            </div>
          </motion.div>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-20 border-t border-white/5 pt-12 flex flex-col md:flex-row items-center justify-between gap-8 opacity-60"
      >
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Link State</span>
            <span className="text-emerald-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI Tier</span>
            <span className="text-indigo-400 text-sm font-bold uppercase tracking-wider">Research-Grade v2.4</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em] italic">
           <Sparkles size={14} />
           Synchronized Discovery
        </div>
      </motion.div>
    </div>
  );
}
