import { useEffect, useMemo, useState } from 'react';
import type { Apartment, TariffSettings } from './types';
import { calculateApartmentMetrics, formatEur } from './calc';
import { loadApartments, saveApartments, DEFAULT_APARTMENTS, normalizeApartment } from './data';
import { loadSettings, saveSettings, DEFAULT_SETTINGS, mergeSettings } from './settings';
import { ApartmentCard } from './components/ApartmentCard';
import { ComparisonTable } from './components/ComparisonTable';
import { CostChart } from './components/CostChart';
import { ApartmentModal } from './components/ApartmentModal';
import { SettingsPanel } from './components/SettingsPanel';
import { Header } from './components/Header';
import { AIImportPanel } from './components/AIImportPanel';

type View = 'cards' | 'table' | 'chart';
type Theme = 'light' | 'dark';
const THEME_KEY = 'milano_rent_theme_v1';

const SORTS = [
  { value: 'total_year_asc', label: 'Spesa totale annua (min → max)' },
  { value: 'sqm_cost_asc', label: 'Costo totale /m²/anno (min → max)' },
  { value: 'rent_asc', label: 'Canone mensile (min → max)' },
  { value: 'energy_asc', label: 'Spesa clima annua (min → max)' },
  { value: 'surface_desc', label: 'Superficie (max → min)' },
] as const;

export default function App() {
  const [apartments, setApartments] = useState<Apartment[]>(loadApartments);
  const [settings, setSettings] = useState<TariffSettings>(loadSettings);
  const [view, setView] = useState<View>('cards');
  const [sort, setSort] = useState<(typeof SORTS)[number]['value']>('total_year_asc');
  const [showArchived, setShowArchived] = useState(false);
  const [editing, setEditing] = useState<Apartment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aiImportOpen, setAiImportOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light');
  const [energyOpen, setEnergyOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  const updateApartments = (next: Apartment[]) => {
    setApartments(next);
    saveApartments(next);
  };

  const updateSettings = (next: TariffSettings) => {
    setSettings(next);
    saveSettings(next);
  };

  const visible = useMemo(() => apartments.filter((a) => showArchived || !a.archived), [apartments, showArchived]);

  const withMetrics = useMemo(
    () => visible.map((a) => ({ apt: a, m: calculateApartmentMetrics(a, settings) })),
    [visible, settings],
  );

  const sorted = useMemo(() => {
    const list = [...withMetrics];
    list.sort((x, y) => {
      switch (sort) {
        case 'total_year_asc': return x.m.totalAnnualCost - y.m.totalAnnualCost;
        case 'sqm_cost_asc': return x.m.totalCostPerSqmYear - y.m.totalCostPerSqmYear;
        case 'rent_asc': return x.apt.rent - y.apt.rent;
         case 'energy_asc': return x.m.tenantClimateAnnual - y.m.tenantClimateAnnual;
        case 'surface_desc': return y.apt.sqm - x.apt.sqm;
      }
    });
    return list;
  }, [withMetrics, sort]);

  const openNew = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (apt: Apartment) => {
    setEditing(apt);
    setModalOpen(true);
  };

  const handleSave = (apt: Apartment) => {
    const exists = apartments.some((a) => a.id === apt.id);
    updateApartments(exists ? apartments.map((a) => (a.id === apt.id ? apt : a)) : [...apartments, apt]);
    setModalOpen(false);
    showToast(exists ? 'Appartamento aggiornato' : 'Appartamento aggiunto');
  };

  const handleDelete = (id: string) => {
    const target = apartments.find((a) => a.id === id);
    if (!target) return;
    updateApartments(apartments.filter((a) => a.id !== id));
    showToast(`Rimosso: ${target.title}`);
  };

  const handleDuplicate = (id: string) => {
    const apt = apartments.find((a) => a.id === id);
    if (!apt) return;
    const copy: Apartment = { ...structuredClone(apt), id: `app-${Date.now()}`, title: `${apt.title} (copia)` };
    updateApartments([...apartments, copy]);
    showToast('Appartamento duplicato');
  };

  const handleArchive = (id: string) => {
    updateApartments(apartments.map((a) => (a.id === id ? { ...a, archived: !a.archived } : a)));
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ apartments, settings }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `confronto_affitti_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dati esportati (JSON)');
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result));
        if (Array.isArray(parsed.apartments)) {
          updateApartments(parsed.apartments.map(normalizeApartment));
          if (parsed.settings) updateSettings(mergeSettings(parsed.settings));
          showToast('Dati importati');
        } else if (Array.isArray(parsed)) {
          updateApartments(parsed.map(normalizeApartment));
          showToast('Appartamenti importati (formato v1)');
        } else {
          showToast('Formato JSON non valido');
        }
      } catch {
        showToast('Errore durante la lettura del file');
      }
    };
    reader.readAsText(file);
  };

  const handleAIImport = (json: string): { ok: true } | { ok: false; error: string } => {
    try {
      const parsed: unknown = JSON.parse(json);
      const raw = Array.isArray(parsed) ? parsed[0] : parsed;
      if (!raw || typeof raw !== 'object') return { ok: false, error: 'Il JSON deve contenere un oggetto appartamento.' };
      const candidate = raw as Record<string, unknown>;
      if (typeof candidate.title !== 'string' || !candidate.title.trim()) return { ok: false, error: 'Manca il campo obbligatorio "title".' };
      if (typeof candidate.address !== 'string' || !candidate.address.trim()) return { ok: false, error: 'Manca il campo obbligatorio "address".' };
      if (typeof candidate.rent !== 'number' || candidate.rent <= 0) return { ok: false, error: 'Il campo "rent" deve essere un numero maggiore di zero.' };
      if (typeof candidate.sqm !== 'number' || candidate.sqm <= 0) return { ok: false, error: 'Il campo "sqm" deve essere un numero maggiore di zero.' };

      const imported = normalizeApartment({
        ...(candidate as Partial<Apartment>),
        id: `app-${Date.now()}`,
      } as Apartment);
      updateApartments([...apartments, imported]);
      showToast(`Aggiunto con AI: ${imported.title}`);
      return { ok: true };
    } catch {
      return { ok: false, error: 'JSON non valido. Incolla solo l\'oggetto JSON restituito dal modello.' };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col">
      <Header
        view={view}
        onViewChange={setView}
        sort={sort}
        onSortChange={(val) => setSort(val as typeof sort)}
        sorts={SORTS}
        showArchived={showArchived}
        onToggleArchived={() => setShowArchived((v) => !v)}
        onAdd={openNew}
        onAddWithAI={() => setAiImportOpen(true)}
        onSettings={() => setSettingsOpen(true)}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
        onPrint={() => window.print()}
        onExport={handleExport}
        onImport={handleImport}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 pb-24 md:pb-6 flex-1 w-full space-y-5 md:space-y-6">
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 sm:p-5 shadow-sm print:hidden">
          <button type="button" onClick={() => setEnergyOpen((open) => !open)} className="w-full flex items-center justify-between gap-3 text-left">
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                ⚙ Dettagli modello energetico — {settings.cityLabel}, zona climatica {settings.climateZone}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Stima clima, utenze e spese fisse configurabili</p>
            </div>
            <span className="text-xs font-bold text-brand-700 dark:text-sky-300">{energyOpen ? 'Riduci ▲' : 'Espandi ▼'}</span>
          </button>
          {energyOpen && <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
             Gas {settings.gasEuroPerSmc.toFixed(2).replace('.', ',')} €/Smc &bull; Elettricità{' '}
             {settings.electricityEuroPerKwh.toFixed(2).replace('.', ',')} €/kWh &bull; Quote fisse centralizzato{' '}
             {formatEur(settings.fixedCentralFee)}/anno &bull; APE base A {formatEur(settings.baseClassCost.A)}/m² → G{' '}
             {formatEur(settings.baseClassCost['F-G'])}/m² &bull; Utenze escluse: luce {formatEur(settings.defaultElectricityYear)}/a, acqua{' '}
             {formatEur(settings.defaultWaterYear)}/a, internet {formatEur(settings.defaultInternetYear)}/a, TARI {formatEur(settings.tariYear)}/a, RAI {formatEur(settings.raiYear)}/a, manutenzione {formatEur(settings.maintenanceYear)}/a &bull; Cucina {settings.occupants} persona/e, contatore {settings.electricPower} kW
          </p>
          <p className="text-[11px] text-slate-400 mt-1 font-mono">
             Totale = canone + spese condominiali + utenze/spese fisse non incluse + costi aggiuntivi + clima a carico / 12. I costi aggiuntivi sono esclusi dal denominatore €/m².
          </p>
          <button type="button" onClick={() => setSettingsOpen(true)} className="mt-3 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold">Apri impostazioni modello</button>
          </div>}
        </section>

        {sorted.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500 text-sm">Nessun appartamento. Aggiungine uno o ripristina gli esempi.</p>
            <button
              className="mt-3 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg"
              onClick={() => updateApartments(DEFAULT_APARTMENTS.map(normalizeApartment))}
            >
              Ripristina appartamenti iniziali
            </button>
          </div>
        ) : view === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sorted.map(({ apt, m }) => (
              <ApartmentCard
                key={apt.id}
                apt={apt}
                m={m}
                onEdit={() => openEdit(apt)}
                onDuplicate={() => handleDuplicate(apt.id)}
                onDelete={() => handleDelete(apt.id)}
                onArchive={() => handleArchive(apt.id)}
              />
            ))}
          </div>
        ) : view === 'table' ? (
          <ComparisonTable list={sorted} onEdit={openEdit} onDelete={handleDelete} />
        ) : (
          <CostChart list={sorted} />
        )}
      </main>

      {modalOpen && (
        <ApartmentModal initial={editing} onSave={handleSave} onClose={() => setModalOpen(false)} />
      )}

      {aiImportOpen && (
        <AIImportPanel onImport={handleAIImport} onClose={() => setAiImportOpen(false)} />
      )}

      {settingsOpen && (
        <SettingsPanel
          settings={settings}
          onSave={updateSettings}
          onClose={() => setSettingsOpen(false)}
          onReset={() => {
            updateSettings(DEFAULT_SETTINGS);
            showToast('Modello energetico ripristinato ai valori default');
          }}
          onDeleteAllApartments={() => {
            updateApartments([]);
            showToast('Database appartamenti svuotato');
          }}
          onRestoreDefaultApartments={() => {
            updateApartments(DEFAULT_APARTMENTS.map(normalizeApartment));
            showToast('Ripristinati gli 11 appartamenti iniziali');
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl text-xs">
          {toast}
        </div>
      )}
    </div>
  );
}
