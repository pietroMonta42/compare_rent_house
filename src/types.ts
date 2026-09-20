export type EnergyClass = 'A' | 'B-C' | 'D' | 'E' | 'F-G';
export type FloorType = 'intermediate' | 'ground' | 'top';
export type Orientation = 'south' | 'east_mixed' | 'west' | 'north';
export type HeatingType = 'gas_central' | 'gas_autonomous' | 'heat_pump' | 'electric_joule';
export type AcType = 'split_inverter' | 'portable' | 'none';
export type ContractType = 'transitorio' | '4_4' | 'libero';
export type FurnishingType = 'furnished' | 'partial' | 'empty';
export type CostPeriod = 'monthly' | 'annual';
export type AgencyFeeMode = 'none' | 'flat' | 'monthly_multiple' | 'annual_percentage';
export type UtilityKey = 'electricity' | 'gas' | 'water' | 'internet' | 'tari' | 'rai' | 'maintenance' | 'small_maintenance' | 'registro';

export interface Features {
  box: boolean;
  terrace: boolean;
  bidet: boolean;
  shower: boolean;
  induction: boolean;
  elevator: boolean;
  studio: boolean;
  furnished: boolean;
}

/** Which utilities are included in rent+condo (all-inclusive formulas) */
export interface IncludedUtilities {
  heating: boolean;
  electricity: boolean;
  gas: boolean;
  water: boolean;
  internet: boolean;
  ac: boolean;
}

/**
 * Recurring fixed household costs handled by the tenant.
 * true = the item applies (checkbox active by default).
 */
export interface HouseholdCosts {
  tari: boolean;
  rai: boolean;
  maintenance: boolean;
  smallMaintenance: boolean;
}

export interface AdditionalCost {
  id: string;
  label: string;
  amount: number;
  period: CostPeriod;
}

export interface MobilityCost {
  enabled: boolean;
  mode: 'metro' | 'tram' | 'bus' | 'train' | 'car' | 'bike' | 'walk' | 'other';
  monthlyCost: number;
  distanceMeters: number | null;
  note: string;
}

export interface AgencyFee {
  mode: AgencyFeeMode;
  value: number;
  vatIncluded: boolean;
}

export interface Apartment {
  id: string;
  title: string;
  address: string;
  /** Original listing URL, for example an Idealista page. */
  listingUrl?: string;
  rent: number;
  condo: number;
  condoEstimated: boolean;
  sqm: number;
  rooms: number;
  year: number | null;
  energyClass: EnergyClass;
  ipe: string;
  floorNumber: string;
  floorType: FloorType;
  orientation: Orientation;
  heatingType: HeatingType;
  acType: AcType;
  contract: ContractType;
  cautionMonths: number;
  /** One-off entry costs: agency fee, movers, activation... (€) */
  upfrontCosts: number;
  /** One-off utility switch/activation costs (volture utenze, allaccio fibra...) */
  volture?: number;
  /** Contratto in cedolare secca → registro 0€; altrimenti 2%/anno diviso al 50% col proprietario */
  cedolare?: boolean;
  /** Recurring household costs (checkboxes, default active) */
  household?: HouseholdCosts;
  included: IncludedUtilities;
  features: Features;
  furnishing?: FurnishingType;
  mobility?: MobilityCost;
  additionalCosts?: AdditionalCost[];
  agencyFee?: AgencyFee;
  transit?: { label: string; distanceMeters: number | null };
  notes: string;
  archived: boolean;
}

export interface TariffSettings {
  gasEuroPerSmc: number;
  gasKwhPerSmc: number;
  electricityEuroPerKwh: number;
  cityLabel: string;
  climateZone: string;
  baseClassCost: Record<EnergyClass, number>;
  floorMultiplier: Record<FloorType, number>;
  orientationMultiplier: Record<Orientation, number>;
  heatingMultiplier: Record<HeatingType, number>;
  fixedCentralFee: number;
  acCost: Record<AcType, number>;
  acTopFloorWest: number;
  /** Default flat annual costs used when a utility is NOT included */
  defaultElectricityYear: number;
  defaultWaterYear: number;
  defaultInternetYear: number;
  /** Recurring household fixed costs (€/anno) */
  tariYear: number;
  raiYear: number;
  maintenanceYear: number;
  smallMaintenanceYear: number;
  /** Default one-off volture utenze + attivazione fibra (€) */
  voltureDefault: number;
  /** Tenant share of contract registration per year when NOT cedolare secca (2% / 2 = 1% of annual rent) */
  registroTenantRate: number;
}
