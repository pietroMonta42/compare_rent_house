import type { WithMetrics } from './ComparisonTable';
import { formatEur } from '../calc';

const SEGMENTS = [
  { key: 'rent', label: 'Canone', color: 'bg-slate-800' },
  { key: 'condo', label: 'Spese condom.', color: 'bg-slate-400' },
  { key: 'climate', label: 'Clima (riscald.+AC)', color: 'bg-amber-400' },
  { key: 'utilities', label: 'Utenze + spese fisse', color: 'bg-sky-400' },
  { key: 'additional', label: 'Costi aggiuntivi', color: 'bg-indigo-400' },
] as const;

export function CostChart({ list }: { list: WithMetrics[] }) {
  const max = Math.max(...list.map(({ m }) => m.totalMonthlyCost), 1);
  const sum = list.reduce((acc, { m }) => acc + m.totalMonthlyCost, 0);
  const avg = sum / list.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 mb-4">Composizione della spesa reale mensile</h3>
        <div className="flex gap-4 flex-wrap mb-4 text-[11px]">
          {SEGMENTS.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5 text-slate-600">
              <span className={`w-3 h-3 rounded ${s.color}`} /> {s.label}
            </span>
          ))}
          <span className="inline-flex items-center gap-1.5 text-slate-600">
            <span className="w-3 h-3 rounded border-2 border-dashed border-slate-400" /> media: {formatEur(avg)}/mese
          </span>
        </div>

        <div className="space-y-3">
          {list.map(({ apt, m }) => {
            const segs = [
              { value: m.rent, color: 'bg-slate-800', title: `Canone: ${formatEur(m.rent)}` },
              { value: m.condo, color: 'bg-slate-400', title: `Condominio: ${formatEur(m.condo)}` },
              { value: m.tenantMonthlyClimateCost, color: 'bg-amber-400', title: `Clima: ${formatEur(m.tenantMonthlyClimateCost)}` },
              { value: m.extraUtilitiesMonthly, color: 'bg-sky-400', title: `Utenze: ${formatEur(m.extraUtilitiesMonthly, 2)}` },
              { value: m.additionalMonthlyCost, color: 'bg-indigo-400', title: `Extra: ${formatEur(m.additionalMonthlyCost, 2)}` },
            ];
            const total = segs.reduce((s, x) => s + x.value, 0) || 1;
            return (
              <div key={apt.id} className="grid grid-cols-[minmax(140px,220px)_1fr_90px] items-center gap-3 text-xs">
                <div className="truncate font-semibold text-slate-700" title={apt.address}>{apt.title}</div>
                <div className="h-6 bg-slate-100 rounded-lg overflow-hidden flex">
                  {segs.map((s, i) =>
                    s.value > 0 ? (
                      <div
                        key={i}
                        className={`${s.color} h-full transition-all`}
                        style={{ width: `${(s.value / max) * 100}%` }}
                        title={`${s.title} /m`}
                      />
                    ) : null,
                  )}
                </div>
                <div className="text-right font-bold text-slate-900">{formatEur(total || m.totalMonthlyCost, 2)}<span className="text-[10px] font-normal text-slate-400">/m</span></div>
              </div>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-400 mt-3">
          Le barre sono normalizzate sulla spesa mensile massima ({formatEur(max)}/mese). Passa il mouse sulle sezioni per il dettaglio.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 mb-3">Costo casa al m² all'anno (costi aggiuntivi esclusi)</h3>
        <div className="space-y-2.5">
          {list.map(({ apt, m }) => (
            <div key={apt.id} className="grid grid-cols-[minmax(140px,220px)_1fr_110px] items-center gap-3 text-xs">
              <div className="truncate font-semibold text-slate-700">{apt.title}</div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(m.totalCostPerSqmYear / Math.max(...list.map((x) => x.m.totalCostPerSqmYear))) * 100}%` }} />
              </div>
              <div className="text-right font-bold text-emerald-800">{m.totalCostPerSqmYear.toFixed(2).replace('.', ',')} €/m²/a</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
