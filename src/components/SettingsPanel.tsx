import { useState } from 'react';
import type { TariffSettings, EnergyClass, FloorType, Orientation, HeatingType, AcType } from '../types';

const input = 'w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none';
const labelEl = 'block font-semibold text-[11px] text-slate-600 mb-1';
const fieldBox = 'bg-slate-50 border border-slate-200 rounded-xl p-3';
const btnBase = 'px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors';

export function SettingsPanel({
  settings,
  onSave,
  onClose,
  onReset,
  onDeleteAllApartments,
  onRestoreDefaultApartments,
}: {
  settings: TariffSettings;
  onSave: (s: TariffSettings) => void;
  onClose: () => void;
  onReset: () => void;
  onDeleteAllApartments: () => void;
  onRestoreDefaultApartments: () => void;
}) {
  const [s, setS] = useState<TariffSettings>(structuredClone(settings));
  const [confirmDelete, setConfirmDelete] = useState(false);

  const set = <K extends keyof TariffSettings>(k: K, v: TariffSettings[K]) => setS((p) => ({ ...p, [k]: v }));
  const setMul = (group: 'baseClassCost' | 'floorMultiplier' | 'orientationMultiplier' | 'heatingMultiplier' | 'acCost', k: string, v: number) =>
    setS((p) => ({ ...p, [group]: { ...p[group], [k]: v } }));

  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(s);
    onClose();
  };

  const numInput = (value: number, onChange: (v: number) => void, step = 1, min = 0) => (
    <input type="number" className={`${input} font-mono`} value={value} onChange={(e) => onChange(+e.target.value || 0)} step={step} min={min} />
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <form onSubmit={apply} className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Impostazioni del modello energetico</h3>
            <p className="text-xs text-slate-500">Tariffe, moltiplicatori fisici e utenze flat. Salvate nel localStorage e incluse nell'export.</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50">✕</button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          <div className={`${fieldBox} grid grid-cols-1 sm:grid-cols-4 gap-3`}>
            <div className="col-span-4">
              <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500 mb-2">Contesto territoriale &amp; tariffe</p>
            </div>
            <div>
              <label className={labelEl}>Città</label>
              <input className={input} value={s.cityLabel} onChange={(e) => set('cityLabel', e.target.value)} />
            </div>
            <div>
              <label className={labelEl}>Zona climatica</label>
              <input className={input} value={s.climateZone} onChange={(e) => set('climateZone', e.target.value)} />
            </div>
            <div>
              <label className={labelEl}>Gas (€/Smc)</label>
              {numInput(s.gasEuroPerSmc, (v) => set('gasEuroPerSmc', v), 0.01)}
            </div>
            <div>
              <label className={labelEl}>Gas (kWh/Smc)</label>
              {numInput(s.gasKwhPerSmc, (v) => set('gasKwhPerSmc', v), 0.1)}
            </div>
            <div>
              <label className={labelEl}>Elettricità (€/kWh)</label>
              {numInput(s.electricityEuroPerKwh, (v) => set('electricityEuroPerKwh', v), 0.01)}
            </div>
            <div>
              <label className={labelEl}>Quota fissa centralizzato (€/anno)</label>
              {numInput(s.fixedCentralFee, (v) => set('fixedCentralFee', v), 5)}
            </div>
          </div>

          <div className={`${fieldBox} grid grid-cols-2 sm:grid-cols-5 gap-3`}>
            <div className="col-span-full">
              <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Costo base invernale per classe APE (€/m²·anno)</p>
            </div>
            {(['A', 'B-C', 'D', 'E', 'F-G'] as EnergyClass[]).map((c) => (
              <div key={c}>
                <label className={labelEl}>Classe {c}</label>
                {numInput(s.baseClassCost[c], (v) => setMul('baseClassCost', c, v), 1)}
              </div>
            ))}
          </div>

          <div className={`${fieldBox} grid grid-cols-2 sm:grid-cols-3 gap-3`}>
            <div className="col-span-full">
              <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Moltiplicatore collocazione (dispersioni)</p>
            </div>
            {(['intermediate', 'ground', 'top'] as FloorType[]).map((f) => (
              <div key={f}>
                <label className={labelEl}>{f === 'intermediate' ? 'Piano intermedio' : f === 'ground' ? 'Terra/seminterrato' : 'Ultimo/sottotetto'}</label>
                {numInput(s.floorMultiplier[f], (v) => setMul('floorMultiplier', f, v), 0.05)}
              </div>
            ))}
          </div>

          <div className={`${fieldBox} grid grid-cols-2 sm:grid-cols-4 gap-3`}>
            <div className="col-span-full">
              <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Moltiplicatore esposizione</p>
            </div>
            {(['south', 'east_mixed', 'west', 'north'] as Orientation[]).map((o) => (
              <div key={o}>
                <label className={labelEl}>{o === 'south' ? 'Sud' : o === 'east_mixed' ? 'Est/misto' : o === 'west' ? 'Ovest' : 'Nord'}</label>
                {numInput(s.orientationMultiplier[o], (v) => setMul('orientationMultiplier', o, v), 0.05)}
              </div>
            ))}
          </div>

          <div className={`${fieldBox} grid grid-cols-2 sm:grid-cols-4 gap-3`}>
            <div className="col-span-full">
              <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Moltiplicatore tipo impianto di riscaldamento</p>
            </div>
            {(['gas_central', 'gas_autonomous', 'heat_pump', 'electric_joule'] as HeatingType[]).map((h) => (
              <div key={h}>
                <label className={labelEl}>{h === 'gas_central' ? 'Metano centralizzato' : h === 'gas_autonomous' ? 'Metano autonomo' : h === 'heat_pump' ? 'Pompa di calore' : 'Resistenza elettrica'}</label>
                {numInput(s.heatingMultiplier[h], (v) => setMul('heatingMultiplier', h, v), 0.05)}
              </div>
            ))}
          </div>

          <div className={`${fieldBox} grid grid-cols-2 sm:grid-cols-4 gap-3`}>
            <div className="col-span-full">
              <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Climatizzazione estiva (€/anno)</p>
            </div>
            {(['split_inverter', 'portable', 'none'] as AcType[]).map((a) => (
              <div key={a}>
                <label className={labelEl}>{a === 'split_inverter' ? 'Split inverter' : a === 'portable' ? 'Portatile (tubo)' : 'Assente'}</label>
                {numInput(s.acCost[a], (v) => setMul('acCost', a, v), 5)}
              </div>
            ))}
            <div>
              <label className={labelEl}>Penalità ultimo piano/Ovest (€/anno)</label>
              {numInput(s.acTopFloorWest, (v) => set('acTopFloorWest', v), 5)}
            </div>
          </div>

          <div className={`${fieldBox} grid grid-cols-2 sm:grid-cols-4 gap-3`}>
            <div className="col-span-full">
              <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Utenze flat usate quando NON incluse nel canone (€/anno)</p>
            </div>
            <div>
              <label className={labelEl}>Elettricità (usi vari)</label>
              {numInput(s.defaultElectricityYear, (v) => set('defaultElectricityYear', v), 10)}
            </div>
            <div>
              <label className={labelEl}>Acqua</label>
              {numInput(s.defaultWaterYear, (v) => set('defaultWaterYear', v), 10)}
            </div>
            <div>
              <label className={labelEl}>Internet Wi-Fi</label>
              {numInput(s.defaultInternetYear, (v) => set('defaultInternetYear', v), 10)}
            </div>
          </div>

          <div className={`${fieldBox} grid grid-cols-2 sm:grid-cols-5 gap-3`}>
            <div className="col-span-full">
              <p className="font-bold text-[11px] uppercase tracking-wide text-slate-500">Spese fisse ricorrenti extra-utenze (€/anno) — checkbox default attive per appartamento</p>
            </div>
            <div>
              <label className={labelEl}>TARI rifiuti</label>
              {numInput(s.tariYear, (v) => set('tariYear', v), 5)}
            </div>
            <div>
              <label className={labelEl}>Canone RAI</label>
              {numInput(s.raiYear, (v) => set('raiYear', v), 5)}
            </div>
            <div>
              <label className={labelEl}>Manutenzione caldaia/split</label>
              {numInput(s.maintenanceYear, (v) => set('maintenanceYear', v), 5)}
            </div>
            <div>
              <label className={labelEl}>Piccola manutenzione</label>
              {numInput(s.smallMaintenanceYear, (v) => set('smallMaintenanceYear', v), 10)}
            </div>
            <div>
              <label className={labelEl}>Volture utenze (€, one-off)</label>
              {numInput(s.voltureDefault, (v) => set('voltureDefault', v), 5)}
            </div>
            <div>
              <label className={labelEl}>Registro contratto (% canone annuo, se non cedolare)</label>
              {numInput(s.registroTenantRate * 100, (v) => set('registroTenantRate', v / 100), 0.1, 0)}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 space-y-3">
          <div className="flex flex-wrap gap-2 justify-start text-xs">
            <button
              type="button"
              onClick={() => { if (confirmDelete) { onDeleteAllApartments(); setConfirmDelete(false); onClose(); } else setConfirmDelete(true); }}
              className={`${btnBase} ${confirmDelete ? 'bg-red-600 hover:bg-red-700 text-white' : 'border border-red-300 text-red-600 hover:bg-red-50'}`}
            >
              {confirmDelete ? '⚠ Confermi cancellazione? (irreversibile)' : '🗑 Cancella tutti gli appartamenti'}
            </button>
            <button type="button" onClick={() => { onRestoreDefaultApartments(); onClose(); }} className={`${btnBase} border border-slate-300 text-slate-700 hover:bg-slate-100`}>
              ⬇ Ripristina appartamenti iniziali (11 default)
            </button>
          </div>
          <div className="flex justify-between items-center">
            <button type="button" onClick={onReset} className="text-xs font-semibold text-red-600 hover:text-red-700">Ripristina valori default del modello energetico</button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-100 text-xs">Annulla</button>
              <button type="submit" className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold shadow-sm text-xs">Salva impostazioni</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
