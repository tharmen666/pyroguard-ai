'use client';

import React from 'react';
import { 
  Building2, 
  Ruler, 
  ShieldAlert, 
  ShieldCheck, 
  Compass, 
  Layers, 
  AlertTriangle,
  Waves,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  Jurisdiction, 
  OccupancyClass, 
  SpatialCalculationResult,
  ZAOccupancyClass,
  NZOccupancyClass
} from '@/types/fireCompliance';
import { RULES_VERIFIED, ZA_OCCUPANCY_METADATA } from '@/lib/engines/sans10400TEngine';
import { NZ_OCCUPANCY_METADATA } from '@/lib/engines/nzs4503Engine';

interface SpatialCalculatorProps {
  jurisdiction: Jurisdiction;
  floorAreaM2: number;
  occupancyClass: OccupancyClass;
  extinguishersInstalled: number;
  hoseReelsInstalled: number;
  calculationResult: SpatialCalculationResult;
  onFloorAreaChange: (area: number) => void;
  onOccupancyChange: (occupancy: OccupancyClass) => void;
  onExtinguishersInstalledChange: (count: number) => void;
  onHoseReelsInstalledChange: (count: number) => void;
  onVoiceAnnounce?: () => void;
}

export const SpatialCalculator: React.FC<SpatialCalculatorProps> = ({
  jurisdiction,
  floorAreaM2,
  occupancyClass,
  extinguishersInstalled,
  hoseReelsInstalled,
  calculationResult,
  onFloorAreaChange,
  onOccupancyChange,
  onExtinguishersInstalledChange,
  onHoseReelsInstalledChange,
  onVoiceAnnounce,
}) => {
  const isZA = jurisdiction === 'ZA_SANS';

  const zaOptions: { value: ZAOccupancyClass; label: string; desc: string }[] = [
    { value: 'J1', label: 'J1 - High-Risk Storage', desc: '1 unit per 100m²' },
    { value: 'J2', label: 'J2 - Moderate-Risk Storage', desc: '1 unit per 200m²' },
    { value: 'J3', label: 'J3 - Low-Risk Storage', desc: '1 unit per 250m²' },
    { value: 'G1', label: 'G1 - Offices', desc: '1 unit per 200m²' },
    { value: 'A1', label: 'A1 - Entertainment & Public Gathering (>50)', desc: '1 unit per 100m²' },
    { value: 'A2', label: 'A2 - Theatrical & Indoor Venues', desc: '1 unit per 100m²' },
  ];

  const nzOptions: { value: NZOccupancyClass; label: string; desc: string }[] = [
    { value: 'NZ_HIGH', label: 'High Fire Hazard (Chemicals, Timber)', desc: '1 unit per 100m² (20m travel)' },
    { value: 'NZ_MEDIUM', label: 'Medium Fire Hazard (Commercial Kitchens)', desc: '1 unit per 150m² (25m travel)' },
    { value: 'NZ_LOW', label: 'Low Fire Hazard (Offices, Schools)', desc: '1 unit per 250m² (30m travel)' },
  ];

  return (
    <div className="rounded-2xl border-2 border-cyan-500/40 bg-slate-900/90 p-4 sm:p-6 shadow-[0_0_35px_rgba(0,229,255,0.15)] space-y-6">
      
      {/* Module Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">AGENT 01 VIEW</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                {isZA ? 'SANS 10400-T SPECIFIER' : 'NZS 4503 SPECIFIER'}
              </span>
            </div>
            <h2 className="text-lg font-black text-white tracking-wide">
              Spatial Floor & Coverage Engine
            </h2>
          </div>
        </div>

        {/* Clearance Status Pill */}
        <div className="flex items-center space-x-2">
          {calculationResult.complianceClearance ? (
            <div className="flex items-center space-x-2 rounded-xl bg-emerald-500/20 border border-emerald-400 px-3.5 py-1.5 shadow-[0_0_20px_rgba(0,230,118,0.3)]">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <div>
                <div className="text-[10px] font-mono font-bold text-emerald-300 uppercase">STATUS</div>
                <div className="text-xs font-black text-white">SPATIAL CLEARANCE PASSED</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2 rounded-xl bg-rose-500/20 border border-rose-500 px-3.5 py-1.5 shadow-[0_0_20px_rgba(255,23,68,0.3)]">
              <ShieldAlert className="h-5 w-5 text-rose-400 animate-pulse" />
              <div>
                <div className="text-[10px] font-mono font-bold text-rose-300 uppercase">STATUS</div>
                <div className="text-xs font-black text-rose-200">SHORTFALL DETECTED</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Spatial Controls */}
        <div className="space-y-4">
          
          {/* Floor Area Slider & Numerical Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
              <label className="flex items-center space-x-1.5 text-cyan-300">
                <Ruler className="h-4 w-4" />
                <span>Total Protected Floor Area (m²)</span>
              </label>
              <div className="flex items-center space-x-1">
                <input
                  type="number"
                  min="0"
                  max="50000"
                  step="50"
                  value={floorAreaM2}
                  onChange={(e) => onFloorAreaChange(Math.max(0, Number(e.target.value) || 0))}
                  className="w-24 rounded-lg bg-slate-950 border border-cyan-400/50 px-2.5 py-1 text-right font-mono text-sm font-black text-cyan-300 focus:outline-none focus:border-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                />
                <span className="font-mono text-xs text-slate-400">m²</span>
              </div>
            </div>

            <input
              type="range"
              min="50"
              max="5000"
              step="25"
              value={Math.min(5000, floorAreaM2)}
              onChange={(e) => onFloorAreaChange(Number(e.target.value))}
              className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>50 m²</span>
              <span>1,250 m²</span>
              <span>2,500 m²</span>
              <span>5,000+ m²</span>
            </div>
          </div>

          {/* Occupancy Class Selector */}
          <div className="space-y-1.5">
            <label className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300">
              <Building2 className="h-4 w-4" />
              <span>Occupancy Classification & Risk Category</span>
            </label>
            <select
              value={occupancyClass}
              onChange={(e) => onOccupancyChange(e.target.value as OccupancyClass)}
              className="w-full rounded-xl bg-slate-950 border border-cyan-500/40 p-2.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-400 cursor-pointer shadow-inner"
            >
              {isZA ? (
                zaOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {opt.label} • ({opt.desc})
                  </option>
                ))
              ) : (
                nzOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
                    {opt.label} • ({opt.desc})
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Installed Assets Steppers */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">Extinguishers Installed</span>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onExtinguishersInstalledChange(Math.max(0, extinguishersInstalled - 1))}
                  className="h-8 w-8 rounded-lg bg-slate-800 text-white font-black hover:bg-slate-700 transition"
                >
                  -
                </button>
                <span className="font-mono text-lg font-black text-cyan-300">
                  {extinguishersInstalled}
                </span>
                <button
                  onClick={() => onExtinguishersInstalledChange(extinguishersInstalled + 1)}
                  className="h-8 w-8 rounded-lg bg-cyan-600 text-slate-950 font-black hover:bg-cyan-500 transition shadow-[0_0_10px_rgba(0,229,255,0.4)]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-slate-700 bg-slate-950/60 p-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block">Hose Reels Installed</span>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onHoseReelsInstalledChange(Math.max(0, hoseReelsInstalled - 1))}
                  className="h-8 w-8 rounded-lg bg-slate-800 text-white font-black hover:bg-slate-700 transition"
                >
                  -
                </button>
                <span className="font-mono text-lg font-black text-amber-300">
                  {hoseReelsInstalled}
                </span>
                <button
                  onClick={() => onHoseReelsInstalledChange(hoseReelsInstalled + 1)}
                  className="h-8 w-8 rounded-lg bg-amber-500 text-slate-950 font-black hover:bg-amber-400 transition shadow-[0_0_10px_rgba(255,179,0,0.4)]"
                >
                  +
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Real-Time Deterministic Output Dashboard */}
        <div className="rounded-xl border border-cyan-500/30 bg-slate-950/80 p-4 flex flex-col justify-between space-y-4">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                Deterministic Output Matrix
              </span>
              <span className="text-[10px] font-mono text-slate-400">RULE-BASED · NO AI</span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              
              <div className="rounded-lg bg-slate-900 border border-slate-800 p-2.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Required Units</div>
                <div className="text-xl font-mono font-black text-white mt-0.5">
                  {calculationResult.extinguishersRequired}
                </div>
                <div className="text-[9px] text-cyan-400 font-mono mt-0.5">
                  1 per {isZA ? (ZA_OCCUPANCY_METADATA[occupancyClass as ZAOccupancyClass]?.sqmPerExtinguisher || 200) : (NZ_OCCUPANCY_METADATA[occupancyClass as NZOccupancyClass]?.sqmPerExtinguisher || 150)}m²
                </div>
              </div>

              <div className={`rounded-lg p-2.5 border ${
                calculationResult.extinguisherShortfall > 0 
                  ? 'bg-rose-950/40 border-rose-500/60 shadow-[0_0_15px_rgba(255,23,68,0.2)]' 
                  : 'bg-emerald-950/40 border-emerald-500/60'
              }`}>
                <div className="text-[10px] text-slate-300 font-bold uppercase">Extinguisher Shortfall</div>
                <div className={`text-xl font-mono font-black mt-0.5 ${
                  calculationResult.extinguisherShortfall > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {calculationResult.extinguisherShortfall > 0 ? `${calculationResult.extinguisherShortfall} short` : 'CLEARED'}
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                  {calculationResult.extinguishersInstalled} installed
                </div>
              </div>

              <div className={`rounded-lg p-2.5 border ${
                calculationResult.hoseReelShortfall > 0 
                  ? 'bg-amber-950/40 border-amber-500/60 shadow-[0_0_15px_rgba(255,179,0,0.2)]' 
                  : 'bg-slate-900 border-slate-800'
              }`}>
                <div className="text-[10px] text-slate-300 font-bold uppercase">Hose Reels Required</div>
                <div className="text-xl font-mono font-black text-amber-300 mt-0.5">
                  {calculationResult.hoseReelsRequired}
                </div>
                <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {calculationResult.hoseReelShortfall > 0 ? `${calculationResult.hoseReelShortfall} short` : 'Coverage OK'}
                </div>
              </div>

            </div>

            {/* Travel Envelopes & Spatial Rules */}
            <div className="rounded-lg bg-slate-900/90 border border-slate-800 p-3 space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Ruler className="h-3.5 w-3.5 text-cyan-400" />
                  Max Travel to Extinguisher:
                </span>
                <span className="font-bold text-cyan-300">
                  ≤ {calculationResult.maxTravelDistanceM} meters
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Waves className="h-3.5 w-3.5 text-amber-400" />
                  Hydraulic Hose Reel Coverage:
                </span>
                <span className="font-bold text-amber-300">
                  {calculationResult.hoseReelCoverageRadiusM}m total radius (30m hose + 5m stream)
                </span>
              </div>
              {!RULES_VERIFIED && (
                <div className="flex items-start gap-1.5 pt-1 text-[10px] text-amber-300/90">
                  <Info className="h-3.5 w-3.5 shrink-0" />
                  <span>Density and distance values pending verification against current SANS editions by a registered practitioner.</span>
                </div>
              )}
            </div>
          </div>

          {/* Statutory Notes & Voice Trigger */}
          <div className="space-y-2">
            {calculationResult.deficiencyNotes.length > 0 && (
              <div className="rounded-lg bg-slate-900/60 p-2 text-[11px] text-slate-300 space-y-1 border-l-2 border-amber-400">
                {calculationResult.deficiencyNotes.slice(0, 2).map((note, idx) => (
                  <p key={idx} className="leading-snug">{note}</p>
                ))}
              </div>
            )}

            {onVoiceAnnounce && (
              <button
                onClick={onVoiceAnnounce}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-cyan-950/60 border border-cyan-400/60 py-2 px-3 text-xs font-bold text-cyan-300 hover:bg-cyan-900/60 transition shadow-[0_0_12px_rgba(0,229,255,0.2)]"
              >
                <span>Have Rob Announce Spatial Audit Verdict</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
