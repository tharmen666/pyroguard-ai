'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Flame, 
  ShieldCheck, 
  Compass, 
  Activity, 
  BadgeDollarSign, 
  FileCheck, 
  Play, 
  MapPin, 
  UserCheck, 
  Globe2, 
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Tablet,
  Smartphone,
  Monitor
} from 'lucide-react';

import { 
  Jurisdiction, 
  OccupancyClass, 
  ExtinguisherAsset, 
  HoseReelAsset, 
  AuditManifestDossier,
  ZAOccupancyClass,
  NZOccupancyClass
} from '@/types/fireCompliance';
import { calculateSANS10400TRequirements } from '@/lib/engines/sans10400TEngine';
import { calculateNZS4503Requirements } from '@/lib/engines/nzs4503Engine';
import { 
  summarizeFleet, 
  generateDynamicCommercialQuote, 
  evaluateExtinguisherCompliance 
} from '@/lib/engines/sans1475Engine';
import { RobAccent, RobSpeechController } from '@/lib/audio/voiceAvatarRob';

// Components
import { RobInspectorAvatar } from '@/components/avatar/RobInspectorAvatar';
import { DemoVideoModal } from '@/components/video/DemoVideoModal';
import { SpatialCalculator } from '@/components/audit/SpatialCalculator';
import { RapidAssetLogger } from '@/components/audit/RapidAssetLogger';
import { CommercialQuoteCard } from '@/components/audit/CommercialQuoteCard';
import { DossierPreview } from '@/components/audit/DossierPreview';

export default function PyroGuardApp() {
  // Global State
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('ZA_SANS');
  const [activeTab, setActiveTab] = useState<'spatial' | 'logger' | 'quote' | 'dossier'>('spatial');
  const [isDemoVideoOpen, setIsDemoVideoOpen] = useState<boolean>(false);
  const [robAccent, setRobAccent] = useState<RobAccent>('ZA_ENGLISH');

  // Facility Metadata
  // Fictional demo facility — never use a real company, brand or street address here.
  const [facilityName, setFacilityName] = useState<string>('Demo Site: Harbourline Logistics & Forecourt Hub');
  const [facilityAddress, setFacilityAddress] = useState<string>('Unit 4, Example Industrial Park, Montague Gardens, Cape Town');
  const [gpsCoordinates, setGpsCoordinates] = useState<string>('33.86° S, 18.52° E');
  const [clientRepresentative, setClientRepresentative] = useState<string>('M. Khumalo (Regional Ops)');

  // Spatial State
  const [floorAreaM2, setFloorAreaM2] = useState<number>(1450);
  const [zaOccupancy, setZaOccupancy] = useState<ZAOccupancyClass>('J1');
  const [nzOccupancy, setNzOccupancy] = useState<NZOccupancyClass>('NZ_HIGH');

  // Asset Fleet State
  const currentYear = 2026;
  const [extinguisherFleet, setExtinguisherFleet] = useState<ExtinguisherAsset[]>([]);
  const [hoseReels, setHoseReels] = useState<HoseReelAsset[]>([
    {
      id: 'hr-1',
      locationTag: 'Warehouse Loading Bay A',
      hoseLengthM: 30,
      nozzleCondition: 'Good',
      flowPressureBar: 2.8,
      runOutObstructed: false,
      serviceDate: `${currentYear}-01-10`,
      passed: true,
    },
    {
      id: 'hr-2',
      locationTag: 'Chemical Staging Bay 2',
      hoseLengthM: 30,
      nozzleCondition: 'Good',
      flowPressureBar: 2.5,
      runOutObstructed: false,
      serviceDate: `${currentYear}-01-10`,
      passed: true,
    },
  ]);

  // Load Initial Preset Fleet on Mount
  const loadPresetFleet = () => {
    const preset = [
      evaluateExtinguisherCompliance({
        id: 'asset-1',
        serialNumber: 'PG-ZA-1082',
        locationTag: 'Flammable Stores Bay 1',
        cylinderType: 'DCP',
        capacityKg: 9.0,
        manufactureYear: currentYear - 3,
        lastServiceDate: `${currentYear - 1}-08-12`,
        gaugePressureStatus: 'Normal',
        physicalCondition: 'Pass',
      }),
      evaluateExtinguisherCompliance({
        id: 'asset-2',
        serialNumber: 'PG-ZA-1083',
        locationTag: 'Electrical Substation',
        cylinderType: 'CO2',
        capacityKg: 5.0,
        manufactureYear: currentYear - 5, // 5-year cycle due!
        lastServiceDate: `${currentYear - 1}-08-12`,
        gaugePressureStatus: 'Normal',
        physicalCondition: 'Pass',
      }),
      evaluateExtinguisherCompliance({
        id: 'asset-3',
        serialNumber: 'PG-ZA-1084',
        locationTag: 'Forecourt Pump Island North',
        cylinderType: 'DCP',
        capacityKg: 9.0,
        manufactureYear: currentYear - 12,
        lastServiceDate: `${currentYear - 1}-04-05`,
        gaugePressureStatus: 'Undercharged',
        physicalCondition: 'Rusted', // Condemned!
      }),
      evaluateExtinguisherCompliance({
        id: 'asset-4',
        serialNumber: 'PG-ZA-1085',
        locationTag: 'Admin Reception Hall',
        cylinderType: 'Water',
        capacityKg: 9.0,
        manufactureYear: currentYear - 2,
        lastServiceDate: `${currentYear - 1}-10-20`,
        gaugePressureStatus: 'Normal',
        physicalCondition: 'Pass',
      }),
      evaluateExtinguisherCompliance({
        id: 'asset-5',
        serialNumber: 'PG-ZA-1086',
        locationTag: 'Dispatch Loading Dock',
        cylinderType: 'DCP',
        capacityKg: 9.0,
        manufactureYear: currentYear - 1,
        lastServiceDate: `${currentYear - 1}-11-01`,
        gaugePressureStatus: 'Normal',
        physicalCondition: 'Pass',
      }),
      evaluateExtinguisherCompliance({
        id: 'asset-6',
        serialNumber: 'PG-ZA-1087',
        locationTag: 'Forklift Charging Bay',
        cylinderType: 'CO2',
        capacityKg: 5.0,
        manufactureYear: currentYear - 6,
        lastServiceDate: `${currentYear - 1}-02-15`,
        gaugePressureStatus: 'Overcharged',
        physicalCondition: 'DamagedHose',
      }),
    ];
    setExtinguisherFleet(preset);
  };

  useEffect(() => {
    loadPresetFleet();
  }, []);

  // Sync Jurisdiction change with Rob's accent
  const handleJurisdictionChange = (newJur: Jurisdiction) => {
    setJurisdiction(newJur);
    if (newJur === 'NZ_FENZ') {
      setRobAccent('NZ_ENGLISH');
    } else {
      setRobAccent('ZA_ENGLISH');
    }
  };

  // Compute Spatial Calculation via pure engines
  const spatialCalculation = useMemo(() => {
    const installedExtCount = extinguisherFleet.length;
    const installedHoseReelCount = hoseReels.length;

    if (jurisdiction === 'ZA_SANS') {
      return calculateSANS10400TRequirements(
        floorAreaM2,
        zaOccupancy,
        installedExtCount,
        installedHoseReelCount
      );
    } else {
      return calculateNZS4503Requirements(
        floorAreaM2,
        nzOccupancy,
        installedExtCount,
        installedHoseReelCount
      );
    }
  }, [jurisdiction, floorAreaM2, zaOccupancy, nzOccupancy, extinguisherFleet.length, hoseReels.length]);

  // Compute Fleet Summary
  const fleetSummary = useMemo(() => {
    return summarizeFleet(extinguisherFleet, hoseReels);
  }, [extinguisherFleet, hoseReels]);

  // Compute Dynamic Commercial Quote
  const commercialQuote = useMemo(() => {
    return generateDynamicCommercialQuote(
      jurisdiction,
      fleetSummary,
      spatialCalculation.extinguisherShortfall,
      spatialCalculation.hoseReelShortfall
    );
  }, [jurisdiction, fleetSummary, spatialCalculation.extinguisherShortfall, spatialCalculation.hoseReelShortfall]);

  // Complete Audit Manifest Dossier
  const auditManifest: AuditManifestDossier = useMemo(() => {
    return {
      auditId: 'PG-DEMO-AUDIT-0001',
      facilityName,
      facilityAddress,
      gpsCoordinates,
      clientRepresentative,
      leadAuditor: {
        name: 'Ron (SAQCC 1475 Registered)',
        // Placeholder numbers: a real registration number must never appear in a public demo.
        registrationNumber: jurisdiction === 'ZA_SANS' ? 'SAQCC-DEMO-0001' : 'NZ-IQP-DEMO-0001',
        organization: 'PyroGuard Compliance Network',
      },
      technicalArchitect: {
        name: 'Desigan Tharmen',
        system: 'PyroGuard Deterministic Core AI',
      },
      timestamp: '2026-10-24 03:30:00',
      jurisdiction,
      spatialAudit: spatialCalculation,
      extinguisherFleet,
      hoseReels,
      fleetSummary,
      commercialQuote: commercialQuote.items,
      grandTotal: commercialQuote.grandTotal,
      currency: commercialQuote.currency,
      clientSha256Signature: '',
      // The declaration must follow the actual results: never claim compliance while
      // there is a shortfall or a unit still needs work.
      regulatoryDeclarations: [
        `${
          jurisdiction === 'ZA_SANS'
            ? 'Assessed against SANS 10400-T, SANS 1475 Parts 1 & 2 and City of Cape Town Fire Safety By-Laws'
            : 'Assessed against NZS 4503:2005 and FENZ Building Warrant of Fitness requirements'
        }: ${
          spatialCalculation.complianceClearance &&
          fleetSummary.condemnedUnits === 0 &&
          fleetSummary.rechargeRequired === 0 &&
          fleetSummary.hydroTestWorkshopRequired === 0 &&
          fleetSummary.hoseReelsDefective === 0
            ? 'no deficiencies recorded.'
            : 'deficiencies recorded; see the corrective works quote.'
        } Subject to review and sign-off by the registered technician.`,
      ],
    };
  }, [
    facilityName,
    facilityAddress,
    gpsCoordinates,
    clientRepresentative,
    jurisdiction,
    spatialCalculation,
    extinguisherFleet,
    hoseReels,
    fleetSummary,
    commercialQuote,
  ]);

  // Handlers for Asset Actions
  const handleAddAsset = (asset: ExtinguisherAsset) => {
    setExtinguisherFleet(prev => [asset, ...prev]);
  };

  const handleRemoveAsset = (id: string) => {
    setExtinguisherFleet(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top HUD Context Bar */}
      <header className="sticky top-0 z-40 border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md px-3 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Brand & Lead Identity */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center space-x-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-rose-600 via-amber-500 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(255,100,0,0.5)]">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                  <Flame className="h-5 w-5 text-amber-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                    PYROGUARD <span className="text-cyan-400">AI</span>
                  </h1>
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[9px] font-mono font-bold text-rose-400 border border-rose-500/40">
                    SPRINT 1
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-emerald-400" />
                  <span>Ron (SAQCC Fire)</span>
                  <span className="text-slate-600">•</span>
                  <span>Desigan (AI Arch)</span>
                </div>
              </div>
            </div>

            {/* Mobile Watch Demo Button */}
            <button
              onClick={() => setIsDemoVideoOpen(true)}
              className="md:hidden flex items-center space-x-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-2.5 py-1.5 text-[11px] font-black text-slate-950 shadow-[0_0_12px_rgba(0,229,255,0.4)]"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>DEMO</span>
            </button>
          </div>

          {/* Facility & GPS Telemetry */}
          <div className="hidden lg:flex items-center space-x-4 text-xs font-mono text-slate-300 bg-slate-900/80 px-4 py-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-400 uppercase text-[10px]">FACILITY:</span>
              <span className="font-bold text-white max-w-[200px] truncate">{facilityName}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-slate-400 border-l border-slate-800 pl-3">
              <MapPin className="h-3.5 w-3.5 text-cyan-400" />
              <span>{gpsCoordinates}</span>
            </div>
          </div>

          {/* Interactive Standard Switcher & Demo Video Trigger */}
          <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
            
            {/* Dual Statutory Switcher */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-cyan-500/30">
              <button
                onClick={() => handleJurisdictionChange('ZA_SANS')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                  jurisdiction === 'ZA_SANS'
                    ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-[0_0_12px_rgba(255,179,0,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇿🇦 SANS 10400-T</span>
              </button>

              <button
                onClick={() => handleJurisdictionChange('NZ_FENZ')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition ${
                  jurisdiction === 'NZ_FENZ'
                    ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-[0_0_12px_rgba(0,229,255,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>🇳🇿 NZS 4503</span>
              </button>
            </div>

            {/* Desktop Watch Tactical Demo Button */}
            <button
              onClick={() => setIsDemoVideoOpen(true)}
              className="hidden md:flex items-center space-x-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-500 px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:brightness-110 shadow-[0_0_18px_rgba(0,229,255,0.4)] transition"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Tactical Demo</span>
            </button>

          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-3 sm:p-6 space-y-6">
        
        {/* Rob Inspector Avatar Card */}
        <RobInspectorAvatar
          currentAccent={robAccent}
          onAccentChange={(acc) => setRobAccent(acc)}
        />

        {/* Navigation Tabs (Aligned for Field Tablets & Mobile) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          
          <button
            onClick={() => setActiveTab('spatial')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap border ${
              activeTab === 'spatial'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.5)]'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Compass className="h-4 w-4" />
            <span>Agent 1: Spatial Specifier</span>
          </button>

          <button
            onClick={() => setActiveTab('logger')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap border ${
              activeTab === 'logger'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-[0_0_20px_rgba(255,179,0,0.5)]'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <Activity className="h-4 w-4" />
            <span>Agent 2: Asset Logger ({extinguisherFleet.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quote')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap border ${
              activeTab === 'quote'
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_20px_rgba(0,230,118,0.5)]'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <BadgeDollarSign className="h-4 w-4" />
            <span>Corrective Works Quote</span>
          </button>

          <button
            onClick={() => setActiveTab('dossier')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap border ${
              activeTab === 'dossier'
                ? 'bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 border-cyan-300 shadow-[0_0_20px_rgba(0,229,255,0.5)]'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <FileCheck className="h-4 w-4" />
            <span>Tamper-Evident Audit Dossier</span>
          </button>

        </div>

        {/* Dynamic Tab Views */}
        <div className="space-y-6">
          
          {activeTab === 'spatial' && (
            <div className="animate-fadeIn">
              <SpatialCalculator
                jurisdiction={jurisdiction}
                floorAreaM2={floorAreaM2}
                occupancyClass={jurisdiction === 'ZA_SANS' ? zaOccupancy : nzOccupancy}
                extinguishersInstalled={extinguisherFleet.length}
                hoseReelsInstalled={hoseReels.length}
                calculationResult={spatialCalculation}
                onFloorAreaChange={setFloorAreaM2}
                onOccupancyChange={(occ) => {
                  if (jurisdiction === 'ZA_SANS') setZaOccupancy(occ as ZAOccupancyClass);
                  else setNzOccupancy(occ as NZOccupancyClass);
                }}
                onExtinguishersInstalledChange={(cnt) => {
                  // Adjust fleet size if manually bumped
                  if (cnt < extinguisherFleet.length) {
                    setExtinguisherFleet(prev => prev.slice(0, cnt));
                  }
                }}
                onHoseReelsInstalledChange={(cnt) => {
                  if (cnt > hoseReels.length) {
                    setHoseReels(prev => [
                      ...prev,
                      {
                        id: `hr-${Date.now()}`,
                        locationTag: `Warehouse Bay ${prev.length + 1}`,
                        hoseLengthM: 30,
                        nozzleCondition: 'Good',
                        flowPressureBar: 2.5,
                        runOutObstructed: false,
                        serviceDate: `${currentYear}-01-15`,
                        passed: true,
                      },
                    ]);
                  } else if (cnt < hoseReels.length) {
                    setHoseReels(prev => prev.slice(0, cnt));
                  }
                }}
                onVoiceAnnounce={() => {
                  const phrase = spatialCalculation.complianceClearance ? 'spatial_pass' : 'spatial_shortfall';
                  const script = robAccent ? 'spatial_pass' : 'spatial_shortfall';
                  RobSpeechController.speak(
                    spatialCalculation.complianceClearance
                      ? "Spatial clearance verified under SANS 10400-T! All travel envelopes and hose reel parameters are satisfied."
                      : `Spatial shortfall detected! ${spatialCalculation.extinguisherShortfall} extinguishers short of the required density.`,
                    robAccent
                  );
                }}
              />
            </div>
          )}

          {activeTab === 'logger' && (
            <div className="animate-fadeIn">
              <RapidAssetLogger
                jurisdiction={jurisdiction}
                assets={extinguisherFleet}
                onAddAsset={handleAddAsset}
                onRemoveAsset={handleRemoveAsset}
                onLoadPresetFleet={loadPresetFleet}
                onVoiceCondemned={() => {
                  RobSpeechController.speak(
                    "Warning! Cylinder condemned under SANS 1475. Added to replacement quote.",
                    robAccent
                  );
                }}
              />
            </div>
          )}

          {activeTab === 'quote' && (
            <div className="animate-fadeIn">
              <CommercialQuoteCard
                jurisdiction={jurisdiction}
                fleetSummary={fleetSummary}
                extinguisherShortfall={spatialCalculation.extinguisherShortfall}
                hoseReelShortfall={spatialCalculation.hoseReelShortfall}
                quoteItems={commercialQuote.items}
                grandTotal={commercialQuote.grandTotal}
                currency={commercialQuote.currency}
                onNavigateToDossier={() => setActiveTab('dossier')}
              />
            </div>
          )}

          {activeTab === 'dossier' && (
            <div className="animate-fadeIn">
              <DossierPreview
                manifest={auditManifest}
                onVoiceSignOff={() => {
                  RobSpeechController.speak(
                    "Audit manifest finalized. Web Crypto SHA-256 seal embedded. Audit dossier is ready for Ron's SAQCC review.",
                    robAccent
                  );
                }}
              />
            </div>
          )}

        </div>

      </main>

      {/* Tactical Demo Video Modal */}
      <DemoVideoModal
        isOpen={isDemoVideoOpen}
        onClose={() => setIsDemoVideoOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            PYROGUARD AI CORE PLATFORM • SPRINT 1 COMPLETE
          </div>
          <div className="flex items-center space-x-2 text-cyan-400">
            <span>SANS 10400-T</span>
            <span>•</span>
            <span>SANS 1475</span>
            <span>•</span>
            <span>NZS 4503 FENZ</span>
            <span>•</span>
            <span>SHA-256 VERIFIED</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
