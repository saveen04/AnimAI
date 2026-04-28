'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Activity, Search, Globe, ScanEye, Code2, Cpu, Database, Server, Fingerprint, Layers, ChevronDown } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Logo from '@/components/Logo';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 20 },
    },
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center selection:bg-indigo-500/30">
      {/* Premium Top Bar */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-black/20 backdrop-blur-md border-b border-white/5 py-4 px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo className="w-14 h-14" glowColor="transparent" />
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button onClick={() => scrollToSection('nexus')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">Nexus</button>
          <button onClick={() => scrollToSection('intelligence')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">Intelligence</button>
          <button onClick={() => scrollToSection('tech')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">Architecture</button>
          <button onClick={() => scrollToSection('developer')} className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-white transition-colors">Developer</button>
        </div>

        <Link href="/login" className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
          Access Portal
        </Link>
      </nav>

      {/* Hero Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl w-full text-center z-10 mt-40 lg:mt-56 mb-40 px-4"
      >
        <motion.div variants={itemVariants} className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-sm font-bold backdrop-blur-2xl shadow-[0_0_40px_rgba(99,102,241,0.2)]">
            <Sparkles size={18} className="text-indigo-400 animate-pulse" />
            <span className="tracking-[0.2em] uppercase">Biological Intelligence v2.0</span>
          </div>
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-7xl md:text-9xl font-black mb-10 tracking-tighter leading-none"
        >
          Decode The <br/>
          <span className="animated-gradient-text italic pe-4">Wild</span> Nexus
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-xl md:text-3xl text-slate-400 mb-16 max-w-4xl mx-auto leading-relaxed font-light"
        >
          Experience the pinnacle of species identification. High-fidelity vision streams met with surgical neural accuracy.
          <span className="text-white font-semibold block mt-4">Establish your link for familiar access.</span>
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <Link href="/login" className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-full blur-xl opacity-40 group-hover:opacity-100 transition duration-700"></div>
            <div className="relative flex items-center gap-4 bg-black px-12 py-6 rounded-full leading-none border border-white/10 group-hover:border-transparent transition-all duration-300">
              <span className="text-white text-xl font-black uppercase tracking-widest">Get Started</span>
              <ArrowRight size={24} className="text-white group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </Link>
          <div className="text-slate-500 font-bold text-sm uppercase tracking-[0.3em] flex items-center gap-3">
            <ShieldCheck size={20} className="text-emerald-500" /> Biometric Required
          </div>
        </motion.div>
      </motion.div>

      {/* Nexus Note Section */}
      <section id="nexus" className="w-full max-w-4xl z-10 mb-40 px-4 scroll-mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-10 lg:p-16 border-white/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-30" />
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic mb-8 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-pulse drop-shadow-lg">The Nexus Protocol</h2>
          <p className="text-lg lg:text-xl text-slate-300 leading-relaxed font-light italic">
            "Nexus" represents the convergence of artificial neural networks and global biological data streams. It is a centralized hub where vision, taxonomy, and geospatial intelligence intersect to provide a unified understanding of our planet's biodiversity.
          </p>
        </motion.div>
      </section>

      {/* Project Intelligence Section */}
      <section id="intelligence" className="w-full max-w-6xl z-10 mb-40 px-4 scroll-mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase italic mb-4">Project <span className="text-indigo-500">Intelligence</span></h2>
          <div className="h-1 w-24 bg-indigo-600 mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <FeatureBlock 
            icon={<Fingerprint size={32} className="text-indigo-400" />}
            title="Sovereign Identity"
            desc="Every discovery is hashed and signed to your unique researcher profile, ensuring immutable records of your biological findings."
          />
          <FeatureBlock 
            icon={<Layers size={32} className="text-fuchsia-400" />}
            title="Multi-Layered Inference"
            desc="Our neural network utilizes cross-verified taxonomic data streams to minimize false positives in dense habitat environments."
          />
          <FeatureBlock 
            icon={<Globe size={32} className="text-emerald-400" />}
            title="Regional Research Hubs"
            desc="Synchronize your project data across global tracking zones with real-time geospatial coordinate synchronization."
          />
          <FeatureBlock 
            icon={<ScanEye size={32} className="text-amber-400" />}
            title="Direct Sensor Link"
            desc="Low-latency vision protocols allow for live species tagging directly from mobile or desktop optical sensors."
          />
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech" className="w-full max-w-6xl z-10 mb-40 border-y border-white/5 py-24 bg-white/[0.01] backdrop-blur-3xl rounded-[4rem] scroll-mt-32">
        <div className="text-center mb-16">
          <p className="text-indigo-400 text-xs font-black uppercase tracking-[0.5em] mb-4">The Architecture</p>
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight uppercase">Tech <span className="italic font-light text-slate-500">Nexus</span></h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          <TechItem icon={<Code2 />} name="Next.js 14" desc="React Framework" />
          <TechItem icon={<Cpu />} name="Framer Motion" desc="Fluid Dynamics" />
          <TechItem icon={<Database />} name="MongoDB" desc="Neural Archive" />
          <TechItem icon={<Server />} name="FastAPI" desc="Inference Engine" />
          <TechItem icon={<ShieldCheck />} name="JOSE / JWT" desc="Secure Access" />
          <TechItem icon={<Layers />} name="Tailwind CSS" desc="Aesthetic UI" />
          <TechItem icon={<Activity />} name="Lucide" desc="Vector Assets" />
          <TechItem icon={<Globe />} name="Leaflet" desc="Geo Intelligence" />
        </div>
      </section>

      {/* Developer Spotlight */}
      <section id="developer" className="w-full max-w-6xl z-10 mb-40 text-center px-4 scroll-mt-32">
        <div className="glass-card p-12 lg:p-20 border-indigo-500/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -z-10 group-hover:bg-indigo-600/20 transition-colors" />
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            <h3 className="text-sm font-black text-indigo-400 uppercase tracking-[0.4em] mb-12 text-center">Lead Architect</h3>
            
            {/* Developer Image Area */}
            <div className="relative w-48 h-48 lg:w-64 lg:h-64 mb-12 group/img">
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-600 to-fuchsia-600 rounded-[3rem] blur-2xl opacity-20 group-hover/img:opacity-40 transition-opacity" />
              <div className="relative w-full h-full rounded-[3rem] bg-black/40 border border-white/10 overflow-hidden backdrop-blur-3xl flex items-center justify-center">
                <span className="text-slate-700 font-black uppercase tracking-widest text-xs">Saveen Kumar Image</span>
              </div>
            </div>

            <p className="text-2xl lg:text-4xl font-light leading-relaxed italic text-white/90 mb-12">
              "Crafting a bridge between artificial intelligence and biological discovery. Every pixel, every node, designed for the explorer in you."
            </p>
            
            <div className="flex flex-col items-center">
              <p className="font-black text-white uppercase tracking-[0.4em] text-xl mb-2">Saveen Kumar</p>
              <p className="text-xs text-indigo-400 font-black uppercase tracking-[0.3em]">Lead Synthesis Engineer</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureBlock({ icon, title, desc }) {
  return (
    <div className="glass-card p-10 hover:bg-white/10 transition-all duration-500 group border-white/5 hover:border-indigo-500/30 relative">
      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-30 transition-opacity">
        {icon}
      </div>
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-xl border border-white/10">
        {icon}
      </div>
      <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter italic">{title}</h4>
      <p className="text-slate-400 leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function TechItem({ icon, name, desc }) {
  return (
    <div className="text-center p-6 rounded-3xl hover:bg-white/5 transition-all group">
      <div className="text-slate-500 group-hover:text-indigo-400 transition-colors mb-4 flex justify-center scale-125">
        {icon}
      </div>
      <h5 className="text-white font-bold text-sm tracking-widest uppercase mb-1">{name}</h5>
      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{desc}</p>
    </div>
  );
}
