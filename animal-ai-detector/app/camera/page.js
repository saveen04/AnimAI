'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, StopCircle, Zap, Loader2, AlertCircle, Sparkles, Activity } from 'lucide-react';
import ResultCard from '@/components/ResultCard';

export default function CameraPage() {
  const [stream, setStream] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = useCallback(async () => {
    setError(null);
    setResult(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Connection failed: Camera access denied or unavailable.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setResult(null);
  }, [stream]);

  const captureAndDetect = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !stream || video.readyState !== 4) {
      setError('Vision sensors not ready. Please activate the camera.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setError('Failed to distill image frame.');
            setLoading(false);
            return;
          }
          const formData = new FormData();
          formData.append('image', blob, 'capture.jpg');
          const res = await fetch('/api/detect', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || 'Detection failed');
          setResult(data);
          setLoading(false);
        },
        'image/jpeg',
        0.95
      );
    } catch (err) {
      setError(err.message || 'Signal lost during analysis.');
      setLoading(false);
    }
  }, [stream]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12 text-center md:text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
          <Zap size={14} />
          <span>Real-time Interface</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-3 italic">AnimAI <span className="text-slate-500 italic">Vision</span></h1>
        <p className="text-slate-400 max-w-xl font-medium">
          Direct link to species identification. Activate vision sensors for instant detection.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-4 overflow-hidden"
          >
            <div className="relative bg-slate-950 rounded-2xl overflow-hidden aspect-video flex items-center justify-center border border-white/5">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {!stream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-slate-950/80 backdrop-blur-sm">
                  <Camera size={48} className="mb-4 opacity-20" />
                  <p className="text-sm font-bold tracking-widest uppercase">Vision Offline</p>
                </div>
              )}

              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-indigo-950/40 backdrop-blur-md">
                  <div className="relative">
                    <Loader2 size={48} className="text-indigo-400 animate-spin" />
                    <Sparkles size={20} className="absolute -top-1 -right-1 text-white animate-pulse" />
                  </div>
                  <p className="mt-4 text-xs font-black tracking-[0.3em] text-white uppercase italic">Analyzing Biosignals</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              {!stream ? (
                <button
                  onClick={startCamera}
                  className="glass-button bg-indigo-600 hover:bg-indigo-500 flex-1 py-4 border-indigo-400/30"
                >
                  <Camera size={20} />
                  Initialize Vision
                </button>
              ) : (
                <>
                  <button
                    onClick={captureAndDetect}
                    disabled={loading}
                    className="glass-button bg-indigo-600 hover:bg-indigo-500 flex-1 py-4 border-indigo-400/30 disabled:opacity-50"
                  >
                    <Zap size={20} />
                    Analyse Frame
                  </button>
                  <button
                    onClick={stopCamera}
                    className="glass-button px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
                  >
                    <StopCircle size={20} />
                  </button>
                </>
              )}
            </div>
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center gap-3"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                 <div className="flex items-center gap-2 mb-4 text-indigo-400 text-xs font-bold uppercase tracking-widest pl-2">
                  <Sparkles size={14} />
                  <span>Latest Discovery</span>
                </div>
                <ResultCard result={result} />
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center text-slate-600"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <Activity size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-500 mb-2 uppercase">Awaiting Feed</h4>
                <p className="text-sm">Capture a frame to begin vision analysis.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
