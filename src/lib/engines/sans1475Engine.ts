import {
  ExtinguisherAsset,
  FleetAuditSummary,
  CommercialQuoteItem,
  Jurisdiction,
  HoseReelAsset,
} from '@/types/fireCompliance';

/**
 * Deterministic SANS 1475 Asset Lifecycle & Condemnation Engine
 * References:
 *  - SANS 1475-1: The production, reconditioning and maintenance of portable fire extinguishers
 *  - SANS 1475-2: Maintenance of fire hose reels and hydrants
 *  - SABS 1910 / SANS 1186 safety marking directives
 */

export const STATUTORY_CURRENT_YEAR = 2026;

export function calculateHydrostaticTestDueYear(
  cylinderType: ExtinguisherAsset['cylinderType'],
  manufactureYear: number,
  lastServiceYear: number = STATUTORY_CURRENT_YEAR
): number {
  const cycle = cylinderType === 'CO2' ? 5 : 10;
  const elapsed = Math.max(0, lastServiceYear - manufactureYear);

  if (elapsed === 0) {
    return manufactureYear + cycle;
  }

  if (elapsed % cycle === 0) {
    // Current year is the exact anniversary year
    return manufactureYear + elapsed;
  }

  // Next upcoming statutory anniversary
  return manufactureYear + Math.ceil(elapsed / cycle) * cycle;
}

export function evaluateExtinguisherCompliance(
  asset: Omit<ExtinguisherAsset, 'hydrostaticTestDueYear' | 'condemned' | 'condemnationReason' | 'serviceActionRequired'>,
  currentYear: number = STATUTORY_CURRENT_YEAR
): ExtinguisherAsset {
  const hydroDueYear = calculateHydrostaticTestDueYear(asset.cylinderType, asset.manufactureYear, currentYear);
  const age = currentYear - asset.manufactureYear;

  let condemned = false;
  let condemnationReason: string | undefined = undefined;
  let serviceActionRequired: ExtinguisherAsset['serviceActionRequired'] = 'None';

  // 1. Mandatory Condemnation Checks under SANS 1475-1 Clause 6
  if (asset.physicalCondition === 'DentedCorroded') {
    condemned = true;
    condemnationReason = 'SANS 1475 Condemned: Structural shell denting/corrosion compromises pressure vessel integrity.';
    serviceActionRequired = 'Condemn_Replace';
  } else if (asset.physicalCondition === 'Rusted') {
    condemned = true;
    condemnationReason = 'SANS 1475 Condemned: Severe pitting/rust on cylinder skirt or body beyond safety tolerances.';
    serviceActionRequired = 'Condemn_Replace';
  } else if (age > 20 && asset.cylinderType !== 'CO2') {
    // SANS 1475 recommendation: Low-pressure welded steel cylinders over 20 years with multiple test histories
    condemned = true;
    condemnationReason = `SANS 1475 Condemned: Cylinder age (${age} years) exceeds statutory 20-year service life envelope.`;
    serviceActionRequired = 'Condemn_Replace';
  } else if (currentYear >= hydroDueYear) {
    // 2. Hydrostatic Pressure Testing Due
    serviceActionRequired = 'Hydro_Test_Workshop';
  } else if (asset.gaugePressureStatus === 'Undercharged' || asset.gaugePressureStatus === 'Overcharged') {
    // 3. Pressure Failure -> Mandatory discharge and recharge
    serviceActionRequired = 'Recharge';
  } else {
    // 4. Routine Annual Servicing check
    const lastServiceDateObj = new Date(asset.lastServiceDate);
    const monthsElapsed = (Date.now() - lastServiceDateObj.getTime()) / (1000 * 60 * 60 * 24 * 30.4375);
    if (monthsElapsed >= 11.5) {
      serviceActionRequired = 'Routine_Service';
    } else {
      serviceActionRequired = 'None';
    }
  }

  return {
    ...asset,
    hydrostaticTestDueYear: hydroDueYear,
    condemned,
    condemnationReason,
    serviceActionRequired,
  };
}

export function summarizeFleet(
  extinguishers: ExtinguisherAsset[],
  hoseReels: HoseReelAsset[]
): FleetAuditSummary {
  let passedUnits = 0;
  let routineServiceRequired = 0;
  let hydroTestWorkshopRequired = 0;
  let condemnedUnits = 0;
  let rechargeRequired = 0;

  for (const ext of extinguishers) {
    if (ext.condemned) {
      condemnedUnits++;
    } else if (ext.serviceActionRequired === 'Hydro_Test_Workshop') {
      hydroTestWorkshopRequired++;
    } else if (ext.serviceActionRequired === 'Recharge') {
      rechargeRequired++;
    } else if (ext.serviceActionRequired === 'Routine_Service') {
      routineServiceRequired++;
    } else {
      passedUnits++;
    }
  }

  const hoseReelsPassed = hoseReels.filter(hr => hr.passed && !hr.runOutObstructed).length;
  const hoseReelsDefective = hoseReels.length - hoseReelsPassed;

  return {
    totalInspected: extinguishers.length,
    passedUnits,
    routineServiceRequired,
    hydroTestWorkshopRequired,
    condemnedUnits,
    rechargeRequired,
    totalHoseReels: hoseReels.length,
    hoseReelsPassed,
    hoseReelsDefective,
  };
}

/**
 * Standard Price Catalogs (South Africa ZAR and New Zealand NZD)
 */
const PRICING_CATALOG = {
  ZA_SANS: {
    currency: 'ZAR' as const,
    ROUTINE_SERVICE_EXT: 65,      // Annual inspection, tamper seal, SANS 1475 service label
    HYDRO_TEST_WORKSHOP: 280,    // Hydraulic pressure stretch test + certificate
    REFILL_DCP_4_5KG: 145,       // Monammonium phosphate dry powder recharge
    REFILL_DCP_9KG: 235,
    REFILL_CO2_5KG: 295,
    REPLACE_NEW_DCP_9KG: 790,    // SABS 1910 approved new unit complete with bracket
    REPLACE_NEW_CO2_5KG: 1450,
    HOSE_REEL_ANNUAL_TEST: 180,  // Dynamic flow rate check, gland packing, 30m run-out test
    HOSE_REEL_NEW_INSTALL: 2450,
    SAFETY_SIGN_PHOTOLUM: 120,   // SANS 1186 glow-in-the-dark location arrow
  },
  NZ_FENZ: {
    currency: 'NZD' as const,
    ROUTINE_SERVICE_EXT: 28,     // NZS 4503 annual tag & audit
    HYDRO_TEST_WORKSHOP: 85,
    REFILL_DCP_4_5KG: 55,
    REFILL_DCP_9KG: 85,
    REFILL_CO2_5KG: 95,
    REPLACE_NEW_DCP_9KG: 185,
    REPLACE_NEW_CO2_5KG: 290,
    HOSE_REEL_ANNUAL_TEST: 65,
    HOSE_REEL_NEW_INSTALL: 580,
    SAFETY_SIGN_PHOTOLUM: 45,
  },
};

export function generateDynamicCommercialQuote(
  jurisdiction: Jurisdiction,
  summary: FleetAuditSummary,
  extinguisherShortfall: number,
  hoseReelShortfall: number
): { items: CommercialQuoteItem[]; grandTotal: number; currency: 'ZAR' | 'NZD' } {
  const catalog = PRICING_CATALOG[jurisdiction];
  const items: CommercialQuoteItem[] = [];

  // 1. Routine Servicing for operational units
  const totalRoutineAndRecharges = summary.routineServiceRequired + summary.rechargeRequired + summary.passedUnits;
  if (totalRoutineAndRecharges > 0) {
    items.push({
      sku: 'SRV-ANNUAL-SANS',
      description: `Annual Statutory Equipment Maintenance & Verification Stamping (${jurisdiction === 'ZA_SANS' ? 'SANS 1475 Part 1' : 'NZS 4503'})`,
      quantity: totalRoutineAndRecharges,
      unitPrice: catalog.ROUTINE_SERVICE_EXT,
      currency: catalog.currency,
      totalPrice: totalRoutineAndRecharges * catalog.ROUTINE_SERVICE_EXT,
      category: 'Service',
    });
  }

  // 2. Hydrostatic Workshop Pressure Testing
  if (summary.hydroTestWorkshopRequired > 0) {
    items.push({
      sku: 'SRV-HYDRO-TEST',
      description: 'Mandatory Workshop Hydrostatic Pressure Test & Stretch Verification (5/10 Year Statutory Cycle)',
      quantity: summary.hydroTestWorkshopRequired,
      unitPrice: catalog.HYDRO_TEST_WORKSHOP,
      currency: catalog.currency,
      totalPrice: summary.hydroTestWorkshopRequired * catalog.HYDRO_TEST_WORKSHOP,
      category: 'PressureTest',
    });
  }

  // 3. Pressure Recharges
  if (summary.rechargeRequired > 0) {
    items.push({
      sku: 'RCHG-DCP-POWDER',
      description: 'Discharge, Clean-out & High-Grade ABC Extinguishing Powder Recharge',
      quantity: summary.rechargeRequired,
      unitPrice: catalog.REFILL_DCP_9KG,
      currency: catalog.currency,
      totalPrice: summary.rechargeRequired * catalog.REFILL_DCP_9KG,
      category: 'Recharge',
    });
  }

  // 4. Replacement of Condemned Units
  if (summary.condemnedUnits > 0) {
    items.push({
      sku: 'EQP-REPLACE-CONDEMNED',
      description: 'Replacement of Condemned Cylinders with SABS 1910 / AS/NZS Approved 9.0kg Units',
      quantity: summary.condemnedUnits,
      unitPrice: catalog.REPLACE_NEW_DCP_9KG,
      currency: catalog.currency,
      totalPrice: summary.condemnedUnits * catalog.REPLACE_NEW_DCP_9KG,
      category: 'Replacement',
    });
  }

  // 5. Shortfall Remediation (Spatial Coverage Cure)
  if (extinguisherShortfall > 0) {
    items.push({
      sku: 'EQP-SHORTFALL-CURE',
      description: `Spatial Compliance Shortfall Remediation: Supply & Wall-Mount New Units (${jurisdiction === 'ZA_SANS' ? 'SANS 10400-T' : 'NZS 4503'})`,
      quantity: extinguisherShortfall,
      unitPrice: catalog.REPLACE_NEW_DCP_9KG,
      currency: catalog.currency,
      totalPrice: extinguisherShortfall * catalog.REPLACE_NEW_DCP_9KG,
      category: 'Shortfall_Cure',
    });
  }

  // 6. Hose Reel Servicing
  if (summary.totalHoseReels > 0) {
    items.push({
      sku: 'SRV-HOSE-REEL',
      description: 'Hose Reel Hydraulic Flow, Nozzle Atomization & 30m Run-Out Test',
      quantity: summary.totalHoseReels,
      unitPrice: catalog.HOSE_REEL_ANNUAL_TEST,
      currency: catalog.currency,
      totalPrice: summary.totalHoseReels * catalog.HOSE_REEL_ANNUAL_TEST,
      category: 'Service',
    });
  }

  // 7. Hose Reel Shortfall Installation
  if (hoseReelShortfall > 0) {
    items.push({
      sku: 'EQP-HOSE-REEL-INSTALL',
      description: 'New Hydraulic 30m Fire Hose Reel Complete with Stopcock & Nozzle Assembly',
      quantity: hoseReelShortfall,
      unitPrice: catalog.HOSE_REEL_NEW_INSTALL,
      currency: catalog.currency,
      totalPrice: hoseReelShortfall * catalog.HOSE_REEL_NEW_INSTALL,
      category: 'Shortfall_Cure',
    });
  }

  const grandTotal = items.reduce((acc, curr) => acc + curr.totalPrice, 0);

  return {
    items,
    grandTotal,
    currency: catalog.currency,
  };
}
