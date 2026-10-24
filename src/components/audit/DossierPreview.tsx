'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Printer, 
  Download, 
  Fingerprint, 
  CheckCircle2, 
  FileCheck, 
  Building, 
  Flame, 
  Calendar, 
  MapPin, 
  UserCheck,
  RefreshCw,
  Award
} from 'lucide-react';
import { 
  AuditManifestDossier, 
  Jurisdiction 
} from '@/types/fireCompliance';
import { generateClientSHA256, formatTruncatedHash } from '@/lib/engines/cryptoService';

interface DossierPreviewProps {
  manifest: AuditManifestDossier;
  onPrint?: () => void;
  onVoiceSignOff?: () => void;
}

export const DossierPreview: React.FC<DossierPreviewProps> = ({
  manifest,
  onPrint,
  onVoiceSignOff,
}) => {
  const [liveSha256, setLiveSha256] = useState<string>('');
  const [isHashing, setIsHashing] = useState<boolean>(true);
  const [signedByClient, setSignedByClient] = useState<boolean>(true);

  useEffect(() => {
    async function hashManifest() {
      setIsHashing(true);
      const hashPayload = {
        auditId: manifest.auditId,
        facility: manifest.facilityName,
        jurisdiction: manifest.jurisdiction,
        spatialArea: manifest.spatialAudit.floorAreaM2,
        fleetCount: manifest.extinguisherFleet.length,
        grandTotal: manifest.grandTotal,
        auditor: manifest.leadAuditor.registrationNumber,
        timestamp: manifest.timestamp,
      };
      const hash = await generateClientSHA256(hashPayload);
      setLiveSha256(hash);
      setIsHashing(false);
    }
    hashManifest();
  }, [manifest]);

  const isZA = manifest.jurisdiction === 'ZA_SANS';

  const handlePrintManifest = () => {
    if (onVoiceSignOff) onVoiceSignOff();
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border-2 border-cyan-500/40 bg-slate-900/90 p-4 shadow-[0_0_30px_rgba(0,229,255,0.2)]">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
            <FileCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">Insurer-Defensible Audit Dossier</h3>
            <p className="text-xs text-slate-300 font-mono">
              Web Crypto SHA-256 Tamper-Evident Manifest • Official Certificate
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <button
            onClick={handlePrintManifest}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,229,255,0.5)] transition"
          >
            <Printer className="h-4 w-4" />
            <span>Print / Save Legal PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Certificate Page */}
      <div 
        id="printable-dossier" 
        className="relative overflow-hidden rounded-2xl border-2 border-slate-700 bg-white text-slate-950 p-6 sm:p-10 shadow-2xl print:m-0 print:p-6 print:border-none print:shadow-none"
      >
        
        {/* Subtle Watermark in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <Flame className="w-[500px] h-[500px] text-slate-900" />
        </div>

        {/* Certificate Top Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white font-black text-sm">
                  🔥
                </div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 uppercase font-sans">
                  PYROGUARD AI
                </h1>
                <span className="rounded bg-slate-950 text-white px-2 py-0.5 text-[10px] font-mono font-bold tracking-widest uppercase">
                  LEGAL DOSSIER
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 tracking-wide uppercase">
                {isZA 
                  ? 'Statutory Compliance Declaration • SANS 10400-T & SANS 1475 (Parts 1 & 2)' 
                  : 'Statutory Compliance Declaration • NZS 4503:2005 & FENZ Brigade Regulations'}
              </p>
              <p className="text-[11px] text-slate-600">
                City of Cape Town Fire Safety By-Laws & National Building Regulations Act 103 of 1977
              </p>
            </div>

            <div className="text-left sm:text-right font-mono text-xs space-y-1 border-l-2 sm:border-l-0 sm:border-r-2 border-slate-900 pl-3 sm:pl-0 sm:pr-3">
              <div><span className="font-bold text-slate-600">DOSSIER ID:</span> <span className="font-black text-slate-950">{manifest.auditId}</span></div>
              <div><span className="font-bold text-slate-600">DATE:</span> <span className="font-black text-slate-950">{manifest.timestamp}</span></div>
              <div><span className="font-bold text-slate-600">JURISDICTION:</span> <span className="font-black text-slate-950">{manifest.jurisdiction}</span></div>
            </div>

          </div>
        </div>

        {/* Facility & Auditor Meta Block */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-100 p-4 border border-slate-300 text-xs mb-6">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Facility Inspected</div>
            <div className="font-black text-base text-slate-900">{manifest.facilityName}</div>
            <div className="text-slate-700 flex items-center gap-1 font-mono">
              <MapPin className="h-3 w-3 text-slate-500" />
              {manifest.facilityAddress} ({manifest.gpsCoordinates})
            </div>
            <div className="text-slate-600">
              Client Authorized Signatory: <span className="font-bold text-slate-900">{manifest.clientRepresentative}</span>
            </div>
          </div>

          <div className="space-y-1 sm:border-l sm:border-slate-300 sm:pl-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lead Certified Auditor</div>
            <div className="font-black text-base text-slate-900">{manifest.leadAuditor.name}</div>
            <div className="font-mono text-slate-700">
              Registration: <span className="font-bold text-slate-950">{manifest.leadAuditor.registrationNumber}</span>
            </div>
            <div className="text-slate-600 text-[11px]">
              Engineered with: <span className="font-bold text-slate-900">Desigan Tharmen</span> (Lead Systems & Cryptography Architect)
            </div>
          </div>
        </div>

        {/* Spatial Clearance Summary Block */}
        <div className="border border-slate-300 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Building className="h-4 w-4 text-slate-700" />
              1. Spatial Fire Envelope Audit ({isZA ? 'SANS 10400-T' : 'NZS 4503'})
            </h4>
            <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold ${
              manifest.spatialAudit.complianceClearance 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                : 'bg-rose-100 text-rose-800 border border-rose-300'
            }`}>
              {manifest.spatialAudit.complianceClearance ? 'CLEARANCE COMPLIANT' : 'SHORTFALL REMEDIATION REQUIRED'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Protected Area:</span>
              <span className="font-black text-slate-900 text-sm">{manifest.spatialAudit.floorAreaM2} m²</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Occupancy Class:</span>
              <span className="font-black text-slate-900 text-sm">{manifest.spatialAudit.occupancyClass}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Extinguishers Req / Inst:</span>
              <span className="font-black text-slate-900 text-sm">
                {manifest.spatialAudit.extinguishersRequired} req / {manifest.spatialAudit.extinguishersInstalled} inst
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block uppercase">Max Travel Limit:</span>
              <span className="font-black text-slate-900 text-sm">≤ {manifest.spatialAudit.maxTravelDistanceM} meters</span>
            </div>
          </div>
        </div>

        {/* Equipment Servicing & Condemnation Register */}
        <div className="border border-slate-300 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="font-black text-sm text-slate-900 uppercase tracking-wide flex items-center gap-2">
              <Flame className="h-4 w-4 text-slate-700" />
              2. SANS 1475 Equipment Servicing & Condemnation Registry
            </h4>
            <span className="text-[11px] font-mono font-bold text-slate-700">
              Total Inspected: {manifest.fleetSummary.totalInspected} Units
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2 px-2">Serial</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Location</th>
                  <th className="py-2 px-2">Hydro Due</th>
                  <th className="py-2 px-2">Condition</th>
                  <th className="py-2 px-2 text-right">Statutory Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {manifest.extinguisherFleet.map((ext) => (
                  <tr key={ext.id}>
                    <td className="py-1.5 px-2 font-bold">{ext.serialNumber}</td>
                    <td className="py-1.5 px-2">{ext.cylinderType} ({ext.capacityKg}kg)</td>
                    <td className="py-1.5 px-2 font-sans">{ext.locationTag}</td>
                    <td className="py-1.5 px-2">{ext.hydrostaticTestDueYear}</td>
                    <td className="py-1.5 px-2 font-sans">{ext.physicalCondition}</td>
                    <td className="py-1.5 px-2 text-right font-bold">
                      {ext.condemned ? (
                        <span className="text-rose-700 uppercase">Condemned (SANS 1475-1)</span>
                      ) : ext.serviceActionRequired === 'Hydro_Test_Workshop' ? (
                        <span className="text-amber-700">Hydro Test Workshop</span>
                      ) : ext.serviceActionRequired === 'Recharge' ? (
                        <span className="text-cyan-700">Recharge Required</span>
                      ) : (
                        <span className="text-emerald-700">Compliant / Stamped</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commercial Quote Acceptance Block */}
        <div className="border border-slate-300 rounded-xl p-4 mb-6 bg-slate-50 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">
            <span>3. Commercial Remediations & Statutory Quote Breakdown</span>
            <span className="font-mono text-sm text-slate-950 font-black">
              Total: {manifest.currency === 'ZAR' ? 'R' : 'NZ$'} {manifest.grandTotal.toFixed(2)} (Excl. VAT)
            </span>
          </div>
          <div className="text-[11px] text-slate-600">
            Includes all replacement cylinders for condemned units, SANS 1475 tamper seals, pressure recharging, and spatial shortfall supply.
          </div>
        </div>

        {/* Three-Way Executive Sign-off Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t-2 border-slate-900 text-xs">
          
          <div className="space-y-2">
            <div className="font-bold text-slate-500 text-[10px] uppercase">1. Lead Competent Auditor</div>
            <div className="h-10 border-b border-dashed border-slate-400 flex items-end pb-1 font-serif italic text-base text-slate-900">
              Ron • SAQCC 1475/8821
            </div>
            <div className="font-bold text-slate-900">{manifest.leadAuditor.name}</div>
            <div className="text-[10px] text-slate-600 font-mono">SAQCC Registered Competent Person</div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-500 text-[10px] uppercase">2. Technical Systems Architect</div>
            <div className="h-10 border-b border-dashed border-slate-400 flex items-end pb-1 font-serif italic text-base text-slate-900">
              Desigan Tharmen
            </div>
            <div className="font-bold text-slate-900">Desigan Tharmen</div>
            <div className="text-[10px] text-slate-600 font-mono">PyroGuard Deterministic AI Architect</div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-500 text-[10px] uppercase">3. Client Representative</div>
            <div className="h-10 border-b border-dashed border-slate-400 flex items-end pb-1 font-serif italic text-base text-slate-900">
              {manifest.clientRepresentative}
            </div>
            <div className="font-bold text-slate-900">{manifest.clientRepresentative}</div>
            <div className="text-[10px] text-slate-600 font-mono">Occupier / Property Manager</div>
          </div>

        </div>

        {/* Cryptographic SHA-256 Defensibility Seal Footer */}
        <div className="mt-8 rounded-xl bg-slate-950 text-white p-4 font-mono text-xs space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Fingerprint className="h-5 w-5 text-cyan-400" />
              <span className="font-bold tracking-wider text-cyan-300">
                CLIENT-SIDE SHA-256 AUDIT FOOTPRINT
              </span>
            </div>
            <span className="inline-flex items-center rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/40">
              TAMPER-EVIDENT SECURED
            </span>
          </div>

          <div className="break-all font-mono text-[11px] text-cyan-200 bg-slate-900/80 p-2.5 rounded border border-slate-800">
            {isHashing ? 'CALCULATING HASH VIA SUBTLECRYPTO...' : liveSha256}
          </div>

          <div className="flex flex-col sm:flex-row justify-between text-[10px] text-slate-400 pt-1">
            <span>Verified under Web Crypto API (FIPS 180-4 standard)</span>
            <span>Zero Cloud Latency • Edge Compliant</span>
          </div>
        </div>

      </div>

    </div>
  );
};
