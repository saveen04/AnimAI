'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/AuthProvider';
import { User, Mail, Save, CheckCircle, AlertCircle, Camera, Shield, Clock, ImageIcon, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    setName(user?.name || '');
    setAge(user?.age || '');
    setGender(user?.gender || '');
    setBio(user?.bio || '');
    setAvatarPreview(user?.avatarUrl || null);
  }, [user]);

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const onSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      let avatarBase64 = null;
      if (avatar) {
        const buf = await avatar.arrayBuffer();
        avatarBase64 = `data:${avatar.type};base64,${Buffer.from(buf).toString('base64')}`;
      }
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, gender, bio, avatarBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Profile update failed');
      await refreshUser();
      setSuccess('Profile updated successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="py-2">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
          <User size={14} />
          <span>Profile Settings</span>
        </div>
        <h1 className="text-6xl font-black tracking-tighter mb-4 italic text-white uppercase">Account <span className="text-slate-500 lowercase italic">Config</span></h1>
        <p className="text-slate-400 font-medium max-w-2xl">Update your profile information, profile picture, and visibility settings.</p>
      </motion.div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Left: Profile Picture + Status */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 border-white/5 flex flex-col items-center gap-6"
          >
            {/* Avatar */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-3xl overflow-hidden border-2 border-indigo-500/30 bg-black/20">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-600/20">
                    <User size={48} className="text-indigo-400" />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-500 transition-all hover:scale-110"
              >
                <Camera size={18} />
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-black text-white uppercase tracking-tight">{user?.name || 'User'}</h3>
              <p className="text-xs text-slate-500 font-mono mt-1">{user?.email}</p>
            </div>

            <div className="w-full pt-4 border-t border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Shield size={12} /> Status
                </span>
                <span className="text-[10px] font-black text-emerald-400 uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={12} /> Tier
                </span>
                <span className="text-[10px] font-black text-indigo-400 uppercase">Research Grade</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 space-y-6"
        >
          {/* Profile Form */}
          <div className="glass-card p-8 border-white/10">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <User size={14} /> Profile Information
            </h2>
            <form onSubmit={onSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                  <input
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/5 rounded-2xl text-slate-600 font-mono text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-700"
                    placeholder="Your full name"
                    maxLength={50}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-700"
                    placeholder="25"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white appearance-none"
                  >
                    <option value="" disabled className="bg-slate-900">Select Gender</option>
                    <option value="male" className="bg-slate-900">Male</option>
                    <option value="female" className="bg-slate-900">Female</option>
                    <option value="other" className="bg-slate-900">Other</option>
                    <option value="prefer_not_to_say" className="bg-slate-900">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder:text-slate-700 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold flex items-center gap-3"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
              
              {success && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-3"
                >
                  <CheckCircle size={16} />
                  {success}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="glass-button w-full bg-indigo-600 hover:bg-indigo-500 py-4 border-indigo-400/30 text-white font-black uppercase tracking-[0.2em] group disabled:opacity-50 h-14"
              >
                {saving ? 'Saving...' : (
                  <span className="flex items-center justify-center gap-2">
                    Save Changes <Save size={18} className="group-hover:scale-110 transition-transform" />
                  </span>
                )}
              </button>
            </form>
          </div>

          {/* Recent Detections */}
          <div className="glass-card p-8 border-white/5">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <ImageIcon size={14} /> Recent Detections
            </h2>
            <RecentDetections />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RecentDetections() {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/history?limit=5')
      .then(r => r.json())
      .then(d => setDetections(Array.isArray(d.detections) ? d.detections : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-8 flex items-center justify-center text-slate-600 text-xs uppercase tracking-widest font-black animate-pulse">Loading detections...</div>
  );

  if (!detections.length) return (
    <div className="py-8 text-center text-slate-600 text-xs uppercase tracking-widest font-black">No detections yet. Upload an image to get started.</div>
  );

  return (
    <div className="space-y-3">
      {detections.map((d, i) => (
        <div key={d._id || i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/20 transition-all group">
          <div className="flex items-center gap-4">
            {d.imageBase64 ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                <img src={`data:${d.imageMimeType || 'image/jpeg'};base64,${d.imageBase64}`} alt={d.label} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center">
                <ImageIcon size={20} className="text-indigo-400" />
              </div>
            )}
            <div>
              <p className="text-sm font-black text-white uppercase tracking-tight capitalize">{d.label || 'Unknown'}</p>
              <p className="text-[10px] text-slate-600 font-mono">{d.filename || 'image.jpg'}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-indigo-400">{((d.confidence || 0) * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-slate-600 flex items-center gap-1 justify-end">
              <Clock size={10} />
              {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
