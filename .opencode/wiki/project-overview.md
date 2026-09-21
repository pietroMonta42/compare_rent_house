---
type: Overview
title: Project Overview
description: Runtime model and major code paths for the apartment comparison app.
tier: core
resource: src/App.tsx
---

# Project Overview

[← Index](./index.md)

Rent House Radar is a client-only React 19 + TypeScript + Vite app for comparing rental apartments. It calculates monthly and annual real cost from rent, condominium fees, tenant-paid climate costs, excluded utilities, recurring household costs, contract-entry costs, and configurable energy multipliers. Data and configuration persist in browser `localStorage`; there is no backend.

Apartment records may also retain the original listing URL (`listingUrl`), which is normalized and rendered as an external link in the card and table views. Recurring mobility and user-added costs are included in cashflow but excluded from the housing €/m² denominator.

The AI import flow is provider-agnostic: the user copies the prompt from `AIImportPanel`, asks any external model for the exact apartment JSON, and imports it after validation. OpenCode can additionally use the Playwright MCP configured in `opencode.json` to operate the running local app.

The current deployment target is a static MVP. Apartment data, settings, theme, and initialization state are browser-local; shared users and server-side AI calls are intentionally out of scope until a backend is added.

The responsive shell uses a compact mobile header, a side drawer for secondary filters/actions, and a fixed bottom navigation for cards, table, and chart. Printing uses a dedicated `window.print()` path with print-only visibility rules.

## Runtime flow

```text
src/main.tsx
  -> App.tsx
     -> loadApartments/loadSettings
     -> calculateApartmentMetrics
     -> cards | table | chart views
     -> modal edits -> save to localStorage -> rerender
```

## Core boundaries

| Concern | Path |
|---|---|
| State, views, CRUD, import/export | `src/App.tsx` |
| Pure cost calculations and red flags | `src/calc.ts` |
| Apartment defaults, migration, storage keys | `src/data.ts` |
| Tariff defaults and deep settings merge | `src/settings.ts` |
| Domain types | `src/types.ts` |
| Apartment form and listing URL | `src/components/ApartmentModal.tsx` |
| AI prompt, JSON validation, and import UI | `src/components/AIImportPanel.tsx` |
| OpenCode browser automation | `opencode.json`, `.opencode/skills/apartment-manager/SKILL.md` |
| Theme persistence and dark UI overrides | `src/App.tsx`, `src/index.css` |
| Extra recurring costs, mobility, agency fees | `src/types.ts`, `src/calc.ts`, `src/components/ApartmentModal.tsx` |
| Print/PDF output | `src/App.tsx`, `src/index.css` |
| GitHub Pages static deployment | `.github/workflows/deploy-pages.yml`, `vite.config.ts` |
| Forms and view rendering | `src/components/` |

## Related

- [repo-layout.md](./repo-layout.md)
- [agent-playbook.md](./agent-playbook.md)
