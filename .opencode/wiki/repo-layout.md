---
type: Navigation
title: Repository Layout
description: Top-level repository paths and their responsibilities.
tier: core
resource: src/
---

# Repository Layout

[← Index](./index.md)

```text
compare_house/
├── src/                 React application and calculation model
├── index.html           Vite HTML entry
├── package.json         scripts and dependencies
├── vite.config.ts      Vite, React, and Tailwind plugins
├── tsconfig.json        TypeScript checks
├── README.md            project run and architecture notes
├── public/               static assets such as the favicon
├── .github/workflows/    GitHub Pages build and deployment
├── opencode.json        OpenCode Playwright MCP configuration
├── dist/                generated production output
└── .opencode/           agent wiki and project-scoped OpenCode skills
```

## Source layout

| Path | Use |
|---|---|
| `src/App.tsx` | Application state and top-level routing between views |
| `src/components/` | Header, cards, table, chart, forms, settings |
| `src/calc.ts` | Arithmetic model; keep pure and UI-independent |
| `src/data.ts` | Defaults, v1/v2 normalization, localStorage migration |
| `src/settings.ts` | Tariff defaults, merge, persistence |
| `src/types.ts` | Shared data contracts |
| `src/components/ApartmentModal.tsx` | Apartment editing, included costs, listing URL |
| `src/components/AIImportPanel.tsx` | Copyable extraction prompt and JSON apartment import |
| `opencode.json` | Local Playwright MCP server configuration |
| `src/index.css` | Tailwind theme tokens and light/dark contrast overrides |
| `src/components/CostChart.tsx` | Monthly cashflow composition, including additional costs |
| `src/components/Header.tsx` | Responsive header, mobile filter drawer, and bottom view navigation |
| `.github/workflows/deploy-pages.yml` | Builds and deploys `dist/` to GitHub Pages |
| `public/favicon.svg` | Browser favicon |

## Related

- [project-overview.md](./project-overview.md)
- [bug-triage.md](./bug-triage.md)
