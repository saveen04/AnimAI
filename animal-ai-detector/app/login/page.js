'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Lock, Mail, ChevronRight, Loader2 } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const { refreshUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      await refreshUser();
      router.push(redirect);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="glass-card p-8 border-white/10"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Email ID</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-700"
              placeholder="identity@animai.io"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Pass-Key</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-700"
              placeholder="••••••••"
            />
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold"
          >
            SIGNAL ERROR: {error}
          </motion.div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="glass-button w-full py-4 bg-indigo-600 hover:bg-indigo-500 border-indigo-400/30 font-black uppercase tracking-[0.2em] group disabled:opacity-50"
        >
          {loading ? 'Synchronizing...' : (
            <span className="flex items-center justify-center gap-2">
              Establish Link <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
          New Explorer?{' '}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 transition-colors ml-1 underline decoration-indigo-500/30 underline-offset-4">
            Register ID
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
            <Lock size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter mb-2 italic">Secure <span className="text-slate-500">Access</span></h1>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Secure Access</p>
        </motion.div>

        <Suspense fallback={
          <div className="glass-card p-12 flex flex-col items-center justify-center text-slate-500">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-xs font-bold uppercase tracking-widest">Loading Interface</p>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
