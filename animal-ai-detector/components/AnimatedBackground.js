'use client';

import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div 
        animate={{ 
          x: [0, 100, -100, 0], 
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] smooth-gpu" 
      />
      <motion.div 
        animate={{ 
          x: [0, -120, 80, 0], 
          y: [0, 100, -80, 0],
          scale: [1, 0.8, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/20 rounded-full blur-[120px] smooth-gpu" 
      />
      <motion.div 
        animate={{ 
          x: [0, 50, -50, 0], 
          y: [0, 80, -120, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[100px] smooth-gpu" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.2, 0.1]
                    }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 via-transparent to-pink-500/5 smooth-gpu"
      />
    </div>
  );
}
