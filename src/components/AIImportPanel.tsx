import { useState } from 'react';
import type { Apartment } from '../types';

const input = 'w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none';

export const AI_APARTMENT_PROMPT = `Agisci come un estrattore di dati immobiliari. Analizza la descrizione dell'annuncio che ti fornirò e restituisci SOLO un JSON valido, senza markdown e senza commenti.

Non inventare informazioni. Se un dato non è presente, usa null per i numeri/anno e una stringa vuota per i testi. Usa esclusivamente questi valori enumerati:
- energyClass: "A", "B-C", "D", "E", "F-G"
- floorType: "intermediate", "ground", "top"
- orientation: "south", "east_mixed", "west", "north"
- heatingType: "gas_central", "gas_autonomous", "heat_pump", "electric_joule"
- acType: "split_inverter", "portable", "none"
- contract: "transitorio", "4_4", "libero"

Restituisci esattamente questa struttura. I valori monetari sono mensili se non indicato diversamente:
{
  "title": "",
  "address": "",
  "listingUrl": "",
  "rent": 0,
  "condo": 0,
  "condoEstimated": false,
  "sqm": 0,
  "rooms": 1,
  "year": null,
  "energyClass": "D",
  "ipe": "",
  "floorNumber": "",
  "floorType": "intermediate",
  "orientation": "east_mixed",
  "heatingType": "gas_central",
  "acType": "none",
  "contract": "4_4",
  "cautionMonths": 3,
  "upfrontCosts": 0,
  "volture": 80,
  "cedolare": true,
  "furnishing": "furnished",
  "transit": {
    "label": "",
    "distanceMeters": null
  },
  "mobility": {
    "enabled": false,
    "mode": "metro",
    "monthlyCost": 0,
    "distanceMeters": null,
    "note": ""
  },
  "additionalCosts": [],
  "agencyFee": {
    "mode": "none",
    "value": 0,
    "vatIncluded": true
  },
  "household": {
    "tari": true,
    "rai": true,
    "maintenance": true,
    "smallMaintenance": true
  },
  "included": {
    "heating": false,
    "electricity": false,
    "gas": false,
    "water": true,
    "internet": false,
    "ac": false
  },
  "features": {
    "box": false,
    "terrace": false,
    "bidet": true,
    "shower": true,
    "induction": false,
    "elevator": true,
    "studio": false,
    "furnished": true
  },
  "notes": ""
}

Dopo il JSON, non aggiungere testo. La descrizione dell'annuncio è:`;

export function AIImportPanel({
  onImport,
  onClose,
}: {
  onImport: (json: string) => { ok: true } | { ok: false; error: string };
  onClose: () => void;
}) {
  const [json, setJson] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(AI_APARTMENT_PROMPT);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const importJson = () => {
    const result = onImport(json);
    if (result.ok) {
      setError(null);
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 max-w-5xl mx-auto rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex justify-between items-start gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Aggiungi appartamento con AI</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Copia il prompt in Gemini, ChatGPT, Claude o un altro modello. Poi incolla qui il JSON restituito.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700">✕</button>
        </div>

        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="lg:col-span-2 rounded-xl border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/60 px-3 py-2.5 text-xs text-violet-900 dark:text-violet-100">
            <strong>Modalità assistita temporanea:</strong> per ora copia il prompt, usa il tuo modello AI e incolla il JSON restituito. In futuro aggiungeremo l’integrazione AI diretta con provider e API key configurabili.
          </div>
          <section>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200">Agent prompt</label>
              <button onClick={copyPrompt} className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold">
                {copied ? 'Copiato' : 'Copia prompt'}
              </button>
            </div>
            <textarea readOnly value={AI_APARTMENT_PROMPT} className={`${input} h-[520px] font-mono text-[11px] leading-relaxed bg-slate-50 dark:bg-slate-800`} />
          </section>

          <section>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-200 mb-2">JSON appartamento</label>
            <textarea
              value={json}
              onChange={(e) => { setJson(e.target.value); setError(null); }}
              className={`${input} h-[520px] font-mono text-[11px] leading-relaxed`}
              placeholder={'{\n  "title": "Bilocale...",\n  "rent": 900,\n  ...\n}'}
              spellCheck={false}
            />
            {error && <p className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">{error}</p>}
            <button onClick={importJson} disabled={!json.trim()} className="mt-3 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-sm font-bold">
              Importa e crea appartamento
            </button>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">L'importazione crea sempre un nuovo appartamento e non sovrascrive quelli esistenti.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

export type AIImportResult = Apartment;
