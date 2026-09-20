import type { Apartment } from '../types';
import type { ApartmentMetrics } from '../calc';
import { contractLabel, formatEur } from '../calc';
import { energyBadgeClass } from './ApartmentCard';
import { normalizeListingUrl } from '../data';

export interface WithMetrics {
  apt: Apartment;
  m: ApartmentMetrics;
}

export function ComparisonTable({
  list,
  onEdit,
  onDelete,
}: {
  list: WithMetrics[];
  onEdit: (apt: Apartment) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="p-3.5 sticky left-0 bg-slate-50 z-10">Immobile</th>
              <th className="p-3.5">m² / Piano</th>
              <th className="p-3.5">APE &amp; Impianto</th>
              <th className="p-3.5">Canone</th>
              <th className="p-3.5">Spese cond.</th>
              <th className="p-3.5 bg-amber-50/60 text-amber-900">Clima/anno</th>
              <th className="p-3.5 bg-sky-50 text-sky-900">Utenze + spese fisse</th>
              <th className="p-3.5 bg-indigo-50 text-indigo-900">Costi aggiuntivi</th>
              <th className="p-3.5 bg-brand-50/60 text-brand-900 font-bold">Tot. mese reale</th>
              <th className="p-3.5 bg-brand-50/60 text-brand-900 font-bold">Tot. anno reale</th>
              <th className="p-3.5 bg-emerald-50 text-emerald-900 font-bold">Casa /m²/anno<br />(extra esclusi)</th>
              <th className="p-3.5">Ingresso una tantum</th>
              <th className="p-3.5 text-center print:hidden">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {list.map(({ apt, m }) => (
              <tr key={apt.id} className="hover:bg-slate-50/60">
                <td className="p-3.5 sticky left-0 bg-white z-10">
                  <div className="font-bold text-slate-900">
                    {normalizeListingUrl(apt.listingUrl) ? <a href={normalizeListingUrl(apt.listingUrl)} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 hover:underline">{apt.title} ↗</a> : apt.title}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {normalizeListingUrl(apt.listingUrl) ? <a href={normalizeListingUrl(apt.listingUrl)} target="_blank" rel="noopener noreferrer" className="hover:text-brand-700 hover:underline">{apt.address}</a> : apt.address}
                  </div>
                  <div className="text-[11px] text-slate-400">{contractLabel(apt.contract)}</div>
                </td>
                <td className="p-3.5">
                  <div className="font-semibold text-slate-800">{apt.sqm} m²</div>
                  <div className="text-[11px] text-slate-500">{apt.floorNumber}</div>
                </td>
                <td className="p-3.5">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${energyBadgeClass(apt.energyClass)}`}>{apt.energyClass}</span>
                  <div className="text-[11px] text-slate-500 mt-1 capitalize">{apt.heatingType.replace('_', ' ')}</div>
                </td>
                <td className="p-3.5 font-bold text-slate-900">{formatEur(m.rent, 2)}/m</td>
                <td className="p-3.5 text-slate-700">
                  {formatEur(m.condo, 2)}/m
                  {m.tenantClimateAnnual === 0 && <span className="block text-[10px] text-emerald-700">clima incluso</span>}
                </td>
                <td className="p-3.5 bg-amber-50/40 text-amber-900">
                  {m.tenantClimateAnnual === 0 ? '—' : `${formatEur(m.tenantClimateAnnual)}/a`}
                </td>
                <td className="p-3.5 bg-sky-50/40 text-sky-900">{m.extraUtilitiesMonthly > 0 ? `${formatEur(m.extraUtilitiesMonthly, 2)}/m` : 'Incluse'}</td>
                <td className="p-3.5 bg-indigo-50/40 text-indigo-900">{m.additionalMonthlyCost > 0 ? `${formatEur(m.additionalMonthlyCost, 2)}/m` : '—'}</td>
                <td className="p-3.5 bg-brand-50/40 text-brand-800 font-black text-sm">{formatEur(m.totalMonthlyCost, 2)}</td>
                <td className="p-3.5 bg-brand-50/40 text-brand-900 font-bold">{formatEur(m.totalAnnualCost)}</td>
                <td className="p-3.5 bg-emerald-50 text-emerald-900 font-bold">{m.totalCostPerSqmYear.toFixed(2).replace('.', ',')} €</td>
                <td className="p-3.5 text-slate-600">
                  {formatEur(m.entryTotal)}
                  <span className="block text-[10px] text-slate-400">{apt.cautionMonths} mesi cauz. + agenzia {formatEur(m.agencyFee)} + extra</span>
                </td>
                <td className="p-3.5 text-center print:hidden">
                  <button onClick={() => onEdit(apt)} className="p-1.5 text-slate-400 hover:text-brand-600 rounded" title="Modifica">✎</button>
                  <button onClick={() => onDelete(apt.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded" title="Elimina">🗑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
