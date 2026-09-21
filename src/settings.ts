import type { TariffSettings } from './types';

export const DEFAULT_SETTINGS: TariffSettings = {
  gasEuroPerSmc: 1.12,
  gasKwhPerSmc: 9.6,
  electricityEuroPerKwh: 0.3,
  cityLabel: 'Milano',
  climateZone: 'E',
  baseClassCost: { A: 5, 'B-C': 12, D: 20, E: 25, 'F-G': 35 },
  floorMultiplier: { intermediate: 1.0, ground: 1.2, top: 1.25 },
  orientationMultiplier: { south: 0.9, east_mixed: 1.0, west: 1.05, north: 1.1 },
  heatingMultiplier: { gas_central: 1.0, gas_autonomous: 1.0, heat_pump: 0.6, electric_joule: 2.3 },
  fixedCentralFee: 175,
  acCost: { split_inverter: 60, portable: 140, none: 0 },
  acTopFloorWest: 90,
  defaultElectricityYear: 420,
  defaultWaterYear: 180,
  defaultInternetYear: 300,
  tariYear: 125,
  raiYear: 90,
  maintenanceYear: 100,
  smallMaintenanceYear: 200,
  voltureDefault: 80,
  registroTenantRate: 0.01,
  occupants: 1,
  electricPower: '3',
  cookingGasYearPerPerson: 45,
  cookingInductionYearPerPerson: 210,
  gasMeterFixedYear: 120,
  electricPower45ExtraYear: 27,
  additionalCosts: [],
};

export const SETTINGS_KEY = 'milano_rent_settings_v2';

export function mergeSettings(partial: Partial<TariffSettings>): TariffSettings {
  return {
    ...DEFAULT_SETTINGS,
    ...partial,
    baseClassCost: { ...DEFAULT_SETTINGS.baseClassCost, ...partial.baseClassCost },
    floorMultiplier: { ...DEFAULT_SETTINGS.floorMultiplier, ...partial.floorMultiplier },
    orientationMultiplier: { ...DEFAULT_SETTINGS.orientationMultiplier, ...partial.orientationMultiplier },
    heatingMultiplier: { ...DEFAULT_SETTINGS.heatingMultiplier, ...partial.heatingMultiplier },
    acCost: { ...DEFAULT_SETTINGS.acCost, ...partial.acCost },
    additionalCosts: partial.additionalCosts ?? DEFAULT_SETTINGS.additionalCosts,
  };
}

export function loadSettings(): TariffSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return mergeSettings(JSON.parse(raw) as Partial<TariffSettings>);
  } catch {
    /* fall through */
  }
  saveSettings({ ...DEFAULT_SETTINGS });
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(s: TariffSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch (e) {
    console.error('Cannot save settings', e);
  }
}
