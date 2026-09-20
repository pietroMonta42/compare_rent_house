# Rent House Radar

Confronto dinamico tra affitti a Milano con stima automatica del costo energetico reale (riscaldamento + climatizzazione estiva) e delle utenze non incluse.

Stack: **React 19 + TypeScript + Vite + Tailwind CSS v4**. Nessun backend: tutto in browser (localStorage).

## Avvio

```bash
npm install
npm run dev      # sviluppo su http://localhost:5173
npm run build    # build di produzione in dist/
```

## Struttura

```
src/
├── types.ts               # Modello dati: Apartment, TariffSettings
├── settings.ts            # Impostazioni default del modello energetico + persistenza
├── data.ts                # 11 appartamenti iniziali + persistenza
├── calc.ts                # ⚙️ Motore di calcolo puro: clima, utenze, extra, agenzia, red flags
├── App.tsx                # Shell: ordinamento, viste, CRUD, import/export
└── components/
    ├── Header.tsx           # Toolbar, view switcher, ordinamento
    ├── ApartmentCard.tsx    # Scheda con breakdown detallado + red flags
    ├── ComparisonTable.tsx  # Tabella comparativa
    ├── CostChart.tsx        # Grafico a barre impilate mensili + costo/m²/anno
    ├── ApartmentModal.tsx   # Form: utenze, extra mensili/annuali, mobilità, agenzia, ingresso
    ├── AIImportPanel.tsx    # Prompt copiabile + import JSON da modello esterno
    └── SettingsPanel.tsx    # Pannello impostazioni del modello
```

## Motore di calcolo

Lo stima del clima annuo segue la guida fornita (Zona Climatica E):

```
spesa clima = (m² × base APE €/m² × M_piano × M_esposizione × M_imp) + quota involontaria + AC
  spesa reale = canone + spese condom. + utenze + clima a carico + extra ricorrenti
  costo casa €/m² = (spesa reale - extra ricorrenti) / m²
```

Tutti i coefficienti (base APE per classe, moltiplicatori piano/esposizione/impianto, quota involontaria, costi AC, tariffe, utenze flat) sono **modificabili da UI** nel pannello ⚙ Impostazioni e vengono salvati/exportati.

## Nuovo appartamento

1. Bottone "+ Aggiungi appartamento": inserisci annuncio, controlla le spunte "utenza inclusa" se la formula è all-inclusive (i costi coperti → 0 €, gli altri stimati flat dal modello).
2. I red flag si attivano da soli (riscaldamento a joule, classe bassa, transitorio, spese stimate...).
3. Se un appartamento è fuori corsa, usa ⬇ per archiviarlo (resta nei dati ma esce dal confronto).

## MVP statico

Il progetto è pronto per un primo deploy statico su Vercel, Netlify, Cloudflare Pages, GitHub Pages o Nginx:

```bash
npm ci
npm run build
npm run preview -- --host 0.0.0.0
```

La cartella da pubblicare è `dist/`. Non serve un backend per il test: appartamenti, impostazioni e tema vengono salvati nel browser tramite `localStorage`. Di conseguenza i dati non sono ancora condivisi tra utenti o dispositivi. Il pannello AI attuale è volutamente manuale: prompt copiabile + JSON incollato, senza API key nel browser.

Il pulsante `Stampa/PDF` usa `window.print()` e produce una versione stampabile senza header e azioni.

Per un MVP multiutente serviranno in seguito autenticazione, database server e un proxy backend per le chiamate AI.

## GitHub Pages

Il repository include `.github/workflows/deploy-pages.yml`. Dopo il push, abilita il deploy da GitHub Pages:

1. Apri `Settings` → `Pages` nel repository GitHub.
2. In `Build and deployment`, seleziona `Source: GitHub Actions`.
3. Attendi il completamento del workflow `Deploy to GitHub Pages` nella tab `Actions`.

L'app sarà pubblicata a:

```text
https://pietroMonta42.github.io/compare_rent_house/
```
