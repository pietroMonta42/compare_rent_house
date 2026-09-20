import { useRef, useState } from 'react';

const btn = 'px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5';

export function Header({
  view,
  onViewChange,
  sort,
  onSortChange,
  sorts,
  showArchived,
  onToggleArchived,
  onAdd,
  onAddWithAI,
  onSettings,
  theme,
  onToggleTheme,
  onPrint,
  onExport,
  onImport,
}: {
  view: string;
  onViewChange: (v: 'cards' | 'table' | 'chart') => void;
  sort: string;
  onSortChange: (s: string) => void;
  sorts: readonly { value: string; label: string }[];
  showArchived: boolean;
  onToggleArchived: () => void;
  onAdd: () => void;
  onAddWithAI: () => void;
  onSettings: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onPrint: () => void;
  onExport: () => void;
  onImport: (f: File) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const viewItems = [['cards', 'Schede'], ['table', 'Tabella'], ['chart', 'Grafico']] as const;

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 md:py-3 space-y-3">
        <div className="flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center min-w-0 gap-2.5 md:gap-3">
            <div className="h-9 w-9 md:h-10 md:w-10 shrink-0 bg-brand-600 text-white rounded-xl flex items-center justify-center font-bold shadow-md">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-tight truncate">Milano Rent &amp; Energy Radar</h1>
              <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 font-medium">Confronto costi reali totali &bull; modello energetico configurabile</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 md:gap-2 print:hidden">
            <button className={`${btn} text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700`} onClick={onToggleTheme} title="Cambia tema" aria-label="Cambia tema">
              {theme === 'dark' ? '☀' : '◐'} <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
            <button className={`${btn} text-violet-700 dark:text-violet-200 bg-violet-50 dark:bg-violet-950 hover:bg-violet-100 dark:hover:bg-violet-900 shrink-0`} onClick={onAddWithAI}>
              ✦ <span className="hidden sm:inline">Aggiungi con AI</span><span className="sm:hidden">AI</span>
            </button>
            <button className={`${btn} text-white bg-brand-600 hover:bg-brand-700 shadow-sm shrink-0`} onClick={onAdd}>
              + <span className="hidden sm:inline">Aggiungi appartamento</span><span className="sm:hidden">Casa</span>
            </button>
            <details className="relative">
              <summary className={`${btn} list-none cursor-pointer text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700`}>
                <span className="sm:hidden">⋯</span><span className="hidden sm:inline">Altro ▾</span>
              </summary>
              <div className="absolute right-0 top-full mt-2 z-40 w-48 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl">
                <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ''; }} />
                <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => fileRef.current?.click()}>Importa dati</button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onExport}>Esporta dati</button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onSettings}>⚙ Impostazioni</button>
                <button className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={onPrint}>Stampa / PDF</button>
              </div>
            </details>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden md:inline-flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            {viewItems.map(([v, label]) => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={`px-3 py-1.5 font-semibold rounded-lg ${view === v ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
            <span className="text-slate-500 dark:text-slate-400">Ordina per:</span>
            <select value={sort} onChange={(e) => onSortChange(e.target.value)} className="bg-transparent font-semibold text-slate-700 dark:text-slate-200 outline-none cursor-pointer">
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <button onClick={onToggleArchived} className={`hidden md:flex ${btn} ${showArchived ? 'text-brand-700 dark:text-brand-100 bg-brand-50 dark:bg-brand-900' : 'text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
            {showArchived ? 'Mostra solo attive' : 'Mostra archiviate'}
          </button>
        </div>

        <div className="md:hidden flex items-center gap-2 print:hidden">
          <button onClick={() => setMobileFiltersOpen(true)} className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold text-left">
            ☷ Filtri e ordinamento
          </button>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{showArchived ? 'Archiviate' : 'Attive'}</span>
        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-700 print:hidden" aria-label="Viste">
        <div className="grid grid-cols-3 gap-1.5 max-w-md mx-auto">
          {viewItems.map(([v, label]) => (
            <button key={v} onClick={() => onViewChange(v)} className={`py-2.5 rounded-xl text-xs font-bold ${view === v ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`} aria-current={view === v ? 'page' : undefined}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      {mobileFiltersOpen && <div className="md:hidden fixed inset-0 z-50 bg-slate-950/50" onClick={() => setMobileFiltersOpen(false)}>
        <aside className="ml-auto h-full w-[min(88vw,360px)] bg-white dark:bg-slate-900 shadow-2xl p-5" onClick={(event) => event.stopPropagation()}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Filtri e ordinamento</h2>
            <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-slate-500">✕</button>
          </div>
          <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-2">Ordina per</label>
          <select value={sort} onChange={(event) => onSortChange(event.target.value)} className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 px-3 py-3 text-sm">
            {sorts.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
          <button onClick={onToggleArchived} className="mt-4 w-full rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-3 text-sm font-bold text-left">
            {showArchived ? 'Mostra solo appartamenti attivi' : 'Mostra appartamenti archiviati'}
          </button>
          <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">Le schede, la tabella e il grafico restano sempre disponibili nella barra in basso.</p>
        </aside>
      </div>}
    </header>
  );
}
