import type { Apartment, TariffSettings, UtilityKey } from './types';
import { DEFAULT_SETTINGS } from './settings';

export interface ApartmentMetrics {
  winterThermalCost: number;
  fixedFee: number;
  acAnnual: number;
  utilitiesAnnual: number;
  utilitiesBreakdown: Partial<Record<UtilityKey, number>>;
  annualClimateCost: number;
  monthlyClimateCost: number;
  tenantClimateAnnual: number;
  tenantMonthlyClimateCost: number;
  rent: number;
  condo: number;
  extraUtilitiesMonthly: number;
  additionalMonthlyCost: number;
  additionalAnnualCost: number;
  agencyFee: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
  totalCostPerSqmYear: number;
  totalCostPerSqmMonth: number;
  baseRentPerSqmMonth: number;
  upfrontPerYear: { value: number; contractYears: number } | null;
  entryTotal: number;
  contractYears: number;
  fiveYearTotal: number;
  redFlags: RedFlag[];
}

export interface RedFlag {
  type: 'danger' | 'warning' | 'info';
  title: string;
  desc: string;
}

const CONTRACT_YEARS: Record<Apartment['contract'], number> = {
  transitorio: 1.5,
  '4_4': 4,
  libero: 4,
};

export function contractYears(c: Apartment['contract']): number {
  return CONTRACT_YEARS[c] ?? 4;
}

export function contractLabel(c: Apartment['contract']): string {
  switch (c) {
    case 'transitorio': return 'Transitorio (~18 mesi)';
    case '4_4': return '4+4';
    case 'libero': return 'Libero';
  }
}

export function calculateApartmentMetrics(apt: Apartment, cfg: TariffSettings = DEFAULT_SETTINGS): ApartmentMetrics {
  // Legacy entries may lack the newest fields → normalize
  const household = Object.assign({ tari: true, rai: true, maintenance: true, smallMaintenance: true }, apt.household);
  const volture = apt.volture ?? cfg.voltureDefault;
  const cedolare = apt.cedolare ?? true;
  const sqm = apt.sqm || 50;
  const baseM2Cost = cfg.baseClassCost[apt.energyClass] ?? 20;
  const mFloor = cfg.floorMultiplier[apt.floorType] ?? 1;
  const mEsp = cfg.orientationMultiplier[apt.orientation] ?? 1;
  const mHeat = cfg.heatingMultiplier[apt.heatingType] ?? 1;
  const rent = Math.round(apt.rent);
  const condo = Math.round(apt.condo || 0);
  const gasUnitFactor = (cfg.gasEuroPerSmc / cfg.gasKwhPerSmc) / (DEFAULT_SETTINGS.gasEuroPerSmc / DEFAULT_SETTINGS.gasKwhPerSmc);
  const electricityUnitFactor = cfg.electricityEuroPerKwh / DEFAULT_SETTINGS.electricityEuroPerKwh;
  const vectorFactor = apt.heatingType === 'heat_pump' || apt.heatingType === 'electric_joule'
    ? electricityUnitFactor
    : gasUnitFactor;

  const winterThermalCost = sqm * baseM2Cost * mFloor * mEsp * mHeat * vectorFactor;
  const fixedFee = apt.heatingType === 'gas_central' ? cfg.fixedCentralFee : 0;

  let acAnnual = (cfg.acCost[apt.acType] ?? 0) * electricityUnitFactor;
  if (apt.acType === 'split_inverter' && (apt.floorType === 'top' || apt.orientation === 'west')) {
    acAnnual = cfg.acTopFloorWest * electricityUnitFactor;
  }

  // Utilities not covered by rent/condo/all-inclusive → add estimated flat costs
  const utilitiesBreakdown: Partial<Record<UtilityKey, number>> = {};
  if (!apt.included.electricity) utilitiesBreakdown.electricity = cfg.defaultElectricityYear * electricityUnitFactor;
  if (!apt.included.water) utilitiesBreakdown.water = cfg.defaultWaterYear;
  if (!apt.included.internet) utilitiesBreakdown.internet = cfg.defaultInternetYear;
  if (household.tari) utilitiesBreakdown.tari = cfg.tariYear;
  if (household.rai) utilitiesBreakdown.rai = cfg.raiYear;
  if (household.maintenance) utilitiesBreakdown.maintenance = cfg.maintenanceYear;
  if (household.smallMaintenance) utilitiesBreakdown.small_maintenance = cfg.smallMaintenanceYear;
  if (!cedolare && apt.contract !== 'libero') {
    utilitiesBreakdown.registro = rent * 12 * cfg.registroTenantRate;
  }
  const utilitiesAnnual = Object.values(utilitiesBreakdown).reduce<number>((s, v) => s + (v ?? 0), 0);
  const additionalAnnualCost = (apt.additionalCosts ?? []).reduce(
    (sum, cost) => sum + (cost.period === 'annual' ? cost.amount : cost.amount * 12),
    apt.mobility?.enabled ? apt.mobility.monthlyCost * 12 : 0,
  );
  const additionalMonthlyCost = additionalAnnualCost / 12;

  let agencyFee = 0;
  const agency = apt.agencyFee;
  if (agency?.mode === 'flat') agencyFee = agency.value;
  if (agency?.mode === 'monthly_multiple') agencyFee = rent * agency.value;
  if (agency?.mode === 'annual_percentage') agencyFee = rent * 12 * (agency.value / 100);
  if (agency && agency.mode !== 'none' && !agency.vatIncluded) agencyFee *= 1.22;

  const annualClimateCost = winterThermalCost + fixedFee + acAnnual;
  const monthlyClimateCost = annualClimateCost / 12;
  const tenantClimateAnnual = (apt.included.heating ? 0 : winterThermalCost + fixedFee) + (apt.included.ac ? 0 : acAnnual);
  const tenantMonthlyClimateCost = tenantClimateAnnual / 12;

  const extraUtilitiesMonthly = utilitiesAnnual / 12;
  // NOTE: condo for all-inclusive formulas already contains utilities → nothing extra
  // Entry costs are deliberately excluded: they are one-off and only affect fiveYearTotal.
  const totalMonthlyCost = rent + condo + extraUtilitiesMonthly + tenantMonthlyClimateCost + additionalMonthlyCost;
  const totalAnnualCost = totalMonthlyCost * 12;

  const cYears = contractYears(apt.contract);
  const entryTotal = apt.upfrontCosts + apt.cautionMonths * rent + (volture > 0 ? volture : 0) + agencyFee;
  const upfrontPerYear = entryTotal > 0 ? { value: entryTotal / cYears, contractYears: cYears } : null;

  const fiveYearTotal = totalAnnualCost * 5 + (entryTotal > 0 ? entryTotal * Math.ceil(5 / cYears) : 0);

  const redFlags = detectRedFlags(apt);

  return {
    winterThermalCost,
    fixedFee,
    acAnnual,
    utilitiesAnnual,
    utilitiesBreakdown,
    annualClimateCost,
    monthlyClimateCost,
    tenantClimateAnnual,
    tenantMonthlyClimateCost,
    rent,
    condo,
    extraUtilitiesMonthly,
    additionalMonthlyCost,
    additionalAnnualCost,
    agencyFee,
    totalMonthlyCost,
    totalAnnualCost,
    // Mobility, garage and other user-added extras are cashflow costs, not housing-area costs.
    totalCostPerSqmYear: (totalAnnualCost - additionalAnnualCost) / sqm,
    totalCostPerSqmMonth: (totalMonthlyCost - additionalMonthlyCost) / sqm,
    baseRentPerSqmMonth: rent / sqm,
    upfrontPerYear,
    entryTotal,
    contractYears: cYears,
    fiveYearTotal,
    redFlags,
  };
}

export function detectRedFlags(apt: Apartment): RedFlag[] {
  const flags: RedFlag[] = [];

  if (apt.year && apt.year >= 2020 && (apt.energyClass === 'F-G' || apt.energyClass === 'E') && apt.heatingType === 'electric_joule') {
    flags.push({
      type: 'danger',
      title: "Segnale d'allarme n. 1 (spesa shock)",
      desc: 'Immobile recente in classe bassa con riscaldamento elettrico a resistenza. Possibile ex capannone/C3 privo di isolamento: spesa invernale potenzialmente oltre 2.000 €/anno.',
    });
  } else if (apt.heatingType === 'electric_joule') {
    flags.push({
      type: 'danger',
      title: 'Riscaldamento a resistenza elettrica',
      desc: 'Costo termico ~0,30 €/kWh: bolletta fino a 2,3× rispetto al metano.',
    });
  }

  if (apt.floorType === 'ground' && (apt.energyClass === 'E' || apt.energyClass === 'F-G')) {
    flags.push({
      type: 'warning',
      title: 'Piano terra/seminterrato in classe bassa',
      desc: 'Forte dispersione a terra (+20% in inverno), possibile umidità.',
    });
  }

  if (apt.floorType === 'top' && apt.acType === 'none') {
    flags.push({
      type: 'danger',
      title: 'Ultimo piano / sottotetto senza climatizzatore',
      desc: 'Rischio forno estivo per irraggiamento zenitale (+40-70% consumi AC).',
    });
  }

  if (apt.heatingType === 'gas_central' && apt.condo >= 200) {
    flags.push({
      type: 'warning',
      title: 'Spese condominiali molto elevate (≥200 €/m)',
      desc: 'Possibile quota involontaria riscaldamento elevata o servizi costosi.',
    });
  }

  if (apt.contract === 'transitorio') {
    flags.push({
      type: 'info',
      title: 'Contratto transitorio',
      desc: 'Durata massima limitata (~18 mesi): dovrai cercare di nuovo casa a breve.',
    });
  }

  if (apt.condoEstimated) {
    flags.push({
      type: 'warning',
      title: 'Spese condominiali stimate',
      desc: 'Il valore inserito non è confermato: fatti dare il numero esatto prima della firma.',
    });
  }

  return flags;
}

export function formatEur(v: number, decimals = 0): string {
  return v.toLocaleString('it-IT', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + ' €';
}
