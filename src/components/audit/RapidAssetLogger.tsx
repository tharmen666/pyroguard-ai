'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  AlertTriangle, 
  ShieldCheck, 
  Flame, 
  Activity, 
  Clock, 
  Zap, 
  CheckCircle,
  Tag,
  Gauge,
  Calendar,
  Sparkles,
  QrCode
} from 'lucide-react';
import { 
  ExtinguisherAsset, 
  CylinderType, 
  GaugePressureStatus, 
  PhysicalCondition,
  Jurisdiction
} from '@/types/fireCompliance';
import { evaluateExtinguisherCompliance } from '@/lib/engines/sans1475Engine';

interface RapidAssetLoggerProps {
  jurisdiction: Jurisdiction;
  assets: ExtinguisherAsset[];
  onAddAsset: (asset: ExtinguisherAsset) => void;
  onRemoveAsset: (id: string) => void;
  onLoadPresetFleet: () => void;
  onVoiceCondemned?: () => void;
  onVoiceHydroOverdue?: () => void;
}

export const RapidAssetLogger: React.FC<RapidAssetLoggerProps> = ({
  jurisdiction,
  assets,
  onAddAsset,
  onRemoveAsset,
  onLoadPresetFleet,
  onVoiceCondemned,
  onVoiceHydroOverdue,
}) => {
  const currentYear = 2026;

  // Quick form state for sub-15-second entry
  const [serialNumber, setSerialNumber] = useState<string>('PG-9021');
  const [locationTag, setLocationTag] = useState<string>('Main Warehouse Floor');
  const [cylinderType, setCylinderType] = useState<CylinderType>('DCP');
  const [capacityKg, setCapacityKg] = useState<number>(9.0);
  const [manufactureYear, setManufactureYear] = useState<number>(currentYear - 4);
  const [lastPressureTestYear, setLastPressureTestYear] = useState<string>('');
  const [gaugePressureStatus, setGaugePressureStatus] = useState<GaugePressureStatus>('Normal');
  const [physicalCondition, setPhysicalCondition] = useState<PhysicalCondition>('Pass');

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();

    const testYearNum = lastPressureTestYear.trim() ? Number(lastPressureTestYear) : undefined;

    const evaluated = evaluateExtinguisherCompliance({
      id: `asset-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      serialNumber: serialNumber.trim() || `PG-${Math.floor(1000 + Math.random() * 9000)}`,
      locationTag: locationTag.trim() || 'General Area',
      cylinderType,
      capacityKg,
      manufactureYear: Number(manufactureYear) || currentYear,
      lastPressureTestYear: testYearNum,
      lastServiceDate: `${currentYear - 1}-10-15`,
      gaugePressureStatus,
      physicalCondition,
    });

    onAddAsset(evaluated);

    // If unit was condemned or hydro overdue, trigger voice alert
    if (evaluated.condemned && onVoiceCondemned) {
      onVoiceCondemned();
    } else if (evaluated.isPressureTestOverdue && onVoiceHydroOverdue) {
      onVoiceHydroOverdue();
    }

    // Reset with next serial and clear test year
    setSerialNumber(`PG-${Math.floor(1000 + Math.random() * 9000)}`);
    setLastPressureTestYear('');
  };

  return (
    <div className="rounded-2xl border-2 border-amber-500/40 bg-slate-900/90 p-4 sm:p-6 shadow-[0_0_35px_rgba(255,179,0,0.15)] space-y-6">
      
      {/* Module Title & Rapid Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,179,0,0.4)]">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">AGENT 02 VIEW</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                15-SEC RAPID LOGGER
              </span>
            </div>
            <h2 className="text-lg font-black text-white tracking-wide">
              SANS 1475 Asset Servicing & Condemnation Registry
            </h2>
          </div>
        </div>

        {/* Load Preset Test Fleet Button */}
        <button
          onClick={onLoadPresetFleet}
          className="flex items-center space-x-1.5 rounded-xl bg-amber-500/20 border border-amber-400 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/30 transition shadow-[0_0_15px_rgba(255,179,0,0.2)]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Load Live 6-Unit Sample Fleet</span>
        </button>
      </div>

      {/* 15-Second Fast Entry Form */}
      <form onSubmit={handleCreateAsset} className="rounded-xl border border-amber-500/30 bg-slate-950/80 p-4 space-y-4">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            Rapid Cylinder Diagnostic Entry
          </span>
          <span className="text-[10px] font-mono text-slate-400">TOUCH-OPTIMIZED</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          {/* Serial Number */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Tag className="h-3 w-3 text-cyan-400" />
              Serial / Barcode
            </label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              placeholder="e.g. PG-9021"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Location Tag */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Location Tag
            </label>
            <input
              type="text"
              value={locationTag}
              onChange={(e) => setLocationTag(e.target.value)}
              placeholder="e.g. Kitchen Line A"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>

          {/* Cylinder Type */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Medium / Type
            </label>
            <select
              value={cylinderType}
              onChange={(e) => {
                const t = e.target.value as CylinderType;
                setCylinderType(t);
                if (t === 'CO2') setCapacityKg(5.0);
                else if (t === 'DCP') setCapacityKg(9.0);
                else setCapacityKg(9.0);
              }}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
            >
              <option value="DCP">DCP (Dry Chemical Powder)</option>
              <option value="CO2">CO2 (Carbon Dioxide - 5Yr Hydro)</option>
              <option value="Water">Water (Hydro 10Yr)</option>
              <option value="FoamAFFF">Foam AFFF</option>
              <option value="WetChemical">Wet Chemical (Kitchen F-Class)</option>
            </select>
          </div>

          {/* Capacity */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Capacity (kg / L)
            </label>
            <select
              value={capacityKg}
              onChange={(e) => setCapacityKg(Number(e.target.value))}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
            >
              <option value="0.9">0.9 kg (Vehicle / Domestic)</option>
              <option value="1.5">1.5 kg</option>
              <option value="2.0">2.0 kg (CO2 / Small DCP)</option>
              <option value="4.5">4.5 kg (Standard DCP)</option>
              <option value="5.0">5.0 kg (Standard CO2)</option>
              <option value="9.0">9.0 kg (Standard Heavy Industrial)</option>
            </select>
          </div>

          {/* Manufacture Year */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="h-3 w-3 text-amber-400" />
              Manufacture Year
            </label>
            <input
              type="number"
              min="1990"
              max={currentYear}
              value={manufactureYear}
              onChange={(e) => setManufactureYear(Number(e.target.value))}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          {/* Last Workshop Pressure Test Year */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3 text-cyan-400" />
              Last Pressure Test
            </label>
            <input
              type="number"
              min="1990"
              max={currentYear}
              value={lastPressureTestYear}
              onChange={(e) => setLastPressureTestYear(e.target.value)}
              placeholder="Defaults to Mfg"
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 font-mono text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Gauge Status */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1">
              <Gauge className="h-3 w-3 text-cyan-400" />
              Pressure Gauge
            </label>
            <select
              value={gaugePressureStatus}
              onChange={(e) => setGaugePressureStatus(e.target.value as GaugePressureStatus)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Normal">Normal (Green Zone)</option>
              <option value="Undercharged">Undercharged (Discharged/Low)</option>
              <option value="Overcharged">Overcharged (Critical Risk)</option>
            </select>
          </div>

          {/* Physical Condition (Condemnation Trigger) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Physical Shell Integrity
            </label>
            <select
              value={physicalCondition}
              onChange={(e) => setPhysicalCondition(e.target.value as PhysicalCondition)}
              className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-rose-400"
            >
              <option value="Pass">Pass (Clean, Intact)</option>
              <option value="Rusted">Rusted (Condemned SANS 1475)</option>
              <option value="DentedCorroded">Dented / Corroded (Condemned)</option>
              <option value="DamagedHose">Damaged Nozzle / Hose</option>
              <option value="MissingSafetyPin">Missing Safety Pin / Seal</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full h-[34px] flex items-center justify-center space-x-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 font-black text-xs uppercase tracking-wider text-slate-950 hover:brightness-110 transition shadow-[0_0_15px_rgba(255,179,0,0.4)]"
            >
              <Plus className="h-4 w-4" />
              <span>Log Cylinder</span>
            </button>
          </div>

        </div>

      </form>

      {/* Asset Table Register */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Active Logged Fleet ({assets.length} Units)</span>
          <span className="font-mono text-[11px] text-cyan-400">SANS 1475 VERIFIED REGISTER</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">Serial / ID</th>
                <th className="py-2.5 px-3">Type & Capacity</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Manufacture / Hydro Due</th>
                <th className="py-2.5 px-3">Status Verdict</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    No cylinders logged yet. Click &quot;Load Live 6-Unit Sample Fleet&quot; or enter one above.
                  </td>
                </tr>
              ) : (
                assets.map((asset) => {
                  let badge = (
                    <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                      <CheckCircle className="h-3 w-3" />
                      <span>PASS / ACTIVE</span>
                    </span>
                  );

                  if (asset.condemned) {
                    badge = (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/60 shadow-[0_0_10px_rgba(255,23,68,0.3)]">
                        <AlertTriangle className="h-3 w-3" />
                        <span>CONDEMNED</span>
                      </span>
                    );
                  } else if (asset.isPressureTestOverdue) {
                    badge = (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-[10px] font-bold text-rose-300 border border-rose-500/60 shadow-[0_0_10px_rgba(255,23,68,0.3)] animate-pulse">
                        <AlertTriangle className="h-3 w-3" />
                        <span>HYDRO TEST OVERDUE ({currentYear - asset.hydrostaticTestDueYear}y)</span>
                      </span>
                    );
                  } else if (asset.serviceActionRequired === 'Hydro_Test_Workshop') {
                    badge = (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/40">
                        <Clock className="h-3 w-3" />
                        <span>HYDRO TEST DUE</span>
                      </span>
                    );
                  } else if (asset.serviceActionRequired === 'Recharge') {
                    badge = (
                      <span className="inline-flex items-center space-x-1 rounded-full bg-cyan-500/20 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/40">
                        <Gauge className="h-3 w-3" />
                        <span>RECHARGE DUE</span>
                      </span>
                    );
                  }

                  return (
                    <tr key={asset.id} className="hover:bg-slate-900/60 transition">
                      <td className="py-2.5 px-3 text-white font-bold">{asset.serialNumber}</td>
                      <td className="py-2.5 px-3 text-cyan-300 font-semibold">
                        {asset.cylinderType} • {asset.capacityKg}kg
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 font-sans">{asset.locationTag}</td>
                      <td className="py-2.5 px-3 text-slate-300">
                        <div className="flex items-center space-x-1.5 text-xs font-mono">
                          <span>Mfg {asset.manufactureYear}</span>
                          {asset.lastPressureTestYear ? (
                            <span className="text-[10px] text-cyan-400 font-semibold">
                              (Tested {asset.lastPressureTestYear})
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500">
                              (Factory Test)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono mt-0.5">
                          Due: <span className={asset.isPressureTestOverdue ? "text-rose-400 font-bold" : "text-amber-400 font-bold"}>
                            {asset.hydrostaticTestDueYear}
                            {asset.isPressureTestOverdue && ` (OVERDUE by ${currentYear - asset.hydrostaticTestDueYear}y)`}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">{badge}</td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => onRemoveAsset(asset.id)}
                          className="rounded p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Remove Asset"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
