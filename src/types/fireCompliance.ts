/**
 * PYROGUARD AI - SPRINT 1 CORE SCHEMA & TYPE SYSTEM
 * Dual Statutory Scope:
 *  - South Africa: SANS 10400-T (Spatial Building Fire Safety) & SANS 1475 Parts 1 & 2 (Equipment Servicing)
 *  - New Zealand: NZS 4503:2005 (Hand Operated Fire-Fighting Equipment) & FENZ Compliance
 */

export type Jurisdiction = 'ZA_SANS' | 'NZ_FENZ';

export type ZAOccupancyClass =
  | 'A1' // Entertainment & public assembly
  | 'A2' // Theatrical & indoor entertainment
  | 'B2' // Commercial Offices / Professional Services
  | 'J1' // High-Hazard Industrial / Storage (Flammable, chemicals, tyre storage)
  | 'J2' // Moderate Hazard Industrial
  | 'J3'; // Low Hazard Industrial

export type NZOccupancyClass =
  | 'NZ_HIGH'   // High Fire Hazard (Bulk flammable liquids, timber yards, chemical storage)
  | 'NZ_MEDIUM' // Medium Fire Hazard (Warehousing, factories, commercial kitchens)
  | 'NZ_LOW';   // Low Fire Hazard (Offices, residential institutions, schools)

export type OccupancyClass = ZAOccupancyClass | NZOccupancyClass;

export type CylinderType = 'DCP' | 'CO2' | 'Water' | 'FoamAFFF' | 'WetChemical';

export type GaugePressureStatus = 'Normal' | 'Undercharged' | 'Overcharged';

export type PhysicalCondition =
  | 'Pass'
  | 'Rusted'
  | 'DentedCorroded'
  | 'DamagedHose'
  | 'MissingSafetyPin'
  | 'MissingSafetySign'
  | 'ObstructedMounting';

export interface ExtinguisherAsset {
  id: string;
  serialNumber: string;
  locationTag: string;
  cylinderType: CylinderType;
  capacityKg: number; // e.g., 0.9, 1.5, 2.0, 4.5, 5.0, 9.0
  manufactureYear: number;
  lastPressureTestYear?: number; // Year cylinder was last hydro-tested in workshop; defaults to manufactureYear if omitted
  lastServiceDate: string; // ISO date YYYY-MM-DD
  gaugePressureStatus: GaugePressureStatus;
  physicalCondition: PhysicalCondition;
  hydrostaticTestDueYear: number; // Computed: 5-year cycle for CO2, 10-year for DCP/Water/Foam
  isPressureTestOverdue: boolean; // True if currentYear > hydrostaticTestDueYear
  condemned: boolean; // Triggered if structural damage or statutory lifespan/retest limits breached
  condemnationReason?: string;
  serviceActionRequired: 'None' | 'Routine_Service' | 'Hydro_Test_Workshop' | 'PRESSURE_TEST_OVERDUE' | 'Condemn_Replace' | 'Recharge';
}

export interface HoseReelAsset {
  id: string;
  locationTag: string;
  hoseLengthM: number; // Standard 30m
  nozzleCondition: 'Good' | 'Cracked' | 'Seized' | 'Missing';
  flowPressureBar: number; // Standard >= 2.0 bar dynamic pressure
  runOutObstructed: boolean;
  serviceDate: string;
  passed: boolean;
}

export interface SpatialCalculationResult {
  jurisdiction: Jurisdiction;
  occupancyClass: OccupancyClass;
  floorAreaM2: number;
  extinguishersRequired: number;
  extinguishersInstalled: number;
  extinguisherShortfall: number;
  maxTravelDistanceM: number; // 30m for SANS, 20-30m for NZ depending on hazard
  hoseReelsRequired: number;
  hoseReelsInstalled: number;
  hoseReelShortfall: number;
  hoseReelCoverageRadiusM: number; // 35m (30m hose + 5m stream)
  complianceClearance: boolean;
  deficiencyNotes: string[];
}

export interface FleetAuditSummary {
  totalInspected: number;
  passedUnits: number;
  routineServiceRequired: number;
  hydroTestWorkshopRequired: number;
  hydroTestOverdueCount: number; // Number of operational units operating past their statutory pressure test anniversary
  condemnedUnits: number;
  rechargeRequired: number;
  totalHoseReels: number;
  hoseReelsPassed: number;
  hoseReelsDefective: number;
  fullComplianceClearance: boolean; // False if any condemned or pressure test overdue units exist
}

export interface CommercialQuoteItem {
  sku: string;
  description: string;
  quantity: number;
  unitPrice: number;
  currency: 'ZAR' | 'NZD';
  totalPrice: number;
  category: 'Service' | 'PressureTest' | 'Replacement' | 'Shortfall_Cure' | 'Recharge' | 'Ancillary';
}

export interface AuditManifestDossier {
  auditId: string;
  facilityName: string;
  facilityAddress: string;
  gpsCoordinates: string;
  clientRepresentative: string;
  leadAuditor: {
    name: string;
    registrationNumber: string; // SAQCC 1475 or NZ IQP
    organization: string;
  };
  technicalArchitect: {
    name: string;
    system: string;
  };
  timestamp: string;
  jurisdiction: Jurisdiction;
  spatialAudit: SpatialCalculationResult;
  extinguisherFleet: ExtinguisherAsset[];
  hoseReels: HoseReelAsset[];
  fleetSummary: FleetAuditSummary;
  commercialQuote: CommercialQuoteItem[];
  grandTotal: number;
  currency: 'ZAR' | 'NZD';
  clientSha256Signature: string;
  regulatoryDeclarations: string[];
}
