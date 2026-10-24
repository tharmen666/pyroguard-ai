import {
  ZAOccupancyClass,
  SpatialCalculationResult,
} from '@/types/fireCompliance';

/**
 * Deterministic SANS 10400-T Spatial Fire Compliance Engine
 * Zero-temperature, rule-based statutory specifier.
 * References:
 *  - SANS 10400-T:2020 Clause 4.37 (Portable Fire Extinguishers)
 *  - SANS 10400-T:2020 Clause 4.36 (Hose Reels)
 *  - City of Cape Town Fire Safety By-Law (Spatial equipment density)
 */

interface ZAOcupancyMetadata {
  description: string;
  hazardLevel: 'High' | 'Moderate' | 'Low';
  sqmPerExtinguisher: number;
  maxTravelDistanceM: number;
}

export const ZA_OCCUPANCY_METADATA: Record<ZAOccupancyClass, ZAOcupancyMetadata> = {
  J1: {
    description: 'High-Hazard Industrial / Storage (Flammables, chemicals, tyres)',
    hazardLevel: 'High',
    sqmPerExtinguisher: 100,
    maxTravelDistanceM: 30,
  },
  J2: {
    description: 'Moderate-Hazard Industrial (Manufacturing, food processing)',
    hazardLevel: 'Moderate',
    sqmPerExtinguisher: 200,
    maxTravelDistanceM: 30,
  },
  J3: {
    description: 'Low-Hazard Industrial / Engineering',
    hazardLevel: 'Low',
    sqmPerExtinguisher: 250,
    maxTravelDistanceM: 30,
  },
  B2: {
    description: 'Commercial Offices / Professional Consultancies',
    hazardLevel: 'Low',
    sqmPerExtinguisher: 200,
    maxTravelDistanceM: 30,
  },
  A1: {
    description: 'Entertainment & Public Assembly (> 50 persons)',
    hazardLevel: 'High',
    sqmPerExtinguisher: 100,
    maxTravelDistanceM: 30,
  },
  A2: {
    description: 'Theatrical & Indoor Cultural Assembly',
    hazardLevel: 'Moderate',
    sqmPerExtinguisher: 100,
    maxTravelDistanceM: 30,
  },
};

export function calculateSANS10400TRequirements(
  floorAreaM2: number,
  occupancyClass: ZAOccupancyClass,
  extinguishersInstalled: number,
  hoseReelsInstalled: number
): SpatialCalculationResult {
  const cleanArea = Math.max(0, Number(floorAreaM2) || 0);
  const metadata = ZA_OCCUPANCY_METADATA[occupancyClass] || ZA_OCCUPANCY_METADATA.B2;

  // SANS 10400-T Rule: At least 1 unit per specified sqm block, minimum 1 if area > 0
  const extinguishersRequired = cleanArea > 0 
    ? Math.max(1, Math.ceil(cleanArea / metadata.sqmPerExtinguisher))
    : 0;

  // SANS 10400-T Hose Reel Rule:
  // Provided where floor area exceeds 250 m², at 1 hose reel per 500 m² or part thereof.
  let hoseReelsRequired = 0;
  if (cleanArea > 250) {
    hoseReelsRequired = Math.ceil(cleanArea / 500);
  }

  const extinguisherShortfall = Math.max(0, extinguishersRequired - extinguishersInstalled);
  const hoseReelShortfall = Math.max(0, hoseReelsRequired - hoseReelsInstalled);

  const deficiencyNotes: string[] = [];

  if (extinguisherShortfall > 0) {
    deficiencyNotes.push(
      `SANS 10400-T Shortfall: Deficit of ${extinguisherShortfall} portable extinguisher unit(s) based on ${cleanArea}m² [1 unit per ${metadata.sqmPerExtinguisher}m² for Class ${occupancyClass}].`
    );
  }

  if (hoseReelShortfall > 0) {
    deficiencyNotes.push(
      `SANS 10400-T Hose Reel Shortfall: Deficit of ${hoseReelShortfall} 30m hydraulic hose reel(s) (1 per 500m² required for areas > 250m²).`
    );
  }

  deficiencyNotes.push(
    `Statutory Travel Envelope: Max travel distance to any extinguisher must not exceed ${metadata.maxTravelDistanceM}m under SANS 10400-T Clause 4.37.1.`
  );

  const complianceClearance = extinguisherShortfall === 0 && hoseReelShortfall === 0 && cleanArea > 0;

  return {
    jurisdiction: 'ZA_SANS',
    occupancyClass,
    floorAreaM2: cleanArea,
    extinguishersRequired,
    extinguishersInstalled,
    extinguisherShortfall,
    maxTravelDistanceM: metadata.maxTravelDistanceM,
    hoseReelsRequired,
    hoseReelsInstalled,
    hoseReelShortfall,
    hoseReelCoverageRadiusM: 35, // 30m hose + 5m water throw
    complianceClearance,
    deficiencyNotes,
  };
}
