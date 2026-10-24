import {
  NZOccupancyClass,
  SpatialCalculationResult,
} from '@/types/fireCompliance';

/**
 * Deterministic NZS 4503:2005 Spatial Fire Compliance Engine
 * References:
 *  - NZS 4503:2005 (Hand Operated Fire-Fighting Equipment)
 *  - Fire and Emergency New Zealand (FENZ) Act & Compliance Verification Guide
 *  - New Zealand Building Code (NZBC) Clauses C1-C6 Protection from Fire
 */

interface NZOccupancyMetadata {
  description: string;
  hazardLevel: 'High' | 'Medium' | 'Low';
  sqmPerExtinguisher: number;
  maxTravelDistanceM: number;
}

export const NZ_OCCUPANCY_METADATA: Record<NZOccupancyClass, NZOccupancyMetadata> = {
  NZ_HIGH: {
    description: 'High Fire Hazard (Chemical storage, timber mills, high-piled stock)',
    hazardLevel: 'High',
    sqmPerExtinguisher: 100,
    maxTravelDistanceM: 20, // Strict 20m maximum travel in NZ high hazard
  },
  NZ_MEDIUM: {
    description: 'Medium Fire Hazard (Commercial kitchens, retail, light manufacturing)',
    hazardLevel: 'Medium',
    sqmPerExtinguisher: 150,
    maxTravelDistanceM: 25,
  },
  NZ_LOW: {
    description: 'Low Fire Hazard (Offices, schools, standard residential occupancy)',
    hazardLevel: 'Low',
    sqmPerExtinguisher: 250,
    maxTravelDistanceM: 30,
  },
};

export function calculateNZS4503Requirements(
  floorAreaM2: number,
  occupancyClass: NZOccupancyClass,
  extinguishersInstalled: number,
  hoseReelsInstalled: number
): SpatialCalculationResult {
  const cleanArea = Math.max(0, Number(floorAreaM2) || 0);
  const metadata = NZ_OCCUPANCY_METADATA[occupancyClass] || NZ_OCCUPANCY_METADATA.NZ_MEDIUM;

  const extinguishersRequired = cleanArea > 0
    ? Math.max(1, Math.ceil(cleanArea / metadata.sqmPerExtinguisher))
    : 0;

  let hoseReelsRequired = 0;
  if (cleanArea > 300) {
    hoseReelsRequired = Math.ceil(cleanArea / 500);
  }

  const extinguisherShortfall = Math.max(0, extinguishersRequired - extinguishersInstalled);
  const hoseReelShortfall = Math.max(0, hoseReelsRequired - hoseReelsInstalled);

  const deficiencyNotes: string[] = [];

  if (extinguisherShortfall > 0) {
    deficiencyNotes.push(
      `NZS 4503 Shortfall: Deficit of ${extinguisherShortfall} unit(s) based on ${cleanArea}m² [1 per ${metadata.sqmPerExtinguisher}m² for ${metadata.hazardLevel} hazard].`
    );
  }

  if (hoseReelShortfall > 0) {
    deficiencyNotes.push(
      `NZS 4503 Hose Reel Shortfall: Deficit of ${hoseReelShortfall} reel(s) required under building specification.`
    );
  }

  deficiencyNotes.push(
    `FENZ Brigade Radius: Travel distance restricted to ${metadata.maxTravelDistanceM}m under NZS 4503 Table 2.`
  );

  const complianceClearance = extinguisherShortfall === 0 && hoseReelShortfall === 0 && cleanArea > 0;

  return {
    jurisdiction: 'NZ_FENZ',
    occupancyClass,
    floorAreaM2: cleanArea,
    extinguishersRequired,
    extinguishersInstalled,
    extinguisherShortfall,
    maxTravelDistanceM: metadata.maxTravelDistanceM,
    hoseReelsRequired,
    hoseReelsInstalled,
    hoseReelShortfall,
    hoseReelCoverageRadiusM: 35,
    complianceClearance,
    deficiencyNotes,
  };
}
