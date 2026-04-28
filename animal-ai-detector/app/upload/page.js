'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, Search, CheckCircle2, AlertCircle, Database, Zap } from 'lucide-react';
import ResultCard from '@/components/ResultCard';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    processFile(selected);
  };

  const processFile = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    setError(null);
    setResult(null);
    setFile(selected);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image first.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Detection failed');
      setResult(data);
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="py-2">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Database size={14} />
          <span>Upload Interface</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter mb-4 italic text-white uppercase">Analysis <span className="text-slate-500 lowercase">Hub</span></h1>
        <p className="text-slate-400 font-medium max-w-2xl">
          Analyze high-resolution visual data using our advanced research architecture.
        </p>
      </motion.div>

      <div className={`grid gap-10 transition-all duration-500 overflow-hidden ${result ? 'lg:grid-cols-2' : 'grid-cols-1 max-w-3xl'}`}>
        {/* Upload Column */}
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              layout
              className={`relative glass-card p-1 transition-all ${dragActive ? 'ring-2 ring-indigo-500 bg-indigo-500/5' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="border border-dashed border-white/10 rounded-xl p-8 lg:p-12 text-center relative overflow-hidden bg-black/20">
                <AnimatePresence mode="wait">
                  {!preview ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-6 text-indigo-400">
                        <Upload size={32} />
                      </div>
                      <p className="text-lg font-bold text-white mb-2 italic">Drag & Drop Image</p>
                      <p className="text-slate-500 mb-6 text-xs uppercase tracking-widest font-black">Link Standby</p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="glass-button bg-indigo-600/10 border-indigo-500/30 hover:bg-indigo-600/30 text-xs"
                      >
                        Select Protocol
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="relative group rounded-lg overflow-hidden border border-white/10"
                    >
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-auto max-h-[400px] object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={handleReset}
                          className="p-4 bg-red-500/80 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                        >
                          <X size={24} />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold flex items-center gap-3 uppercase tracking-tighter"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={!file || loading}
                className="flex-1 glass-button bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:bg-slate-800/50 h-14"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span className="font-black uppercase tracking-widest text-xs">Processing...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} className="fill-current" />
                    <span className="font-black uppercase tracking-widest text-xs">Execute Detection</span>
                  </>
                )}
              </button>
              {preview && !loading && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 glass-button border-red-500/20 hover:bg-red-500/10 text-red-400"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Result Column */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ type: 'spring', damping: 20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-2">
                 <div className="flex items-center gap-2 text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">
                    <CheckCircle2 size={16} />
                    <span>Analysis Complete</span>
                 </div>
                 <div className="px-3 py-1 rounded bg-white/5 border border-white/10 text-[8px] font-black text-slate-500 uppercase tracking-widest">
                    ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                 </div>
              </div>
              <ResultCard result={result} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
