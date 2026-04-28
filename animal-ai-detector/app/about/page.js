'use client';

import { motion } from 'framer-motion';
import { Cpu, Database, Activity, Globe, Sparkles } from 'lucide-react';

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
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
    <div className="max-w-4xl mx-auto py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Activity size={14} />
          <span>System Architecture</span>
        </div>
        <h1 className="text-5xl font-black tracking-tighter mb-4 italic uppercase">
          The <span className="animated-gradient-text">ANIMAI</span> Core
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Pushing the boundaries of biological identification through state-of-the-art processing systems.
        </p>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 gap-8"
      >
        <AboutSection 
          variants={itemVariants}
          icon={<Cpu className="text-indigo-400" />}
          title="Core Engine"
          content="ANIMAI utilizes the MobileNetV2 architecture, a high-performance convolutional system optimized for accuracy and speed. Through Transfer Learning from the ImageNet database, we achieve research-grade precision in wild animal classification."
        />
        <AboutSection 
          variants={itemVariants}
          icon={<Database className="text-purple-400" />}
          title="Global Registry"
          content="Leveraging MongoDB cluster technology, ANIMAI stores every discovery securely. Our infrastructure handles high-resolution image persistence and metadata tracking for comprehensive conservation research."
        />
        <AboutSection 
          variants={itemVariants}
          icon={<Sparkles className="text-pink-400" />}
          title="Real-time Inference"
          content="Our backend is powered by FastAPI and Uvicorn, delivering sub-second response times. The system processes raw pixel data through custom normalization layers before reaching the core inference matrix."
        />
        <AboutSection 
          variants={itemVariants}
          icon={<Globe className="text-emerald-400" />}
          title="Conservation Impact"
          content="Beyond detection, ANIMAI aims to provide data-driven insights into wildlife populations. By identifying species in their natural habitats, we support scientists and nature enthusiasts in protecting global biodiversity."
        />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-20 glass-card p-8 border-indigo-500/20 text-center"
      >
        <h2 className="text-xl font-bold mb-4 uppercase tracking-[0.2em] text-slate-400">Technical Stack</h2>
        <div className="flex flex-wrap justify-center gap-6">
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-500 tracking-widest uppercase">Next.js 14</div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-500 tracking-widest uppercase">TensorFlow 2.x</div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-500 tracking-widest uppercase">FastAPI</div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-500 tracking-widest uppercase">MongoDB Atlas</div>
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-slate-500 tracking-widest uppercase">Framer Motion</div>
        </div>
      </motion.div>
    </div>
  );
}

function AboutSection({ icon, title, content, variants }) {
  return (
    <motion.div variants={variants} className="glass-card p-8 hover:bg-white/10 transition-colors">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-4 text-white uppercase tracking-tight">{title}</h3>
      <p className="text-slate-400 leading-relaxed font-light">
        "{content}"
      </p>
    </motion.div>
  );
}
