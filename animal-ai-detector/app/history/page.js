'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Search, Loader2, AlertCircle } from 'lucide-react';
import ResultCard from '@/components/ResultCard';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await fetch('/api/history');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load history');
        setItems(data.detections || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { x: -30, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center md:text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
          <History size={14} />
          <span>Explorer Archive</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-3">ANIMAI <span className="text-slate-500">History</span></h1>
        <p className="text-slate-400 max-w-xl">
          Review your past discoveries and species identifications stored in the ANIMAI cloud.
        </p>
      </motion.div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center gap-3 mb-8"
        >
          <AlertCircle size={18} />
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Loader2 size={40} className="animate-spin mb-4 text-indigo-500/50" />
          <p className="animate-pulse font-medium">Retrieving archive...</p>
        </div>
      ) : items.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">No discoveries yet</h3>
          <p className="text-slate-500 mb-8">Your detection history will appear here once you start using ANIMAI.</p>
          <button onClick={() => window.location.href='/upload'} className="glass-button bg-indigo-600 hover:bg-indigo-500 mx-auto">
            Start Exploring
          </button>
        </motion.div>
      ) : (
        <motion.ul 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6"
        >
          {items.map((detection) => (
            <motion.li key={detection._id} variants={itemVariants}>
              <ResultCard 
                result={detection} 
                isHistory 
                onDelete={(id) => setItems(prev => prev.filter(i => i._id !== id))}
              />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}
