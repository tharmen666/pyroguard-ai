'use client';

import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Languages, 
  Mic, 
  ShieldCheck, 
  AlertCircle,
  Radio,
  Flame,
  UserCheck,
  PlayCircle,
  Headphones
} from 'lucide-react';
import { 
  RobAccent, 
  RobSpeechController, 
  ROB_VOICE_SCRIPTS,
  playTacticalCommsChime
} from '@/lib/audio/voiceAvatarRob';

interface RobInspectorAvatarProps {
  currentAccent: RobAccent;
  onAccentChange: (accent: RobAccent) => void;
  lastEventTrigger?: string;
}

export const RobInspectorAvatar: React.FC<RobInspectorAvatarProps> = ({
  currentAccent,
  onAccentChange,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeSpeechText, setActiveSpeechText] = useState<string>('');
  const [audioBarHeights, setAudioBarHeights] = useState<number[]>([40, 60, 80, 50, 70, 90, 60, 40]);
  const [hasTestedAudio, setHasTestedAudio] = useState<boolean>(false);

  // Audio equalizer animation when Rob speaks
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSpeaking) {
      interval = setInterval(() => {
        setAudioBarHeights(
          Array.from({ length: 8 }, () => Math.floor(Math.random() * 75) + 25)
        );
      }, 90);
    } else {
      setAudioBarHeights([20, 25, 20, 30, 20, 25, 20, 20]);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  const handleSpeakPreset = (scriptId: string) => {
    setHasTestedAudio(true);
    const preset = ROB_VOICE_SCRIPTS.find(s => s.id === scriptId) || ROB_VOICE_SCRIPTS[0];
    const textToSpeak = preset.text[currentAccent];
    setActiveSpeechText(textToSpeak);

    RobSpeechController.speak(
      textToSpeak,
      currentAccent,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleQuickAudioTest = () => {
    setHasTestedAudio(true);
    playTacticalCommsChime();
    const testText = currentAccent === 'NZ_ENGLISH'
      ? "Kia ora! Audio system online. Rob is ready to inspect."
      : "Howzit! Audio system verified. Rob is operational.";
    setActiveSpeechText(testText);
    RobSpeechController.speak(
      testText,
      currentAccent,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const handleStopSpeaking = () => {
    RobSpeechController.stop();
    setIsSpeaking(false);
  };

  const accents: { id: RobAccent; label: string; flag: string; desc: string }[] = [
    { id: 'ZA_ENGLISH', label: 'South Africa (English)', flag: '🇿🇦', desc: 'Lekker SA Tone' },
    { id: 'NZ_ENGLISH', label: 'New Zealand (Kiwi)', flag: '🇳🇿', desc: 'Sweet-As FENZ Tone' },
    { id: 'ISIZULU', label: 'isiZulu', flag: '🇿🇦', desc: 'Sawubona' },
    { id: 'ISIXHOSA', label: 'isiXhosa', flag: '🇿🇦', desc: 'Molo Mhlobo' },
    { id: 'AFRIKAANS', label: 'Afrikaans', flag: '🇿🇦', desc: 'Goeiedag' },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border-2 border-cyan-400/60 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-4 shadow-[0_0_30px_rgba(0,229,255,0.25)] space-y-3">
      
      {/* Background Cyber Circuit Glow */}
      <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-cyan-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-36 w-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Avatar Visual & Identity */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative">
            {/* Glowing Ring */}
            <div className={`absolute -inset-1 rounded-full blur-md transition-all duration-300 ${
              isSpeaking 
                ? 'bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 opacity-90 animate-pulse' 
                : 'bg-cyan-500/40 opacity-50'
            }`} />

            {/* Avatar Head Icon */}
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-300 bg-slate-900 shadow-inner">
              <div className="relative flex items-center justify-center">
                <UserCheck className="h-8 w-8 text-cyan-300" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-slate-950 shadow-[0_0_8px_#00E676]">
                  ✓
                </span>
              </div>
            </div>

            {/* Live Indicator */}
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-400 shadow-[0_0_10px_#00E676]" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-black tracking-wide text-white flex items-center gap-1.5">
                ROB <span className="text-xs font-mono font-normal text-cyan-400 border border-cyan-500/40 rounded px-1.5 py-0.2 bg-cyan-950/60">AI CO-AUDITOR</span>
              </h3>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                SAQCC & FENZ DUAL CORE
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Autonomous Voice Assistant • Multilingual Field Companion
            </p>

            {/* Equalizer Frequency Bars */}
            <div className="flex items-center space-x-1 mt-2 h-4">
              {audioBarHeights.map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${
                    isSpeaking 
                      ? 'bg-gradient-to-t from-cyan-400 to-emerald-400 shadow-[0_0_6px_#00E5FF]' 
                      : 'bg-slate-700'
                  }`}
                  style={{ height: `${h}%` }}
                />
              ))}
              <span className="text-[10px] font-mono text-cyan-400/80 ml-2">
                {isSpeaking ? 'TRANSMITTING AUDIO VOICE...' : 'SPEECH STANDBY (TAP TO TEST)'}
              </span>
            </div>
          </div>
        </div>

        {/* Multilingual Selector & Speech Trigger Hub */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          
          {/* Accent & Language Dropdown */}
          <div className="flex items-center space-x-2 rounded-xl bg-slate-950/80 border border-cyan-500/40 p-1.5">
            <Languages className="h-4 w-4 text-cyan-400 ml-1.5 shrink-0" />
            <select
              value={currentAccent}
              onChange={(e) => {
                const newAccent = e.target.value as RobAccent;
                onAccentChange(newAccent);
              }}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-2"
            >
              {accents.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-slate-900 text-white">
                  {acc.flag} {acc.label}
                </option>
              ))}
            </select>
          </div>

          {/* Quick Voice Play Trigger Buttons */}
          <div className="flex items-center space-x-1.5">
            
            {/* Audio Check / Unlock Button */}
            <button
              onClick={handleQuickAudioTest}
              className="flex items-center justify-center space-x-1 rounded-xl bg-slate-800 border border-cyan-400/50 px-2.5 py-2 text-xs font-bold text-cyan-300 hover:bg-slate-700 transition shadow-[0_0_10px_rgba(0,229,255,0.2)]"
              title="Click to test speaker / unlock browser audio"
            >
              <Headphones className="h-3.5 w-3.5 text-cyan-400" />
              <span>TEST VOICE</span>
            </button>

            <button
              onClick={() => handleSpeakPreset('welcome')}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2 text-xs font-black text-slate-950 hover:brightness-110 shadow-[0_0_15px_rgba(0,229,255,0.4)] transition"
              title="Rob Welcome Greeting"
            >
              <Mic className="h-3.5 w-3.5" />
              <span>GREET</span>
            </button>

            <button
              onClick={() => handleSpeakPreset('spatial_pass')}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition shadow-[0_0_12px_rgba(0,230,118,0.3)]"
              title="Test Spatial Clearance Speech"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>PASS</span>
            </button>

            <button
              onClick={() => handleSpeakPreset('condemned_alert')}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 rounded-xl bg-rose-500/20 border border-rose-400 px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/30 transition shadow-[0_0_12px_rgba(255,23,68,0.3)]"
              title="Test Condemnation Warning Speech"
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>CONDEMN</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="flex items-center justify-center rounded-xl bg-rose-600 p-2 text-white hover:bg-rose-500 transition shadow-[0_0_15px_rgba(255,23,68,0.6)]"
                title="Stop Audio"
              >
                <VolumeX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Subtitles / Active Utterance Banner */}
      {activeSpeechText && (
        <div className="rounded-lg border border-cyan-500/30 bg-slate-950/90 px-3.5 py-2 font-mono text-xs text-cyan-200 flex items-start space-x-2">
          <Radio className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5 animate-pulse" />
          <p className="flex-1 leading-relaxed">
            <span className="text-cyan-400 font-bold uppercase mr-1.5">[ROB TRANSMISSION]:</span>
            &ldquo;{activeSpeechText}&rdquo;
          </p>
        </div>
      )}

    </div>
  );
};
