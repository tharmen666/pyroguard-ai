'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Flame, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  AlertTriangle,
  QrCode,
  Scan,
  Compass
} from 'lucide-react';

interface DemoVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRobSpeak?: (phraseId: string) => void;
}

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({ isOpen, onClose, onRobSpeak }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(15);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const animationRef = useRef<number | null>(null);

  const chapters = [
    { title: 'LiDAR Spatial Floor Scan', standard: 'SANS 10400-T', duration: 25, icon: Compass },
    { title: '15-Sec Cylinder Diagnostic', standard: 'SANS 1475-1', duration: 50, icon: Scan },
    { title: 'Instant Condemnation & Quote', standard: 'Commercial Engine', duration: 75, icon: AlertTriangle },
    { title: 'SHA-256 Cryptographic Dossier', standard: 'Web Crypto API', duration: 100, icon: ShieldCheck },
  ];

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        const next = prev + 0.4;
        if (next < 25) setActiveChapter(0);
        else if (next < 50) setActiveChapter(1);
        else if (next < 75) setActiveChapter(2);
        else setActiveChapter(3);
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-2xl border-2 border-cyan-400/50 bg-slate-950 shadow-[0_0_50px_rgba(0,229,255,0.3)]">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 bg-slate-900/90 px-4 py-3 sm:px-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 shadow-[0_0_15px_rgba(255,100,0,0.6)]">
              <Flame className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black tracking-widest text-cyan-400 uppercase">Interactive Field Simulation</span>
                <span className="inline-flex items-center rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/30">
                  LIVE 60 FPS
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                PyroGuard AI Core Platform • Tactical Walkthrough
              </h3>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tactical Video Screen Canvas Simulation */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden flex flex-col items-center justify-center select-none">
          {/* Cyber HUD Grid Background */}
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #00E5FF 1px, transparent 1px), linear-gradient(to right, rgba(0,229,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,229,255,0.05) 1px, transparent 1px)',
              backgroundSize: '24px 24px, 48px 48px, 48px 48px'
            }}
          />

          {/* Dynamic Scene Content based on Chapter */}
          {activeChapter === 0 && (
            <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-4 max-w-lg animate-fadeIn">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-cyan-400 bg-cyan-950/40 shadow-[0_0_30px_rgba(0,229,255,0.5)]">
                <Compass className="h-12 w-12 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
                <div className="absolute inset-0 rounded-full border border-dashed border-cyan-300/40 animate-ping" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">CHAPTER 01 / 04</span>
                <h4 className="text-xl sm:text-2xl font-black text-white">LiDAR Spatial Floor Specifier</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Instant calculation of SANS 10400-T & NZS 4503 density envelopes. 1 unit per 100m²-200m² with 30m maximum travel distance constraints.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="rounded bg-cyan-950 px-3 py-1 font-mono text-xs text-cyan-300 border border-cyan-500/40">
                  Floor Area: 1,450 m²
                </span>
                <span className="rounded bg-emerald-950 px-3 py-1 font-mono text-xs text-emerald-300 border border-emerald-500/40">
                  Hose Reel Throw: 35m Envelope
                </span>
              </div>
            </div>
          )}

          {activeChapter === 1 && (
            <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-4 max-w-lg animate-fadeIn">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-amber-400 bg-amber-950/40 shadow-[0_0_30px_rgba(255,179,0,0.5)]">
                <Scan className="h-12 w-12 text-amber-300 animate-pulse" />
                <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">CHAPTER 02 / 04</span>
                <h4 className="text-xl sm:text-2xl font-black text-white">15-Second Rapid Cylinder Logging</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Touch-optimized tablet interface for field technicians. Quick toggle for pressure gauges, serial tagging, and automated 5/10-year hydrostatic due tracking.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="rounded bg-amber-950 px-3 py-1 font-mono text-xs text-amber-300 border border-amber-500/40">
                  SN: #PG-2024-9021
                </span>
                <span className="rounded bg-rose-950 px-3 py-1 font-mono text-xs text-rose-300 border border-rose-500/40">
                  CO2 5.0kg • 5-Yr Test Due
                </span>
              </div>
            </div>
          )}

          {activeChapter === 2 && (
            <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-4 max-w-lg animate-fadeIn">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-rose-500 bg-rose-950/40 shadow-[0_0_35px_rgba(255,23,68,0.6)]">
                <AlertTriangle className="h-12 w-12 text-rose-400 animate-bounce" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-widest">CHAPTER 03 / 04</span>
                <h4 className="text-xl sm:text-2xl font-black text-white">Instant Condemnation & Quote</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Zero delays. Corroded shells or expired cylinders trigger automated statutory condemnation and instant commercial quote generation.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <span className="rounded bg-rose-900/60 px-3 py-1 font-mono text-xs text-rose-200 border border-rose-500">
                  Condemned: SANS 1475
                </span>
                <span className="rounded bg-emerald-900/60 px-3 py-1 font-mono text-xs text-emerald-200 border border-emerald-500">
                  Quote Generated: R 4,825.00
                </span>
              </div>
            </div>
          )}

          {activeChapter === 3 && (
            <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-4 max-w-lg animate-fadeIn">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-emerald-400 bg-emerald-950/40 shadow-[0_0_40px_rgba(0,230,118,0.6)]">
                <ShieldCheck className="h-12 w-12 text-emerald-300" />
                <div className="absolute inset-0 rounded-2xl border border-emerald-300/40 animate-ping" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest">CHAPTER 04 / 04</span>
                <h4 className="text-xl sm:text-2xl font-black text-white">Cryptographic SHA-256 Dossier</h4>
                <p className="text-xs sm:text-sm text-slate-300">
                  Client-side Web Crypto API seals the manifest. Insurers and fire marshals receive a tamper-evident compliance dossier.
                </p>
              </div>
              <div className="font-mono text-xs text-emerald-400 bg-slate-900/90 px-4 py-1.5 rounded-lg border border-emerald-500/50">
                HASH: 7F8E9A4B...C3D2E1F0 (VERIFIED)
              </div>
            </div>
          )}

          {/* Overlaid Corner Watermarks & Telemetry */}
          <div className="absolute top-4 left-4 flex items-center space-x-2 font-mono text-[11px] text-cyan-400/80 bg-slate-900/80 px-2.5 py-1 rounded border border-cyan-500/30">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span>ROB AI ENGINE v1.0.4 • DUAL JURISDICTION</span>
          </div>

          <div className="absolute top-4 right-4 font-mono text-[11px] text-amber-400/80 bg-slate-900/80 px-2.5 py-1 rounded border border-amber-500/30">
            FPS: 60 • LATENCY: 0ms (LOCAL EDGE)
          </div>

          {/* Video Control Overlay Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-4 flex flex-col space-y-2">
            
            {/* Progress Bar with Chapter Markers */}
            <div 
              className="relative h-2 w-full bg-slate-800 rounded-full cursor-pointer overflow-hidden border border-slate-700"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newProgress = (clickX / rect.width) * 100;
                setProgress(newProgress);
              }}
            >
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-100"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between text-white text-xs pt-1">
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition shadow-[0_0_10px_rgba(0,229,255,0.8)]"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
                </button>
                <button 
                  onClick={() => setProgress(0)}
                  className="p-1 text-slate-300 hover:text-white transition"
                  title="Restart"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1 text-slate-300 hover:text-white transition"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-cyan-400" />}
                </button>
                <span className="font-mono text-slate-400">
                  {Math.floor(progress * 0.02)}:{(Math.floor(progress * 1.2) % 60).toString().padStart(2, '0')} / 02:00
                </span>
              </div>

              {/* Chapter Buttons */}
              <div className="hidden sm:flex items-center space-x-1">
                {chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveChapter(idx);
                      setProgress(idx === 0 ? 5 : idx === 1 ? 30 : idx === 2 ? 60 : 85);
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center space-x-1 ${
                      activeChapter === idx
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <span>{ch.title}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                  1080p HD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Quick Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 bg-slate-900 px-4 py-3 sm:px-6">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            <span className="text-white font-semibold">Ready to test live?</span> Close this walkthrough to use the interactive tablet calculator, cylinder logger, and quote builder.
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-xs font-black uppercase tracking-wider text-slate-950 shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:brightness-110 transition"
          >
            Launch Field Audit Tool
          </button>
        </div>

      </div>
    </div>
  );
};
