'use client';

import React from 'react';
import { 
  BadgeDollarSign, 
  TrendingUp, 
  AlertOctagon, 
  ShieldCheck, 
  FileText, 
  Printer, 
  ArrowUpRight,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { 
  CommercialQuoteItem, 
  FleetAuditSummary, 
  Jurisdiction 
} from '@/types/fireCompliance';

interface CommercialQuoteCardProps {
  jurisdiction: Jurisdiction;
  fleetSummary: FleetAuditSummary;
  extinguisherShortfall: number;
  hoseReelShortfall: number;
  quoteItems: CommercialQuoteItem[];
  grandTotal: number;
  currency: 'ZAR' | 'NZD';
  onNavigateToDossier?: () => void;
}

export const CommercialQuoteCard: React.FC<CommercialQuoteCardProps> = ({
  jurisdiction,
  fleetSummary,
  extinguisherShortfall,
  hoseReelShortfall,
  quoteItems,
  grandTotal,
  currency,
  onNavigateToDossier,
}) => {
  const currencySymbol = currency === 'ZAR' ? 'R' : 'NZ$';

  return (
    <div className="rounded-2xl border-2 border-emerald-500/40 bg-slate-900/90 p-4 sm:p-6 shadow-[0_0_35px_rgba(0,230,118,0.15)] space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(0,230,118,0.4)]">
            <BadgeDollarSign className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase">COMMERCIAL REVENUE ENGINE</span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 border border-slate-700">
                AUTO-QUOTING MATRIX
              </span>
            </div>
            <h2 className="text-lg font-black text-white tracking-wide">
              Live Compliance Up-Sell & Condemnation Quote
            </h2>
          </div>
        </div>

        {/* Grand Total Callout */}
        <div className="flex items-center space-x-3 rounded-xl bg-emerald-950/60 border border-emerald-400/80 px-4 py-2 shadow-[0_0_20px_rgba(0,230,118,0.3)]">
          <div>
            <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase">ESTIMATED QUOTE TOTAL</div>
            <div className="text-xl sm:text-2xl font-mono font-black text-white tracking-tight">
              {currencySymbol} {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Tally Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Total Inspected</div>
          <div className="text-xl font-mono font-black text-white mt-1">
            {fleetSummary.totalInspected}
          </div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">Asset units</div>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3">
          <div className="text-[10px] font-mono text-emerald-400 uppercase">Passed Operational</div>
          <div className="text-xl font-mono font-black text-emerald-300 mt-1">
            {fleetSummary.passedUnits}
          </div>
          <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">Stamping Ready</div>
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3">
          <div className="text-[10px] font-mono text-amber-400 uppercase">Hydro Workshop Due</div>
          <div className="text-xl font-mono font-black text-amber-300 mt-1">
            {fleetSummary.hydroTestWorkshopRequired}
          </div>
          <div className="text-[10px] text-amber-400/80 font-mono mt-0.5">
            {fleetSummary.hydroTestOverdueCount > 0 ? (
              <span className="text-rose-400 font-bold">{fleetSummary.hydroTestOverdueCount} Overdue</span>
            ) : (
              '5/10 Yr Cycle'
            )}
          </div>
        </div>

        <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-3">
          <div className="text-[10px] font-mono text-cyan-400 uppercase">Recharge Due</div>
          <div className="text-xl font-mono font-black text-cyan-300 mt-1">
            {fleetSummary.rechargeRequired}
          </div>
          <div className="text-[10px] text-cyan-400/80 font-mono mt-0.5">Gauge Pressure</div>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 shadow-[0_0_15px_rgba(255,23,68,0.2)]">
          <div className="text-[10px] font-mono text-rose-400 uppercase font-bold">Condemned / Replace</div>
          <div className="text-xl font-mono font-black text-rose-300 mt-1">
            {fleetSummary.condemnedUnits + extinguisherShortfall}
          </div>
          <div className="text-[10px] text-rose-300/80 font-mono mt-0.5">
            {fleetSummary.condemnedUnits} fail + {extinguisherShortfall} shortfall
          </div>
        </div>

      </div>

      {/* Itemized Commercial Quote Table */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span className="flex items-center gap-1.5">
            <ShoppingBag className="h-4 w-4 text-emerald-400" />
            Itemized Equipment & Servicing Billing Matrix
          </span>
          <span className="font-mono text-[10px] text-emerald-400">INSTANT ON-SITE CONVERSION</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/90">
          <table className="w-full text-left font-mono text-xs">
            <thead className="border-b border-slate-800 bg-slate-900/90 text-slate-400 text-[10px] uppercase">
              <tr>
                <th className="py-2.5 px-3">SKU / Code</th>
                <th className="py-2.5 px-3">Statutory Description</th>
                <th className="py-2.5 px-3 text-center">Category</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Unit Price</th>
                <th className="py-2.5 px-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {quoteItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    No billable items generated yet. Log cylinders or adjust spatial area.
                  </td>
                </tr>
              ) : (
                quoteItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50 transition">
                    <td className="py-2 px-3 text-slate-400 font-bold">{item.sku}</td>
                    <td className="py-2 px-3 text-white font-sans text-xs">{item.description}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center font-bold text-cyan-300">{item.quantity}</td>
                    <td className="py-2 px-3 text-right text-slate-300">
                      {currencySymbol} {item.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-300">
                      {currencySymbol} {item.totalPrice.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="border-t-2 border-emerald-500/40 bg-slate-900/90 text-white font-bold">
              <tr>
                <td colSpan={5} className="py-3 px-3 text-right uppercase text-xs tracking-wider">
                  Grand Total (Excl. VAT / GST):
                </td>
                <td className="py-3 px-3 text-right font-mono text-base text-emerald-400">
                  {currencySymbol} {grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-400">
          💡 <span className="text-slate-300">Auditor Note:</span> Present this itemized quote to the client representative on site for immediate sign-off.
        </div>
        {onNavigateToDossier && (
          <button
            onClick={onNavigateToDossier}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(0,230,118,0.4)] transition"
          >
            <span>Proceed to Cryptographic Dossier</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        )}
      </div>

    </div>
  );
};
