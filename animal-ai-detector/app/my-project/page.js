'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Target, MapPin, Compass, Sparkles, Activity, TrendingUp, Database,
  ArrowRight, Loader2, CheckCircle, Globe, Binary, Users, Search, FolderOpen, Clock, BarChart2, Trash2, Upload
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import Logo from '@/components/Logo';

const ProjectMap = dynamic(() => import('@/components/ProjectMap'), { ssr: false });

export default function MyProjectPage() {
  const { user } = useAuth();
  const [step, setStep] = useState('hub'); // 'hub' | 'create' | 'map' | 'dashboard'
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [speciesName, setSpeciesName] = useState('');
  const [speciesImg, setSpeciesImg] = useState('');
  const [signatureImg, setSignatureImg] = useState('');
  const [scientificProof, setScientificProof] = useState('');
  const [scientificDoc, setScientificDoc] = useState('');
  const [description, setDescription] = useState('');
  const [validating, setValidating] = useState(false);
  const [audit, setAudit] = useState({ emblem: false, stamp: false, sign: false });
  const [editSpecies, setEditSpecies] = useState(null); 

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (Array.isArray(data)) setProjects(data);
    } catch (e) { console.error(e); }
    finally { setProjectsLoading(false); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setProject(data);
      setStep('map');
      fetchProjects();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleLocationSelect = async (lat, lng) => {
    setLoading(true);
    try {
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`);
      const geoData = await geoRes.json();
      const region = geoData.display_name || 'Unknown Region';
      const res = await fetch(`/api/projects/${project._id}/location`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng, region }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setProject(prev => ({ ...prev, location: data.location, region: data.region }));
      setTimeout(() => setStep('discovery'), 1000);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleAddSpecies = async (e) => {
    e.preventDefault();
    if (!speciesName) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project._id}/species`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: speciesName, 
          imageUrl: speciesImg, 
          location: project.location,
          scientificProof,
          description,
          authorizedSignature: signatureImg,
          scientificDocument: scientificDoc,
          verificationMarkers: {
            hasEmblem: audit.emblem,
            hasStamp: audit.stamp,
            hasSignature: audit.sign
          }
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSpeciesName('');
      setSpeciesImg('');
      setSignatureImg('');
      setScientificDoc('');
      setScientificProof('');
      setDescription('');
      setAudit({ emblem: false, stamp: false, sign: false });
      if (step === 'discovery') setStep('dashboard');
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleAIValidate = async () => {
    if (!speciesImg) return;
    setValidating(true);
    try {
      // Create form data for /api/detect
      const blob = await fetch(speciesImg).then(res => res.blob());
      const formData = new FormData();
      formData.append('image', blob, 'discovery.jpg');

      const res = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.label) {
        setSpeciesName(data.label);
        // Add a note about AI confidence
        setDescription(prev => `[AI VALIDATED: ${(data.confidence * 100).toFixed(1)}% Confidence]\n${prev}`);
      }
    } catch (err) { console.error('AI Validation failed', err); }
    finally { setValidating(false); }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setScientificDoc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSignatureImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSpeciesImg(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteSpeciesLog = async (speciesId) => {
    if (!confirm('Permanently remove this discovery record?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project._id}/species?speciesId=${speciesId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      setProject(prev => ({ ...prev, species: prev.species.filter(s => s.id !== speciesId) }));
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleUpdateSpeciesLog = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${project._id}/species`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          speciesId: editSpecies.id,
          name: editSpecies.name,
          description: editSpecies.description,
          scientificProof: editSpecies.scientificProof
        }),
      });
      if (!res.ok) throw new Error('Update failed');
      setProject(prev => ({
        ...prev,
        species: prev.species.map(s => s.id === editSpecies.id ? { ...s, ...editSpecies } : s)
      }));
      setEditSpecies(null);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const openProject = (p) => { setProject(p); setStep('dashboard'); };

  // Filtered projects for search
  const filteredProjects = projects.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.region?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAnalysis = () => {
    if (!project || !project.species?.length) return null;
    const species = project.species;
    const totals = species.length;
    const counts = species.reduce((acc, s) => { acc[s.name] = (acc[s.name] || 0) + 1; return acc; }, {});
    const mostFrequent = Object.entries(counts).sort((a,b) => b[1]-a[1])[0];
    const last24h = species.filter(s => (new Date() - new Date(s.detectedAt)) < 86400000).length;
    return { totals, counts, mostFrequent, last24h };
  };

  const handleDeleteProject = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      setProjects(prev => prev.filter(p => p._id !== id));
      if (project?._id === id) {
        setProject(null);
        setStep('hub');
      }
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const analysis = getAnalysis();

  return (
    <div className="py-2">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Globe size={14} /><span>Project Hub</span>
        </div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-6xl font-black tracking-tighter mb-4 italic text-white uppercase">Research <span className="text-slate-500 lowercase italic">Hub</span></h1>
            <p className="text-slate-400 font-medium max-w-2xl">Manage all your geospatial research deployments. Each project is a persistent monitoring hub with species tracking and map intelligence.</p>
          </div>
          <button
            onClick={() => setStep('create')}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-indigo-500/20 hover:scale-105"
          >
            <Plus size={16} /> New Project
          </button>
        </div>
      </motion.div>

      {/* Project Hub - Main List */}
      {(step === 'hub' || step === 'create') && (
        <>
          {/* Search */}
          <div className="relative mb-8 max-w-md">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="SEARCH PROJECTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-medium placeholder:text-slate-600 outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Projects Grid */}
          {projectsLoading ? (
            <div className="py-20 text-center text-slate-600 text-xs uppercase tracking-widest font-black animate-pulse">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-20 text-center">
              <FolderOpen size={48} className="mx-auto mb-4 text-slate-700" />
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                {searchQuery ? 'No projects match your search.' : 'No projects yet. Create your first one.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
              {filteredProjects.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="glass-card p-6 border-white/5 hover:border-indigo-500/30 transition-all text-left group cursor-pointer relative overflow-hidden"
                  onClick={() => openProject(p)}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full -translate-y-8 translate-x-8 group-hover:bg-indigo-600/10 transition-all" />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className="group-hover:scale-110 transition-transform">
                      <Logo className="w-16 h-16" />
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-emerald-400 uppercase bg-emerald-500/10 px-2 py-1 rounded">
                        {(p.species?.length || 0)} species
                      </span>
                      <button
                        onClick={(e) => handleDeleteProject(e, p._id)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        title="Delete Project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="text-slate-500 font-black uppercase tracking-tight mb-1 group-hover:text-indigo-400 transition-colors uppercase">{p.title || 'Untitled Project'}</h3>
                  <p className="text-[10px] text-slate-500 font-mono mb-4 truncate">{p.region || 'No region set'}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-600 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                    <ArrowRight size={14} className="text-slate-700 group-hover:text-indigo-400 transition-colors group-hover:translate-x-1 duration-200" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {step === 'create' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={() => setStep('hub')}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-10 border-indigo-500/20 relative overflow-hidden w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 right-0 p-8 opacity-5"><Plus size={120} className="text-white" /></div>
              <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8">New <span className="text-indigo-400 lowercase">Deployment</span></h2>
              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Project Title</label>
                  <input
                    autoFocus required type="text" value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., AMAZON_CANOPY_BETA"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-bold"
                  />
                </div>
                {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep('hub')} className="flex-1 py-3 bg-white/5 rounded-xl text-slate-400 text-xs font-black uppercase transition-all hover:bg-white/10">Cancel</button>
                  <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />} Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Selection Step */}
      {step === 'map' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">
                Select Location: <span className="text-indigo-400">{project?.title}</span>
              </h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Search or click on the map to set coordinates</p>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Step 02 / 03</div>
          </div>
          <div className="glass-card p-2 border-white/10 overflow-hidden relative group">
            <ProjectMap onLocationSelect={handleLocationSelect} />
            {loading && (
              <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center text-white gap-4">
                <Loader2 className="animate-spin text-indigo-500" size={40} />
                <p className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">Syncing coordinates...</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Discovery / New Entry Step */}
      {step === 'discovery' && project && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">New <span className="text-emerald-400">Discovery</span></h2>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Log species with scientific verification</p>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Step 03 / 03</div>
          </div>

          <div className="glass-card p-10 border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5"><Sparkles size={120} className="text-emerald-500" /></div>
            
            <form onSubmit={handleAddSpecies} className="space-y-8 relative z-10">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image Upload Area */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Species Visuals</label>
                  <div 
                    onClick={() => document.getElementById('species-upload').click()}
                    className="aspect-square rounded-3xl bg-white/5 border-2 border-dashed border-white/10 hover:border-emerald-500/50 flex flex-col items-center justify-center cursor-pointer group transition-all overflow-hidden"
                  >
                    {speciesImg ? (
                      <img src={speciesImg} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <>
                        <Upload size={32} className="text-slate-700 group-hover:text-emerald-500 transition-colors mb-4" />
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Upload Image</p>
                      </>
                    )}
                  </div>
                  <input id="species-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  
                  {speciesImg && (
                    <button 
                      type="button" 
                      onClick={handleAIValidate}
                      disabled={validating}
                      className="w-full py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-500/20 transition-all"
                    >
                      {validating ? <Loader2 className="animate-spin" size={12} /> : <Target size={12} />}
                      {validating ? 'Analyzing Species...' : 'AI Scan & Validate'}
                    </button>
                  )}
                </div>

                {/* Information Area */}
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Species Name</label>
                    <input
                      required type="text" value={speciesName}
                      onChange={(e) => setSpeciesName(e.target.value)}
                      placeholder="Scientific or Common Name"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Scientific Proof Link / Ref</label>
                    <div className="relative">
                      <Binary size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" />
                      <input
                        type="text" value={scientificProof}
                        onChange={(e) => setScientificProof(e.target.value)}
                        placeholder="Authorized Proof URL or ID"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-bold"
                      />
                    </div>
                  </div>

                  {/* Official Certification Area */}
                  <div className="pt-2">
                    <label className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-3 block">Official Verification (UNESCO/Sign)</label>
                    <div 
                      onClick={() => document.getElementById('signature-upload').click()}
                      className="h-20 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/30 flex items-center justify-center cursor-pointer transition-all overflow-hidden relative"
                    >
                      {signatureImg ? (
                        <div className="flex items-center gap-3">
                          <CheckCircle className="text-emerald-500" size={16} />
                          <span className="text-[10px] font-bold text-slate-300">AUTHORIZED SIGNATURE UPLOADED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-slate-700">
                          <CheckCircle size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Attach Official Signature</span>
                        </div>
                      )}
                    </div>
                    <input id="signature-upload" type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                  </div>

                  {/* Formal Document Archival */}
                  <div>
                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Formal Scientific Document (PDF/Image)</label>
                    <div 
                      onClick={() => document.getElementById('doc-upload').click()}
                      className="h-20 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 flex items-center justify-center cursor-pointer transition-all overflow-hidden relative"
                    >
                      {scientificDoc ? (
                        <div className="flex items-center gap-3">
                          <FolderOpen className="text-indigo-400" size={16} />
                          <span className="text-[10px] font-bold text-slate-300">DOCUMENT ARCHIVED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-slate-700">
                          <FolderOpen size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Archive Formal Proof</span>
                        </div>
                      )}
                    </div>
                    <input id="doc-upload" type="file" accept="image/*,application/pdf" onChange={handleDocUpload} className="hidden" />
                  </div>
                </div>
              </div>

              {/* Verification Audit Checklist */}
              <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle size={14} /> Verification Audit
                  </h3>
                  <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Toggle present elements</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { id: 'emblem', label: 'Official Emblem', icon: <Globe size={14} /> },
                    { id: 'stamp', label: 'Scientific Stamp', icon: <Database size={14} /> },
                    { id: 'sign', label: 'Authorized Sign', icon: <CheckCircle size={14} /> }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setAudit(prev => ({ ...prev, [m.id]: !prev[m.id] }))}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        audit[m.id] 
                          ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-lg shadow-indigo-500/10' 
                          : 'bg-white/5 border-white/5 text-slate-600 hover:border-white/10'
                      }`}
                    >
                      {m.icon}
                      <span className="text-[9px] font-black uppercase tracking-widest text-center">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Detailed Information</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide comprehensive details about this discovery..."
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-all placeholder:text-slate-700 font-bold resize-none"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep('dashboard')} className="flex-1 py-4 bg-white/5 rounded-2xl text-slate-400 text-xs font-black uppercase transition-all hover:bg-white/10">Skip for now</button>
                <button type="submit" disabled={loading || !speciesName} className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />} 
                  Authorize & Add to Project
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      )}

      {/* Dashboard Step */}
      {step === 'dashboard' && project && (
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={() => setStep('hub')} className="text-xs text-slate-500 hover:text-white font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                ← Back to Hub
              </button>
              <span className="text-slate-700">/</span>
              <span className="text-xs text-indigo-400 font-black uppercase tracking-widest">{project.title}</span>
            </div>
            <button
              onClick={(e) => handleDeleteProject(e, project._id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <Trash2 size={14} /> Delete Project
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Stats Column */}
            <div className="lg:col-span-4 space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-8 border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-white italic uppercase tracking-tight">Stats</h3>
                  <BarChart2 size={20} className="text-indigo-500" />
                </div>
                {analysis ? (
                  <div className="space-y-6">
                    <StatRow label="Total Species" value={analysis.totals} icon={<Binary size={14} />} />
                    <StatRow label="Most Common" value={analysis.mostFrequent?.[0] || 'N/A'} color="emerald" icon={<CheckCircle size={14} />} />
                    <StatRow label="Recent (24h)" value={analysis.last24h} color="purple" icon={<TrendingUp size={14} />} />
                    <div className="mt-6 pt-6 border-t border-white/5">
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Detection Rate</h4>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(analysis.totals * 10, 100)}%` }} className="h-full bg-indigo-500" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center opacity-30">
                    <Sparkles size={32} className="mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No species logged yet</p>
                  </div>
                )}
              </motion.div>

              <div className="glass-card p-6 border-white/5">
                <h3 className="text-sm font-black text-white uppercase tracking-tight mb-4">Project Info</h3>
                <div className="space-y-3">
                  <MetaItem label="Region" value={project.region || 'Not Set'} />
                  <MetaItem label="Status" value="Active" />
                  <MetaItem label="Created" value={new Date(project.createdAt).toLocaleDateString()} />
                </div>
                <button onClick={() => setStep('map')} className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-400 hover:text-white hover:border-indigo-500/30 transition-all font-bold uppercase tracking-widest">
                  <MapPin size={12} /> Update Location
                </button>
              </div>
            </div>

            {/* Species Log */}
            <div className="lg:col-span-8">
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Species <span className="text-emerald-400">Ledger</span></h3>
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Manual species logging</p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleAddSpecies} className="flex gap-3 mb-8 flex-wrap">
                    <input
                      required type="text" value={speciesName}
                      onChange={(e) => setSpeciesName(e.target.value)}
                      placeholder="Species Name"
                      className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-emerald-500 transition-all text-sm placeholder:text-slate-700"
                    />
                    <input
                      type="text" value={speciesImg}
                      onChange={(e) => setSpeciesImg(e.target.value)}
                      placeholder="Image URL (optional)"
                      className="flex-1 min-w-[140px] bg-white/5 border border-white/10 rounded-xl p-3 text-white font-bold outline-none focus:border-indigo-500 transition-all text-sm placeholder:text-slate-700"
                    />
                    <button type="submit" disabled={loading} className="px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 py-3">
                      {loading ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
                      Add
                    </button>
                  </form>

                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {!project.species?.length ? (
                      <div className="py-16 text-center text-slate-600 italic text-sm">No species logged. Start by adding one above.</div>
                    ) : project.species.map((s, i) => (
                      <motion.div
                        key={s.id || i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group flex flex-col p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all gap-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="group-hover:scale-110 transition-transform flex-shrink-0">
                              <Logo className="w-16 h-16" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1 flex-wrap">
                                <h4 className="text-white font-black uppercase tracking-tight text-lg truncate">{s.name}</h4>
                                {s.description?.includes('[AI VALIDATED') && (
                                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                                    <Sparkles size={10} />
                                    ANIMAI Verified
                                  </div>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(s.detectedAt).toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                             <button onClick={() => setEditSpecies({ ...s })} className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all">
                              <Plus size={14} className="rotate-45" />
                            </button>
                            <button onClick={() => handleDeleteSpeciesLog(s.id)} className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Description Box */}
                        {s.description && (
                          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 font-black italic">Research Description</h5>
                            <p className="text-xs text-slate-400 leading-relaxed italic">{s.description.replace(/\[AI VALIDATED:.*?\]\n?/, '')}</p>
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                          {/* Species Visual */}
                          <div>
                            <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2 block">Detection Scan</span>
                            {s.imageUrl ? (
                              <div className="aspect-square rounded-2xl border border-white/10 overflow-hidden ring-1 ring-white/5 hover:ring-indigo-500/50 transition-all">
                                <img src={s.imageUrl} className="w-full h-full object-cover" alt={s.name} />
                              </div>
                            ) : (
                              <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-800"><Activity size={20} /></div>
                            )}
                          </div>

                          {/* Authorized Sign */}
                          <div>
                            <span className="text-[8px] font-black text-emerald-500/70 uppercase tracking-widest mb-2 block font-blackitalic">Authorized Sign</span>
                            {s.authorizedSignature ? (
                              <div className="aspect-square rounded-2xl border border-emerald-500/10 bg-emerald-500/5 overflow-hidden p-2 flex items-center justify-center group/sign cursor-zoom-in">
                                <img src={s.authorizedSignature} className="w-full h-full object-contain filter grayscale invert brightness-200" alt="Authorized Sign" />
                              </div>
                            ) : (
                              <div className="aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-800"><CheckCircle size={20} /></div>
                            )}
                          </div>

                          {/* Scientific Document Link */}
                          <div className="col-span-2">
                            <span className="text-[8px] font-black text-indigo-500/70 uppercase tracking-widest mb-2 block font-blackitalic">Scientific Proof & Archive</span>
                            <div className="flex gap-2 h-full">
                              {s.scientificDocument ? (
                                <a 
                                  href={s.scientificDocument} 
                                  target="_blank" rel="noopener noreferrer"
                                  className="flex-1 flex flex-col items-center justify-center gap-2 p-3 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/10 rounded-2xl transition-all group/doc"
                                >
                                  <FolderOpen size={18} className="text-emerald-400 group-hover/doc:scale-110 transition-transform" />
                                  <span className="text-[8px] font-black text-white/60 uppercase tracking-widest truncate max-w-full italic text-center">Formal Archive</span>
                                </a>
                              ) : (
                                <div className="flex-1 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-800"><Database size={16} /></div>
                              )}

                              {s.scientificProof && (
                                <a 
                                  href={s.scientificProof.startsWith('http') ? s.scientificProof : '#'} 
                                  target="_blank" rel="noopener noreferrer"
                                  className="flex-1 flex flex-col items-center justify-center gap-2 p-3 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 rounded-2xl transition-all group/link"
                                >
                                  <Globe size={18} className="text-indigo-400 group-hover/link:scale-110 transition-transform" />
                                  <span className="text-[8px] font-black text-white/60 uppercase tracking-widest truncate max-w-full italic text-center">Web Ref</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Authenticity Markers */}
                        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                          {s.verificationMarkers?.hasEmblem && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[8px] font-black text-amber-500 uppercase tracking-widest">
                              <Globe size={10} /> Official Emblem
                            </div>
                          )}
                          {s.verificationMarkers?.hasStamp && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[8px] font-black text-blue-500 uppercase tracking-widest">
                              <Database size={10} /> Scientific Stamp
                            </div>
                          )}
                          {s.verificationMarkers?.hasSignature && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-[8px] font-black text-emerald-500 uppercase tracking-widest">
                              <CheckCircle size={10} /> Authorized Sign
                            </div>
                          )}
                          {s.verificationMarkers?.hasEmblem && s.verificationMarkers?.hasStamp && s.verificationMarkers?.hasSignature && (
                             <motion.div 
                               initial={{ scale: 0 }} animate={{ scale: 1 }}
                               className="ml-auto w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"
                               title="Certified Discovery"
                             >
                               <CheckCircle size={16} />
                             </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Edit Species Modal */}
          <AnimatePresence>
            {editSpecies && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4"
                onClick={() => setEditSpecies(null)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="glass-card p-10 border-indigo-500/20 relative overflow-hidden w-full max-w-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-8">Edit <span className="text-indigo-400 lowercase">Discovery</span></h2>
                  <form onSubmit={handleUpdateSpeciesLog} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Species Name</label>
                        <input
                          required type="text" value={editSpecies.name}
                          onChange={(e) => setEditSpecies({ ...editSpecies, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-all font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Scientific Proof</label>
                        <input
                          type="text" value={editSpecies.scientificProof || ''}
                          onChange={(e) => setEditSpecies({ ...editSpecies, scientificProof: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-all font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 block">Description</label>
                      <textarea
                        value={editSpecies.description || ''}
                        onChange={(e) => setEditSpecies({ ...editSpecies, description: e.target.value })}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-all font-bold resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button type="button" onClick={() => setEditSpecies(null)} className="flex-1 py-3 bg-white/5 rounded-xl text-slate-400 text-xs font-black uppercase transition-all hover:bg-white/10">Cancel</button>
                      <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />} Update Record
                      </button>
                    </div>
                  </form>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, icon, color = 'indigo' }) {
  const colors = { indigo: 'text-indigo-400', emerald: 'text-emerald-400', purple: 'text-purple-400' };
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest">{icon}{label}</div>
      <span className={`text-sm font-black italic ${colors[color]}`}>{value}</span>
    </div>
  );
}

function MetaItem({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{label}</span>
      <p className="text-sm font-bold text-white truncate">{value}</p>
    </div>
  );
}
