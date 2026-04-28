'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, Binary, Zap, Sprout, Info, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DeepSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  const handleSearch = async (e, searchQuery = query) => {
    e?.preventDefault();
    if (!searchQuery) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/research?q=${searchQuery}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Research retrieval failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(null, 'animal');
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-400 transition-colors mb-8 group font-bold uppercase tracking-widest text-[10px]"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        Dashboard
      </Link>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Database size={14} />
            <span>Advanced Search</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter italic text-white mb-2 uppercase">Deep <span className="text-slate-500 lowercase">Search</span></h1>
          <p className="text-slate-400 max-w-xl font-medium italic">
            "Advanced taxonomy indexing and cross-referenced agricultural data mining."
          </p>
        </motion.div>

        <form onSubmit={handleSearch} className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Query biological database..."
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-700"
          />
        </form>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-500">
          <Loader2 className="animate-spin mb-4 text-indigo-500/50" size={48} />
          <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Syncing Database...</p>
        </div>
      ) : (
        <div className="space-y-16">
          <AnimatePresence mode="wait">
            {activeItem && (
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full relative"
              >
                <div className="absolute top-4 right-4 z-10">
                  <button onClick={() => setActiveItem(null)} className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all">
                    <ArrowLeft size={24} />
                  </button>
                </div>

                <div className="space-y-8">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-fuchsia-500/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-700"></div>
                    <div className="relative p-10 lg:p-14 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
                      <div className="flex flex-col lg:flex-row gap-12 items-start">
                        <div className="flex-1 space-y-8">
                          <div className="flex flex-wrap items-center gap-4">
                            <div className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] ${activeItem.category ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'}`}>
                              {activeItem.category || activeItem.type}
                            </div>
                            <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeItem.habitat || activeItem.soilType}</span>
                            <span className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest ${activeItem.status === 'Endangered' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                              {activeItem.status || activeItem.optimalTemp}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-5xl lg:text-7xl font-black text-white italic uppercase tracking-tighter mb-4 leading-none">{activeItem.name}</h3>
                            <p className="text-lg lg:text-xl font-mono text-indigo-400/80 flex items-center gap-3"><Binary size={20} /> {activeItem.scientificName || activeItem.species}</p>
                          </div>
                          <p className="text-lg lg:text-2xl text-slate-300 leading-relaxed font-medium italic max-w-4xl">{activeItem.description || activeItem.notes}</p>
                        </div>
                        {activeItem.imageUrl && (
                          <div className="w-full lg:w-72 h-72 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shrink-0">
                            <img src={activeItem.imageUrl} alt={activeItem.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {activeItem.agriImpact && (
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-[2.5rem] blur-2xl opacity-30 group-hover:opacity-100 transition duration-700"></div>
                      <div className="relative p-10 lg:p-14 rounded-[2.5rem] bg-black/60 border border-emerald-500/20 backdrop-blur-2xl shadow-2xl space-y-12">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shrink-0">
                              <Zap size={32} className="animate-pulse" />
                            </div>
                            <p className="text-xl text-slate-200 font-bold leading-relaxed max-w-2xl italic">{activeItem.agriImpact}</p>
                          </div>
                          <span className={`text-xs font-black px-6 py-2.5 rounded-full uppercase tracking-[0.2em] ${
                            activeItem.agriImpact.includes('DEVASTATING') || activeItem.agriImpact.includes('CRITICAL') ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {activeItem.agriImpact.includes('DEVASTATING') ? 'Critical Threat' : 'Analyzed'}
                          </span>
                        </div>

                        {activeItem.agriDetails && (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all group hover:translate-y-1">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-3 group-hover:text-emerald-400 transition-colors">Interaction</span>
                              <p className="text-2xl font-black text-white italic tracking-tighter">{activeItem.agriDetails.interactionLevel}</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-emerald-500/20 transition-all group hover:translate-y-1">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] block mb-3 group-hover:text-emerald-400 transition-colors">Economic</span>
                              <p className="text-2xl font-black text-white italic tracking-tighter">{activeItem.agriDetails.economicImpact}</p>
                            </div>
                            <div className="md:col-span-2 p-8 rounded-3xl bg-white/5 border border-white/5 space-y-6">
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Biological Targets</span>
                              <div className="flex flex-wrap gap-3">
                                {activeItem.agriDetails.affectedCrops.map(crop => (
                                  <span key={crop} className="px-5 py-2.5 rounded-2xl bg-emerald-500/10 text-[11px] font-black text-emerald-400 border border-emerald-500/20 uppercase tracking-widest">{crop}</span>
                                ))}
                              </div>
                            </div>
                            <div className="lg:col-span-4 p-10 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/20 relative overflow-hidden">
                              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-3 mb-6"><Sparkles size={20} /> Mitigation Strategy</span>
                              <p className="text-xl text-slate-200 leading-relaxed font-medium italic max-w-5xl">{activeItem.agriDetails.mitigation}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid lg:grid-cols-2 gap-12">
            <section>
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400"><Binary size={18} /></div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Species Taxonomy</h2>
              </div>
              <div className="grid gap-6">
                {results?.animals.map((animal) => (
                  <motion.div key={animal.id} onClick={() => { setActiveItem(animal); window.scrollTo({ top: 200, behavior: 'smooth' }); }} className={`glass-card p-6 border-white/5 hover:border-indigo-500/30 cursor-pointer transition-all ${activeItem?.id === animal.id ? 'border-indigo-500 bg-indigo-500/10' : ''}`}>
                    <div className="flex justify-between items-start mb-4"><span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{animal.category}</span><Info size={14} className="text-slate-700" /></div>
                    <h3 className="text-xl font-black text-white mb-1 italic">{animal.name}</h3>
                    <p className="text-xs font-mono text-slate-500 italic mb-4">{animal.scientificName}</p>
                    <p className="text-sm text-slate-400 line-clamp-2 italic">{animal.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>
            <section>
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400"><Sprout size={18} /></div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Agricultural Impact</h2>
              </div>
              <div className="grid gap-6">
                {results?.agriculture.map((agri) => (
                  <motion.div key={agri.id} onClick={() => { setActiveItem(agri); window.scrollTo({ top: 200, behavior: 'smooth' }); }} className={`glass-card p-6 border-white/5 hover:border-emerald-500/30 cursor-pointer transition-all ${activeItem?.id === agri.id ? 'border-emerald-500 bg-emerald-500/10' : ''}`}>
                    <div className="flex justify-between items-start mb-4"><span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{agri.type}</span><Sprout size={14} className="text-slate-700" /></div>
                    <h3 className="text-xl font-black text-white mb-1 italic">{agri.name}</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Optimal: {agri.optimalTemp}</p>
                    <p className="text-sm text-slate-400 line-clamp-2 italic">{agri.notes}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}
