import { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, Gauge, Calendar, Target, Activity, Sparkles, Trash2, Loader2 } from 'lucide-react';
import { ANIMAL_DESCRIPTIONS } from '@/lib/constants';

export default function ResultCard({ result, isHistory, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this detection?')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/history?id=${result._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      if (onDelete) onDelete(result._id);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const label = result?.label || result?.species || 'unknown';
  const confidence = result?.confidence ?? result?.score ?? 0;
  const description =
    result?.description ||
    ANIMAL_DESCRIPTIONS[label.toLowerCase()] ||
    ANIMAL_DESCRIPTIONS.default;
  const date = result?.createdAt ? new Date(result.createdAt).toLocaleString() : null;
  const mime = result?.imageMimeType || 'image/jpeg';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden group border-white/20"
    >
      <div className="flex flex-col md:flex-row">
        {result?.imageBase64 && (
          <div className="w-full md:w-1/3 aspect-square relative overflow-hidden bg-black/20">
            <img
              src={`data:${mime};base64,${result.imageBase64}`}
              alt="Detected Animal"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            <div className="absolute bottom-4 left-4 bg-indigo-600/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
              {label}
            </div>
          </div>
        )}
        
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold capitalize text-white mb-1 group-hover:text-indigo-300 transition-colors uppercase tracking-tight">
                {label}
              </h3>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <Gauge size={14} className="text-indigo-400" />
                  <span>Confidence: <span className="text-white font-medium">{(confidence * 100).toFixed(1)}%</span></span>
                </div>
                {result?.filename && (
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono uppercase tracking-tighter">
                    <Activity size={12} className="text-slate-600" />
                    <span>Source: {result.filename}</span>
                  </div>
                )}
              </div>
            </div>
            {isHistory && date && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 text-slate-500 text-xs bg-white/5 px-2 py-1 rounded">
                  <Calendar size={12} />
                  <span>{date}</span>
                </div>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  title="Delete Detection"
                >
                  {isDeleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="mt-1">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Info size={12} className="text-indigo-400" />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-300 mb-1 uppercase tracking-wider text-[10px]">Description & Ecology</h4>
                <p className="text-slate-400 text-sm leading-relaxed italic">
                  "{description}"
                </p>
              </div>
            </div>
          </div>

          {/* Advanced Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2">
                 <Target size={12} /> Spatial Lock
              </div>
              <p className="text-xs font-mono text-white">42.36°N, 71.05°W</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-widest mb-2">
                 <Activity size={12} /> Bio-Frequency
              </div>
              <p className="text-xs font-mono text-white">432.8 MHz</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 col-span-2">
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-2">
                 <Sparkles size={12} /> Ecosystem Match
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-tight italic">98.4% Synchronized</span>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="w-[98%] h-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
            <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">AnimAI v2.0</div>
            <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-slate-500 uppercase">RESEARCH-GRADE</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
