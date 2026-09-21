import type { Apartment, EnergyClass } from '../types';
import type { ApartmentMetrics } from '../calc';
import { formatEur } from '../calc';
import { normalizeListingUrl } from '../data';

const badge = 'badge inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold';

export function energyBadgeClass(c: EnergyClass): string {
  switch (c) {
    case 'A': return 'bg-emerald-100 text-emerald-800';
    case 'B-C': return 'bg-lime-100 text-lime-800';
    case 'D': return 'bg-amber-100 text-amber-800';
    case 'E': return 'bg-orange-100 text-orange-800';
    default: return 'bg-red-100 text-red-800';
  }
}

export function Buildings({ className }: { className?: string }) {
  return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" />;
}

export function ApartmentCard({
  apt,
  m,
  onEdit,
  onDuplicate,
  onDelete,
  onArchive,
}: {
  apt: Apartment;
  m: ApartmentMetrics;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onArchive: () => void;
}) {
  const listingUrl = normalizeListingUrl(apt.listingUrl);
  const flagColor = { danger: 'bg-red-50 border-red-200 text-red-900', warning: 'bg-amber-50 border-amber-200 text-amber-900', info: 'bg-sky-50 border-sky-200 text-sky-900' };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden">
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            <span className={`${badge} ${energyBadgeClass(apt.energyClass)}`}>Classe {apt.energyClass}</span>
            {apt.contract === 'transitorio' && <span className={`${badge} bg-purple-100 text-purple-800`}>Transitorio</span>}
            {apt.furnishing === 'partial' && <span className={`${badge} bg-indigo-100 text-indigo-800`}>Parzialmente arredato</span>}
            {apt.furnishing === 'empty' && <span className={`${badge} bg-slate-200 text-slate-700`}>Vuoto</span>}
            {apt.acType !== 'none' && <span className={`${badge} bg-sky-100 text-sky-800`}>Clima</span>}
            {apt.features.box && <span className={`${badge} bg-slate-800 text-white`}>Box</span>}
            {apt.features.terrace && <span className={`${badge} bg-amber-500 text-white`}>Terrazzo</span>}
            {apt.archived && <span className={`${badge} bg-slate-200 text-slate-600`}>Archiviato</span>}
          </div>
          <div className="flex items-center gap-1 shrink-0 print:hidden">
            <button onClick={onEdit} title="Modifica" className="p-1.5 text-slate-400 hover:text-brand-600 rounded hover:bg-slate-100">✎</button>
            <button onClick={onDuplicate} title="Duplica" className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100">⧉</button>
            <button onClick={onArchive} title={apt.archived ? 'Riattiva' : 'Archivia'} className="p-1.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100">{apt.archived ? '⬆' : '⬇'}</button>
            <button onClick={onDelete} title="Elimina" className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-100">🗑</button>
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 leading-snug">
          {listingUrl ? (
            <a href={listingUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 hover:underline" title="Apri annuncio originale">
              {apt.title} ↗
            </a>
          ) : apt.title}
        </h3>
        <p className="text-xs text-slate-500 -mt-2">
          {listingUrl ? <a href={listingUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 hover:underline">{apt.address}</a> : apt.address}
        </p>
        {(apt.transit?.label || apt.mobility?.enabled) && <p className="text-[11px] text-indigo-700">{apt.transit?.label ? `${apt.transit.label}${apt.transit.distanceMeters ? ` · ${apt.transit.distanceMeters} m` : ''}` : ''}{apt.mobility?.enabled && ` · ${apt.mobility.mode} ${formatEur(apt.mobility.monthlyCost, 2)}/m`}</p>}

        <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs">
          <div><span className="block text-[10px] uppercase font-semibold text-slate-400">Superficie</span><span className="font-bold text-slate-800">{apt.sqm} m²</span></div>
          <div><span className="block text-[10px] uppercase font-semibold text-slate-400">Piano</span><span className="font-bold text-slate-800 truncate" title={apt.floorNumber}>{apt.floorNumber}</span></div>
          <div><span className="block text-[10px] uppercase font-semibold text-slate-400">Locali</span><span className="font-bold text-slate-800">{apt.rooms}</span></div>
        </div>

        <div className="p-3 bg-brand-50/60 rounded-xl border border-brand-100 text-xs space-y-1">
          <div className="flex justify-between"><span className="text-slate-600">Canone:</span><span className="font-bold text-slate-900">{formatEur(m.rent, 2)}/m</span></div>
          <div className="flex justify-between"><span className="text-slate-600">Spese condominiali:</span><span className="font-medium text-slate-700">{formatEur(m.condo, 2)}/m {apt.condoEstimated && <em className="text-amber-600">(stimate)</em>}</span></div>
          <div className="flex justify-between"><span className="text-amber-700">Clima a tuo carico:</span><span className="font-semibold">{m.tenantClimateAnnual === 0 ? <span className="text-emerald-700 font-bold">Incluso</span> : <>{formatEur(m.tenantMonthlyClimateCost, 2)}/m <span className="text-slate-400 text-[10px]">({formatEur(m.tenantClimateAnnual)}/a)</span></>}</span></div>
           <div className="flex justify-between"><span className="text-sky-700">Utenze + spese fisse:</span><span className="font-semibold">{m.extraUtilitiesMonthly > 0 ? <>{formatEur(m.extraUtilitiesMonthly, 2)}/m <span className="text-slate-400 text-[10px]">({formatEur(m.utilitiesAnnual)}/a)</span></> : 'Incluse'}</span></div>
           <div className="flex justify-between"><span className="text-orange-700">Cucina ({apt.kitchenType === 'induction' ? 'induzione' : 'gas'}):</span><span className="font-semibold">{formatEur(m.cookingMonthly, 2)}/m</span></div>
          {m.additionalMonthlyCost > 0 && <div className="flex justify-between"><span className="text-indigo-700">Costi aggiuntivi:</span><span className="font-semibold">{formatEur(m.additionalMonthlyCost, 2)}/m</span></div>}
          <div className="pt-2 mt-1 border-t border-brand-200/60 flex justify-between items-baseline">
            <div>
              <span className="block text-[11px] font-bold uppercase tracking-wider text-brand-900">Spesa reale mensile</span>
              <span className="text-[10px] text-slate-500">{m.totalCostPerSqmMonth.toFixed(2).replace('.', ',')} €/m² al mese</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-black text-brand-700">{formatEur(m.totalMonthlyCost, 2)}</span>
              <span className="block text-[11px] font-semibold text-slate-600">{formatEur(m.totalAnnualCost)}/anno</span>
            </div>
          </div>
          <div className="flex justify-between pt-1 border-t border-brand-200/40">
            <span className="text-[11px] text-slate-500 font-semibold">Costo casa /m²/anno (extra esclusi)</span>
            <span className="text-[11px] font-bold text-emerald-800">{m.totalCostPerSqmYear.toFixed(2).replace('.', ',')} €</span>
          </div>
        </div>

        {(m.entryTotal > 0 || m.cautionAmount > 0) && (
           <div className="p-3 bg-violet-50 rounded-xl border border-violet-200 text-xs">
            <div className="flex justify-between items-baseline gap-3">
              <span className="font-bold uppercase tracking-wide text-violet-900">Spese d'ingresso una tantum</span>
               <span className="text-base font-black text-violet-800">{formatEur(m.entryTotal)}</span>
            </div>
            <p className="mt-1 text-[11px] text-violet-800">
               Costi non rimborsabili: volture {formatEur(apt.volture ?? 0)} + agenzia {formatEur(m.agencyFee)} ({formatEur(m.agencyMonthlyEquivalent, 2)}/m sul contratto) + altri costi {formatEur(apt.upfrontCosts)}.
               {' '}La cauzione di {formatEur(m.cautionAmount)} è separata: liquidità immobilizzata e restituita, non un costo.
            </p>
          </div>
        )}

        <details className="text-xs text-slate-600">
          <summary className="cursor-pointer font-semibold hover:text-brand-700">Mostra proiezione pluriennale</summary>
          <p className="mt-1">Totale stimato 5 anni, inclusi i costi d'ingresso: <strong>{formatEur(m.fiveYearTotal)}</strong>.</p>
        </details>

        {m.redFlags.length > 0 && (
          <div className="space-y-1">
            {m.redFlags.map((rf, i) => (
              <div key={i} className={`p-2 rounded-lg border text-[11px] flex gap-1.5 ${flagColor[rf.type]}`}>
                <span>{rf.type === 'danger' ? '🚨' : rf.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                <div>
                  <span className="font-bold">{rf.title}:</span> {rf.desc}
                </div>
              </div>
            ))}
          </div>
        )}

        {apt.notes && <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 italic flex-1">"{apt.notes}"</p>}

        <div className="px-3 py-2 bg-slate-50 -mx-5 -mb-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Riscald. <strong className="text-slate-700">{apt.heatingType.replace('_', ' ')}</strong></span>
          <span>Espo. <strong className="text-slate-700">{apt.orientation.replace('_', ' ')}</strong></span>
        </div>
      </div>
    </div>
  );
}
