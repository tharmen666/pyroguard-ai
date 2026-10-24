import type {
  ZAOccupancyClass,
  SpatialCalculationResult,
} from '../../types/fireCompliance';

/**
 * Deterministic SANS 10400-T Spatial Fire Compliance Engine
 * Rule-based statutory specifier (no AI involved).
 * References (edition and clause numbers to be confirmed):
 *  - SANS 10400-T (portable fire extinguishers, hose reels)
 *  - SANS 10400-A (occupancy classification)
 *  - City of Cape Town Fire Safety By-Law (spatial equipment density)
 *
 * VERIFICATION: the densities and distances below are working values. They must be
 * checked against the current SANS editions by a registered practitioner before use
 * on paying work. Flip RULES_VERIFIED to true once that sign-off is recorded.
 */
export const RULES_VERIFIED = false;

interface ZAOcupancyMetadata {
  description: string;
  hazardLevel: 'High' | 'Moderate' | 'Low';
  sqmPerExtinguisher: number;
  maxTravelDistanceM: number;
}

export const ZA_OCCUPANCY_METADATA: Record<ZAOccupancyClass, ZAOcupancyMetadata> = {
  J1: {
    description: 'High-risk storage (flammables, chemicals, tyres)',
    hazardLevel: 'High',
    sqmPerExtinguisher: 100,
    maxTravelDistanceM: 30,
  },
  J2: {
    description: 'Moderate-risk storage (general warehousing)',
    hazardLevel: 'Moderate',
    sqmPerExtinguisher: 200,
    maxTravelDistanceM: 30,
  },
  J3: {
    description: 'Low-risk storage',
    hazardLevel: 'Low',
    sqmPerExtinguisher: 250,
    maxTravelDistanceM: 30,
  },
  G1: {
    description: 'Offices',
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
  const metadata = ZA_OCCUPANCY_METADATA[occupancyClass] || ZA_OCCUPANCY_METADATA.G1;

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
    `Statutory Travel Envelope: Max travel distance to any extinguisher must not exceed ${metadata.maxTravelDistanceM}m under SANS 10400-T (value pending verification).`
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
