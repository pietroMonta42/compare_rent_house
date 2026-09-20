---
type: Playbook
title: Agent Playbook
description: Decision tree for locating safe edit points in this repository.
tier: core
---

# Agent Playbook

[← Index](./index.md)

## Where should I edit?

| Change | Start here |
|---|---|
| Cost formula, tariff factor, red flag | `src/calc.ts` |
| Apartment field or persisted shape | `src/types.ts`, then `src/data.ts` normalization |
| New default apartment | `src/data.ts` `DEFAULT_APARTMENTS` |
| New global configuration | `src/types.ts`, `src/settings.ts`, `SettingsPanel.tsx` |
| Add/edit apartment input | `ApartmentModal.tsx` |
| Cards/table/chart output | Matching component in `src/components/` |
| View sorting/archive behavior | `src/App.tsx` and `Header.tsx` |
| Import/export or storage behavior | `src/App.tsx` and `src/data.ts` |

## Rules before editing

- Preserve the pure calculation boundary: no DOM or React state in `calc.ts`.
- When adding persisted fields, update `normalizeApartment` for old local data.
- When adding settings, update defaults, deep merge, panel inputs, and export/import.
- Keep cards, table, and chart derived from the same `sorted` list in `App.tsx`.
- Run `npx tsc -p tsconfig.json` and `npm run build` after changes.

## Related

- [project-overview.md](./project-overview.md)
- [bug-triage.md](./bug-triage.md)
