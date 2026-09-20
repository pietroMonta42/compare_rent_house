---
type: Triage
title: Bug Triage
description: Short symptom-to-source routing table for recurring failures.
tier: core
---

# Bug Triage

[← Index](./index.md)

| Symptom | First path | Check |
|---|---|---|
| Total monthly/annual value is wrong | `src/calc.ts` | Tenant climate inclusion, utilities, rounding, entry-cost separation |
| Old apartments lose fields or crash | `src/data.ts` | `normalizeApartment`, legacy storage/import shape |
| Settings do not affect values | `src/settings.ts`, `src/calc.ts` | Deep merge and tariff factors |
| Cards/table/chart disagree | `src/App.tsx`, view components | All views consume the same `sorted` metrics list |
| Data returns after deletion | `src/data.ts` | Initialization flag and empty-array persistence |

## Routing rule

Start with the pure model or persistence boundary before changing presentation. Confirm the actual stored shape in browser storage before adding compatibility code.

## Related

- [agent-playbook.md](./agent-playbook.md)
- [project-overview.md](./project-overview.md)
