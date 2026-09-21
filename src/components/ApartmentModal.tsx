import { useState } from 'react';
import type { Apartment, ContractType, EnergyClass, AcType, FloorType, HeatingType, Orientation, HouseholdCosts, AgencyFeeMode, CostPeriod } from '../types';
import { normalizeApartment, normalizeListingUrl } from '../data';

const input = 'w-full border border-slate-300 rounded-lg px-2.5 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none';
const labelEl = 'block font-semibold text-[11px] text-slate-700 mb-1';
const section = 'bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5';
const checkboxRow = 'flex items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100 text-[11px]';

function blankId(): string {
  return `app-${Date.now()}`;
}

export function ApartmentModal({
  initial,
  onSave,
  onClose,
}: {
  initial: Apartment | null;
  onSave: (apt: Apartment) => void;
  onClose: () => void;
}) {
  const [apt, setApt] = useState<Apartment>(
    initial ? normalizeApartment(initial) : {
      id: blankId(),
      title: '',
      address: '',
      rent: 900,
      condo: 100,
      condoEstimated: false,
      sqm: 50,
      rooms: 1,
      year: null,
      energyClass: 'D',
      ipe: '',
      floorNumber: '',
      floorType: 'intermediate',
      orientation: 'east_mixed',
      heatingType: 'gas_central',
      acType: 'split_inverter',
      contract: '4_4',
      kitchenType: 'gas',
      cautionMonths: 3,
      upfrontCosts: 0,
      volture: 80,
      cedolare: true,
      household: { tari: true, rai: true, maintenance: true, smallMaintenance: true },
      furnishing: 'furnished',
      mobility: { enabled: false, mode: 'metro', monthlyCost: 0, distanceMeters: null, note: '' },
      additionalCosts: [],
      agencyFee: { mode: 'none', value: 0, vatIncluded: true },
      transit: { label: '', distanceMeters: null },
      included: { heating: false, electricity: false, gas: false, water: false, internet: false, ac: false },
      features: { box: false, terrace: false, bidet: true, shower: true, induction: false, elevator: true, studio: false, furnished: true },
      notes: '',
      archived: false,
    },
  );

  const set = <K extends keyof Apartment>(k: K, v: Apartment[K]) => setApt((a) => ({ ...a, [k]: v }));
  const setInc = (k: keyof Apartment['included'], v: boolean) => setApt((a) => ({ ...a, included: { ...a.included, [k]: v } }));
  const setHH = (k: keyof HouseholdCosts, v: boolean) =>
    setApt((a) => {
      const hh: HouseholdCosts = { tari: true, rai: true, maintenance: true, smallMaintenance: true, ...a.household };
      return { ...a, household: { ...hh, [k]: v } };
    });
  const setFeat = (k: keyof Apartment['features'], v: boolean) => setApt((a) => ({ ...a, features: { ...a.features, [k]: v } }));
  const setMobility = (key: keyof NonNullable<Apartment['mobility']>, value: string | number | boolean | null) => setApt((a) => ({ ...a, mobility: { enabled: false, mode: 'metro', monthlyCost: 0, distanceMeters: null, note: '', ...a.mobility, [key]: value } as Apartment['mobility'] }));
  const setAgency = (key: keyof NonNullable<Apartment['agencyFee']>, value: AgencyFeeMode | number | boolean) => setApt((a) => ({ ...a, agencyFee: { mode: 'none', value: 0, vatIncluded: true, ...a.agencyFee, [key]: value } as Apartment['agencyFee'] }));
  const setTransit = (key: keyof NonNullable<Apartment['transit']>, value: string | number | null) => setApt((a) => ({ ...a, transit: { label: '', distanceMeters: null, ...a.transit, [key]: value } as Apartment['transit'] }));
  const updateExtraCost = (id: string, key: 'label' | 'amount' | 'period', value: string | number | CostPeriod) => setApt((a) => ({ ...a, additionalCosts: (a.additionalCosts ?? []).map((cost) => cost.id === id ? { ...cost, [key]: value } : cost) }));
  const addExtraCost = () => setApt((a) => ({ ...a, additionalCosts: [...(a.additionalCosts ?? []), { id: `extra-${Date.now()}`, label: '', amount: 0, period: 'monthly' }] }));
  const removeExtraCost = (id: string) => setApt((a) => ({ ...a, additionalCosts: (a.additionalCosts ?? []).filter((cost) => cost.id !== id) }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apt.title.trim() || !apt.address.trim()) return;
    onSave(normalizeApartment({ ...apt, title: apt.title.trim(), address: apt.address.trim(), listingUrl: normalizeListingUrl(apt.listingUrl) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <form onSubmit={submit} className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <h3 className="text-base font-bold text-slate-900">{initial ? 'Modifica appartamento' : 'Nuovo appartamento'}</h3>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50">✕</button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelEl}>Titolo annuncio *</label>
              <input className={input} value={apt.title} onChange={(e) => set('title', e.target.value)} required placeholder="es. Bilocale con terrazzo Dergano" />
            </div>
            <div>
              <label className={labelEl}>Indirizzo &amp; zona *</label>
              <input className={input} value={apt.address} onChange={(e) => set('address', e.target.value)} required placeholder="es. Via Imbonati 23, Dergano" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelEl}>Link annuncio (Idealista, Immobiliare.it, ecc.)</label>
              <input type="url" className={input} value={apt.listingUrl ?? ''} onChange={(e) => set('listingUrl', e.target.value)} placeholder="https://www.idealista.it/immobile/..." />
            </div>
          </div>

          <div className={section}>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className={labelEl}>Canone (€/m)</label>
                <input type="number" min={0} className={`${input} font-bold`} value={apt.rent} onChange={(e) => set('rent', +e.target.value)} required />
              </div>
              <div>
                <label className={labelEl}>Spese cond. (€/m)</label>
                <input type="number" min={0} className={input} value={apt.condo} onChange={(e) => set('condo', +e.target.value)} required />
              </div>
              <div>
                <label className={labelEl}>m²</label>
                <input type="number" min={10} className={input} value={apt.sqm} onChange={(e) => set('sqm', +e.target.value)} required />
              </div>
              <div>
                <label className={labelEl}>Locali</label>
                <input type="number" min={1} className={input} value={apt.rooms} onChange={(e) => set('rooms', +e.target.value)} />
              </div>
              <div>
                <label className={labelEl}>Anno costruz.</label>
                <input type="number" className={input} value={apt.year ?? ''} onChange={(e) => set('year', e.target.value ? +e.target.value : null)} placeholder="es. 2008" />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className={labelEl}>Tipo contratto</label>
                <select className={input} value={apt.contract} onChange={(e) => set('contract', e.target.value as ContractType)}>
                   <option value="4_4">4+4</option>
                   <option value="3_2">3+2</option>
                   <option value="transitorio">Transitorio (~18 mesi)</option>
                </select>
              </div>
              <div>
                <label className={labelEl}>Cauzione (mesi)</label>
                <input type="number" min={0} step={1} className={input} value={apt.cautionMonths} onChange={(e) => set('cautionMonths', +e.target.value)} />
              </div>
              <div>
                <label className={labelEl}>Tipo cucina</label>
                <select className={input} value={apt.kitchenType ?? (apt.features.induction ? 'induction' : 'gas')} onChange={(e) => set('kitchenType', e.target.value as Apartment['kitchenType'])}>
                  <option value="gas">Gas</option>
                  <option value="induction">Induzione</option>
                </select>
              </div>
              <div>
                <label className={labelEl}>Costo ingresso extra (€)</label>
                <input type="number" min={0} className={input} value={apt.upfrontCosts} onChange={(e) => set('upfrontCosts', +e.target.value)} />
              </div>
              <div>
                <label className={labelEl}>Volture utenze / fibra (€)</label>
                <input type="number" min={0} className={input} value={apt.volture} onChange={(e) => set('volture', +e.target.value)} />
              </div>
              <label className={`pt-5 ${checkboxRow}`}>
                <input type="checkbox" checked={apt.cedolare} onChange={(e) => set('cedolare', e.target.checked)} className="rounded text-brand-600" />
                <span>Cedolare secca (registro = 0 €)</span>
              </label>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-200 dark:border-slate-700 pt-3">
              <div>
                <label className={labelEl}>Proprietario / agenzia</label>
                <select className={input} value={apt.agencyFee?.mode ?? 'none'} onChange={(e) => setAgency('mode', e.target.value as AgencyFeeMode)}>
                  <option value="none">Privato / nessuna provvigione</option>
                  <option value="flat">Agenzia: importo fisso</option>
                  <option value="monthly_multiple">Agenzia: numero mensilità</option>
                  <option value="annual_percentage">Agenzia: % canone annuo</option>
                </select>
              </div>
              {apt.agencyFee?.mode !== 'none' && <>
                <div>
                  <label className={labelEl}>{apt.agencyFee?.mode === 'flat' ? 'Importo (€)' : apt.agencyFee?.mode === 'monthly_multiple' ? 'Mensilità' : 'Percentuale annua (%)'}</label>
                  <input type="number" min={0} step={apt.agencyFee?.mode === 'annual_percentage' ? 0.1 : 1} className={input} value={apt.agencyFee?.value ?? 0} onChange={(e) => setAgency('value', +e.target.value || 0)} />
                </div>
                <label className={`pt-5 ${checkboxRow}`}>
                  <input type="checkbox" checked={apt.agencyFee?.vatIncluded ?? true} onChange={(e) => setAgency('vatIncluded', e.target.checked)} className="rounded text-brand-600" />
                  IVA già inclusa
                </label>
              </>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelEl}>Classe energetica</label>
              <select className={`${input} font-bold`} value={apt.energyClass} onChange={(e) => set('energyClass', e.target.value as EnergyClass)}>
                <option value="A">A (≤45 kWh/m²a)</option>
                <option value="B-C">B-C (45-85)</option>
                <option value="D">D (85-130)</option>
                <option value="E">E (130-170)</option>
                <option value="F-G">F-G (&gt;170)</option>
              </select>
            </div>
            <div>
              <label className={labelEl}>IPE / nota</label>
              <input className={input} value={apt.ipe} onChange={(e) => set('ipe', e.target.value)} placeholder="es. 180.97 kWh/m² anno" />
            </div>
            <div>
              <label className={labelEl}>Descrizione piano</label>
              <input className={input} value={apt.floorNumber} onChange={(e) => set('floorNumber', e.target.value)} placeholder="es. 5° piano con ascensore" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className={labelEl}>Collocazione</label>
              <select className={input} value={apt.floorType} onChange={(e) => set('floorType', e.target.value as FloorType)}>
                <option value="intermediate">Intermedio (×1.0)</option>
                <option value="ground">Terra/semint. (×1.2)</option>
                <option value="top">Ultimo/sottotetto (×1.25)</option>
              </select>
            </div>
            <div>
              <label className={labelEl}>Esposizione</label>
              <select className={input} value={apt.orientation} onChange={(e) => set('orientation', e.target.value as Orientation)}>
                <option value="south">Sud (×0.9)</option>
                <option value="east_mixed">Est/misto (×1.0)</option>
                <option value="west">Ovest (×1.05)</option>
                <option value="north">Nord (×1.1)</option>
              </select>
            </div>
            <div>
              <label className={labelEl}>Riscaldamento</label>
              <select className={input} value={apt.heatingType} onChange={(e) => set('heatingType', e.target.value as HeatingType)}>
                <option value="gas_central">Centralizzato gas (quota fissa)</option>
                <option value="gas_autonomous">Autonomo gas</option>
                <option value="heat_pump">Pompa di calore (×0.6)</option>
                <option value="electric_joule">Resistenza elettrica (×2.3!)</option>
              </select>
            </div>
            <div>
              <label className={labelEl}>Climatizzazione estiva</label>
              <select className={input} value={apt.acType} onChange={(e) => set('acType', e.target.value as AcType)}>
                <option value="split_inverter">Split inverter</option>
                <option value="portable">Portatile</option>
                <option value="none">Assente</option>
              </select>
            </div>
          </div>

          <div className={section}>
            <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Posizione e pendolarismo</p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className={labelEl}>Trasporto / punto vicino</label>
                <input className={input} value={apt.transit?.label ?? ''} onChange={(e) => setTransit('label', e.target.value)} placeholder="es. M3 Dergano" />
              </div>
              <div>
                <label className={labelEl}>Distanza (metri)</label>
                <input type="number" min={0} className={input} value={apt.transit?.distanceMeters ?? ''} onChange={(e) => setTransit('distanceMeters', e.target.value ? +e.target.value : null)} placeholder="350" />
              </div>
              <label className={`pt-5 ${checkboxRow}`}>
                <input type="checkbox" checked={apt.mobility?.enabled ?? false} onChange={(e) => setMobility('enabled', e.target.checked)} className="rounded text-brand-600" />
                Calcola costo trasporto
              </label>
            </div>
            {apt.mobility?.enabled && <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelEl}>Modalità</label>
                <select className={input} value={apt.mobility.mode} onChange={(e) => setMobility('mode', e.target.value)}>
                  <option value="metro">Metro</option><option value="tram">Tram</option><option value="bus">Bus</option><option value="train">Treno</option><option value="car">Auto</option><option value="bike">Bici</option><option value="walk">A piedi</option><option value="other">Altro</option>
                </select>
              </div>
              <div>
                <label className={labelEl}>Costo trasporto (€/mese)</label>
                <input type="number" min={0} step={0.01} className={input} value={apt.mobility.monthlyCost} onChange={(e) => setMobility('monthlyCost', +e.target.value || 0)} />
              </div>
              <div>
                <label className={labelEl}>Nota</label>
                <input className={input} value={apt.mobility.note} onChange={(e) => setMobility('note', e.target.value)} placeholder="Abbonamento ATM" />
              </div>
            </div>}
          </div>

          <div className={section}>
            <div className="flex justify-between items-center">
              <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Costi aggiuntivi ricorrenti</p>
              <button type="button" onClick={addExtraCost} className="px-2 py-1 rounded bg-indigo-100 text-indigo-800 text-[11px] font-bold">+ Aggiungi costo</button>
            </div>
            {(apt.additionalCosts ?? []).map((cost) => <div key={cost.id} className="grid grid-cols-1 sm:grid-cols-[1fr_100px_110px_auto] gap-2 items-end">
              <div><label className={labelEl}>Descrizione</label><input className={input} value={cost.label} onChange={(e) => updateExtraCost(cost.id, 'label', e.target.value)} placeholder="Garage, palestra..." /></div>
              <div><label className={labelEl}>Importo (€)</label><input type="number" min={0} step={0.01} className={input} value={cost.amount} onChange={(e) => updateExtraCost(cost.id, 'amount', +e.target.value || 0)} /></div>
              <div><label className={labelEl}>Periodicità</label><select className={input} value={cost.period} onChange={(e) => updateExtraCost(cost.id, 'period', e.target.value as CostPeriod)}><option value="monthly">Mensile</option><option value="annual">Annuale</option></select></div>
              <button type="button" onClick={() => removeExtraCost(cost.id)} className="px-2 py-2 text-red-600" title="Rimuovi">✕</button>
            </div>)}
            <p className="text-[10px] text-slate-500">Entrano nel cashflow mensile, ma non nel costo casa al m².</p>
          </div>

          <div className={section}>
            <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Utenze incluse in canone e spese (se spuntata → costo 0, altrimenti stima flat)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([['heating', 'Riscaldamento'], ['electricity', 'Elettricità'], ['gas', 'Gas (cucina/ACS)'], ['water', 'Acqua'], ['internet', 'Internet / Wi-Fi'], ['ac', 'Uso AC / brillamento']] as const).map(([k, lbl]) => (
                <label key={k} className={checkboxRow}>
                  <input type="checkbox" checked={apt.included[k]} onChange={(e) => setInc(k, e.target.checked)} className="rounded text-brand-600" />
                  <span>{lbl} incluso{}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={section}>
            <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Spese fisse ricorrenti extra-utenze (valori stimati, modificabili nelle impostazioni)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {([['tari', 'TARI rifiuti'], ['rai', 'Canone RAI'], ['maintenance', 'Manutenzione caldaia/split'], ['smallMaintenance', 'Piccola manutenzione & consumabili']] as const).map(([k, lbl]) => (
                <label key={k} className={checkboxRow}>
                  <input type="checkbox" checked={apt.household![k]} onChange={(e) => setHH(k, e.target.checked)} className="rounded text-brand-600" />
                  <span>{lbl}</span>
                </label>
              ))}
              {!apt.cedolare && (
                <span className={`${checkboxRow} bg-amber-50 border-amber-200 text-amber-800`}>
                  Registro contratto: {((apt.rent * 12) / 200).toFixed(0).replace('.', ',')} €/anno a tuo carico
                </span>
              )}
              <label className={checkboxRow}>
                <input type="checkbox" checked={apt.condoEstimated} onChange={(e) => set('condoEstimated', e.target.checked)} className="rounded text-brand-600" />
                <span>Spese cond. stimate</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {([['box', 'Box/garage'], ['terrace', 'Terrazzo'], ['elevator', 'Ascensore'], ['bidet', 'Bidet'], ['shower', 'Doccia'], ['induction', 'Cucina induzione'], ['studio', 'Zona studio']] as const).map(([k, lbl]) => (
              <label key={k} className={checkboxRow}>
                <input type="checkbox" checked={apt.features[k]} onChange={(e) => setFeat(k, e.target.checked)} className="rounded text-brand-600" />
                <span>{lbl}</span>
              </label>
            ))}
            <div className="col-span-2 sm:col-span-1"><label className={labelEl}>Arredamento</label><select className={input} value={apt.furnishing ?? 'furnished'} onChange={(e) => set('furnishing', e.target.value as Apartment['furnishing'])}><option value="furnished">Arredato</option><option value="partial">Parzialmente arredato</option><option value="empty">Vuoto</option></select></div>
          </div>

          <div>
            <label className={labelEl}>Considerazioni personali</label>
            <textarea rows={2} className={input} value={apt.notes} onChange={(e) => set('notes', e.target.value)} placeholder="Terrazzo grande, cucina a induzione, piano seminterrato..." />
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 flex justify-end gap-2 bg-slate-50">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 text-xs">Annulla</button>
          <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold shadow-sm text-xs">Salva appartamento</button>
        </div>
      </form>
    </div>
  );
}
