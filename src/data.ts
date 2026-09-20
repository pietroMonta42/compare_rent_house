import type { Apartment } from './types';
import { DEFAULT_SETTINGS } from './settings';

const emptyIncluded: Apartment['included'] = {
  heating: false, electricity: false, gas: false, water: false, internet: false, ac: false,
};
const emptyFeatures: Apartment['features'] = {
  box: false, terrace: false, bidet: true, shower: true, induction: false, elevator: true, studio: false, furnished: true,
};

export const DEFAULT_APARTMENTS: Apartment[] = [
  {
    id: 'app-1',
    title: 'Monolocale con Grande Terrazzo & Box',
    address: 'Via Privata Don Bartolomeo Grazioli 33, Affori',
    rent: 850, condo: 150, condoEstimated: false, sqm: 56, rooms: 1, year: 2008,
    energyClass: 'D', ipe: '180.97 kWh/m² anno', floorNumber: '5° piano', floorType: 'intermediate',
    orientation: 'east_mixed', heatingType: 'gas_central', acType: 'split_inverter',
    contract: 'libero', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, water: true },
    features: { ...emptyFeatures, box: true, terrace: true, induction: true, shower: false },
    notes: 'Terrazzo molto grande e vivibile, affaccio su cortile interno piacevole e luminoso. Vasca da bagno, bidet presente. Box auto e cantina inclusi nel prezzo. Cucina a induzione.',
    archived: false,
  },
  {
    id: 'app-2',
    title: 'Loft Ristrutturato (Piano Seminterrato)',
    address: 'Via Camillo Prampolini 6, Dergano',
    rent: 800, condo: 120, condoEstimated: true, sqm: 60, rooms: 2, year: null,
    energyClass: 'E', ipe: 'Non indicato', floorNumber: 'Piano Terra / Seminterrato', floorType: 'ground',
    orientation: 'west', heatingType: 'gas_central', acType: 'split_inverter',
    contract: 'libero', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, internet: true, water: true },
    features: { ...emptyFeatures, induction: true, terrace: false },
    notes: 'Bello spazioso (60 mq reali a 2 locali), ristrutturato a nuovo con cucina a induzione e doccia. Attenzione: seminterrato con finestre alte, non ti puoi affacciare; giardino del condominio. Cauzione 3 mesi.',
    archived: false,
  },
  {
    id: 'app-3',
    title: 'Bilocale con Studio & Formula All-Inclusive',
    address: 'Via Monte San Genesio 21, Dergano',
    rent: 900, condo: 200, condoEstimated: false, sqm: 65, rooms: 2, year: 1940,
    energyClass: 'D', ipe: 'Non indicato', floorNumber: '4° piano (Sottotetto)', floorType: 'top',
    orientation: 'south', heatingType: 'gas_central', acType: 'split_inverter',
    contract: 'libero', cautionMonths: 3, upfrontCosts: 0,
    included: { heating: true, electricity: true, gas: true, water: true, internet: true, ac: true },
    features: { ...emptyFeatures, studio: true, induction: false },
    notes: 'Molto grande e carino (65 mq): zona studio separata perfetta per smart working, camera con cabina armadio, doccia e bidet. Sottotetto con finestre, orientamento Sud. Formula all-inclusive (900 + 200 spese), utenze comprese senza conguagli.',
    archived: false,
  },
  {
    id: 'app-4',
    title: 'Bilocale Soppalcato con Posto Auto',
    address: 'Via Privata Antonio Fortunato Stella 5, Greco',
    rent: 950, condo: 50, condoEstimated: false, sqm: 55, rooms: 2, year: 2023,
    energyClass: 'F-G', ipe: 'Classe G (non specificato)', floorNumber: 'Piano Terra + Soppalco', floorType: 'ground',
    orientation: 'west', heatingType: 'electric_joule', acType: 'split_inverter',
    contract: 'libero', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, water: true },
    features: { ...emptyFeatures, box: true, induction: true },
    notes: 'Costruito/ristrutturato nel 2023, soggiorno con cucina a vista, camera soppalcata. Posto auto scoperto, 2 split AC, bagno rifinito con boiler. Attenzione al riscaldamento elettrico in Classe G!',
    archived: false,
  },
  {
    id: 'app-5',
    title: 'Monolocale con Giardino Esterno & Termoautonomo',
    address: 'Via Stefano Ussi 21, Cà Granda - Pratocentenaro',
    rent: 900, condo: 150, condoEstimated: false, sqm: 52, rooms: 1, year: 1980,
    energyClass: 'E', ipe: '134.66 kWh/m² anno', floorNumber: 'Piano Terra (senza ascensore)', floorType: 'ground',
    orientation: 'south', heatingType: 'gas_autonomous', acType: 'split_inverter',
    contract: 'libero', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, water: true },
    features: { ...emptyFeatures, terrace: true, elevator: false },
    notes: 'Carino con giardino/balcone esterno. Riscaldamento autonomo a metano (zero quote fisse di centralizzato). Senza ascensore (a piano terra non impatta).',
    archived: false,
  },
  {
    id: 'app-6',
    title: 'Bilocale Ristrutturato Residenza Pegaso',
    address: 'Piazza dei Daini 4, Bicocca - Bignami',
    rent: 900, condo: 250, condoEstimated: false, sqm: 51, rooms: 2, year: 2000,
    energyClass: 'B-C', ipe: '119.33 kWh/m² anno (Classe C)', floorNumber: 'Piano rialzato con ascensore', floorType: 'ground',
    orientation: 'east_mixed', heatingType: 'gas_central', acType: 'split_inverter',
    contract: 'transitorio', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, water: true },
    features: { ...emptyFeatures, induction: true },
    notes: 'Ottima posizione signorile Residenza Pegaso Bicocca. Bagno ottimo con bidet, doccia, lavatrice e asciugatrice. ATTENZIONE: contratto solo TRANSITORIO max 18 mesi e spese condominiali molto alte (250 €/mese).',
    archived: false,
  },
  {
    id: 'app-7',
    title: "Bilocale Ristrutturato d'Epoca Vicino M5",
    address: 'Via Cino da Pistoia 18, Cà Granda - Pratocentenaro',
    rent: 900, condo: 150, condoEstimated: false, sqm: 50, rooms: 2, year: 1900,
    energyClass: 'F-G', ipe: '175.40 kWh/m² anno (Classe F)', floorNumber: '1° piano con ascensore', floorType: 'intermediate',
    orientation: 'east_mixed', heatingType: 'gas_autonomous', acType: 'split_inverter',
    contract: 'libero', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, water: true },
    features: { ...emptyFeatures, induction: false },
    notes: "Edificio storico del '900 ristrutturato con ascensore. Posizione strategica a due passi dalla metro M5 Cà Granda. Molto spazio generale ma zona giorno (sala e cucina) un po' stretta.",
    archived: false,
  },
  {
    id: 'app-8',
    title: 'Attico Mansardato con Terrazzino (Pompa di Calore)',
    address: 'Via Comune Antico, Greco - Bicocca',
    rent: 900, condo: 100, condoEstimated: false, sqm: 40, rooms: 1, year: 2024,
    energyClass: 'B-C', ipe: 'Classe C (nuova ristrutturazione)', floorNumber: '1° e ultimo piano (sottotetto)', floorType: 'top',
    orientation: 'south', heatingType: 'heat_pump', acType: 'split_inverter',
    contract: 'libero', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, water: true },
    features: { ...emptyFeatures, terrace: true, elevator: false, induction: true },
    notes: "Monolocale mansardato con divano-letto e terrazzino vivibile. Ristrutturazione completata con pompa di calore (alta efficienza B-C). Senza ascensore (1° piano). Forse un po' piccolo (40 m² comm., 37 calp.), non vicinissimo alla metro e poche foto del bagno.",
    archived: false,
  },
  {
    id: 'app-9',
    title: 'Bilocale con Balcone e Camino',
    address: 'Via Carlo Imbonati 23, Dergano',
    rent: 900, condo: 100, condoEstimated: false, sqm: 55, rooms: 2, year: null,
    energyClass: 'F-G', ipe: '≥175 kWh/m² anno (Classe F)', floorNumber: '2° piano (senza ascensore)', floorType: 'intermediate',
    orientation: 'east_mixed', heatingType: 'gas_autonomous', acType: 'split_inverter',
    contract: 'transitorio', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, water: true },
    features: { ...emptyFeatures, terrace: true, elevator: false },
    notes: 'Carino, bagno ben tenuto, caminetto e balcone. Riscaldamento autonomo a metano (nessuna quota fissa). Contratto transitorio. Senza ascensore al 2° piano. Spese condominiali contenute (100 €/m).',
    archived: false,
  },
  {
    id: 'app-10',
    title: 'Bilocale Ristrutturato Loreto / Buenos Aires',
    address: 'Viale Abruzzi 84, Città Studi',
    rent: 950, condo: 170, condoEstimated: false, sqm: 44, rooms: 2, year: null,
    energyClass: 'F-G', ipe: 'Classe G (non specificato)', floorNumber: '1° piano con ascensore', floorType: 'intermediate',
    orientation: 'east_mixed', heatingType: 'gas_central', acType: 'split_inverter',
    contract: 'transitorio', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, water: true },
    features: { ...emptyFeatures, terrace: true },
    notes: 'Posizione eccezionale (M1/M2 Loreto sotto casa e Corso Buenos Aires). Ristrutturato a nuovo con bagno doccia e climatizzatore. Esposizione interna (più silenzioso). ATTENZIONE: contratto solo TRANSITORIO max 18 mesi, superficie contenuta (44 m²), spese consistenti (170 €/m) e Classe G.',
    archived: false,
  },
  {
    id: 'app-11',
    title: 'Bilocale Ristrutturato con Dual Split M3 Dergano',
    address: 'Via Pellegrino Rossi 19, Dergano',
    rent: 900, condo: 50, condoEstimated: false, sqm: 44, rooms: 2, year: 1970,
    energyClass: 'E', ipe: '207.74 / 352.87 kWh/m² anno (Classe E)', floorNumber: 'Piano rialzato con ascensore', floorType: 'ground',
    orientation: 'east_mixed', heatingType: 'gas_central', acType: 'split_inverter',
    contract: '4_4', cautionMonths: 3, upfrontCosts: 0,
    included: { ...emptyIncluded, water: true },
    features: { ...emptyFeatures, induction: false },
    notes: 'Completamente ristrutturato e arredato nuovo. A soli 350m da M3 Dergano. Pompa di calore dual split per raffrescamento e integrazione riscaldamento. Spese straordinariamente basse (50 €/mese). Disponibile dal 10/10/2026. Si valuta 4+4 in cedolare secca o transitorio.',
    archived: false,
  },
];

const emptyHousehold: NonNullable<Apartment['household']> = { tari: true, rai: true, maintenance: true, smallMaintenance: true };
const legacyIncludedDefaults: Apartment['included'] = { ...emptyIncluded, water: true };

export function normalizeListingUrl(value: unknown): string {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    const url = new URL(candidate);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

/** Backfills fields added after the initial release so stored data keeps working. */
export function normalizeApartment(a: Apartment): Apartment {
  const legacy = a as Apartment & {
    personalNotes?: string;
    features?: Partial<Apartment['features']> & { allinclusive?: boolean };
  };
  const allInclusive = legacy.features?.allinclusive === true;
  return {
    ...a,
    id: a.id ?? `app-${Date.now()}`,
    listingUrl: normalizeListingUrl(a.listingUrl),
    condoEstimated: a.condoEstimated ?? false,
    rooms: a.rooms ?? 1,
    year: a.year ?? null,
    ipe: a.ipe ?? '',
    floorNumber: a.floorNumber ?? '',
    contract: a.contract ?? '4_4',
    cautionMonths: a.cautionMonths ?? 3,
    upfrontCosts: a.upfrontCosts ?? 0,
    included: {
      ...legacyIncludedDefaults,
      ...(a.included ?? {}),
      ...(allInclusive ? { heating: true, electricity: true, gas: true, water: true, internet: true, ac: true } : {}),
    },
    features: { ...emptyFeatures, ...(legacy.features ?? {}) },
    furnishing: a.furnishing ?? (legacy.features?.furnished === false ? 'empty' : 'furnished'),
    mobility: a.mobility ?? { enabled: false, mode: 'metro', monthlyCost: 0, distanceMeters: null, note: '' },
    additionalCosts: a.additionalCosts ?? [],
    agencyFee: a.agencyFee ?? { mode: 'none', value: 0, vatIncluded: true },
    transit: a.transit ?? { label: '', distanceMeters: null },
    notes: a.notes ?? legacy.personalNotes ?? '',
    archived: a.archived ?? false,
    volture: a.volture ?? 80,
    cedolare: a.cedolare ?? true,
    household: a.household ?? { ...emptyHousehold },
  };
}

export const APARTMENTS_KEY = 'milano_rent_apartments_v2';
export const LEGACY_APARTMENTS_KEY = 'milano_rent_apartments_v5';
export const SETTINGS_KEY = 'milano_rent_settings_v2';
export const INITIALIZED_KEY = 'milano_rent_initialized_v2';

/**
 * Seeds the browser DB only on first run (apartments + settings).
 * Existing data from any previous session is never overwritten.
 * After that the stored data is the source of truth, even if the user
 * deletes everything: we never re-seed automatically.
 */
export function ensureDbInitialized(): boolean {
  if (localStorage.getItem(INITIALIZED_KEY)) return false;
  try {
    if (!localStorage.getItem(APARTMENTS_KEY)) {
      const legacyRaw = localStorage.getItem(LEGACY_APARTMENTS_KEY);
      let seed = DEFAULT_APARTMENTS.map(normalizeApartment);
      if (legacyRaw) {
        try {
          const legacy = JSON.parse(legacyRaw) as Apartment[];
          if (Array.isArray(legacy)) seed = legacy.map(normalizeApartment);
        } catch {
          /* use current defaults */
        }
      }
      localStorage.setItem(APARTMENTS_KEY, JSON.stringify(seed));
    }
    if (!localStorage.getItem(SETTINGS_KEY)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    }
    localStorage.setItem(INITIALIZED_KEY, new Date().toISOString());
    return true;
  } catch {
    return false;
  }
}

/** Reset the "first run" marker (lets the seeding start over). */
export function resetDbInitialized(): void {
  localStorage.removeItem(INITIALIZED_KEY);
}

export function loadApartments(): Apartment[] {
  ensureDbInitialized();
  try {
    const raw = localStorage.getItem(APARTMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Apartment[];
      if (Array.isArray(parsed)) return parsed.map(normalizeApartment);
    }
  } catch {
    /* fall through */
  }
  return structuredClone(DEFAULT_APARTMENTS).map(normalizeApartment);
}

export function saveApartments(list: Apartment[]): void {
  try {
    localStorage.setItem(APARTMENTS_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Cannot save apartments', e);
  }
}
