---
okf_version: "0.1"
---

# Rent House Radar - Agent Wiki Index

Compact navigation map for agents working on the React/Vite apartment comparison app.

## Start here

| Need | Read |
|---|---|
| Mental model | [project-overview.md](./project-overview.md) |
| Top-level paths | [repo-layout.md](./repo-layout.md) |
| Safe edit decisions | [agent-playbook.md](./agent-playbook.md) |
| Symptom routing | [bug-triage.md](./bug-triage.md) |

## By layer

No layer pages yet. Add one only after the same area becomes a recurring navigation problem.

## Quick facts

| Item | Value |
|---|---|
| App entry | `src/main.tsx` |
| Main shell | `src/App.tsx` |
| Calculation engine | `src/calc.ts` |
| Data/defaults/migration | `src/data.ts` |
| Settings defaults/persistence | `src/settings.ts` |
| UI components | `src/components/` |
| Local development | `npm run dev` |
| Production check | `npm run build` |
| Persistence | Browser `localStorage` (`milano_rent_*`) |
| Agent skills | `.opencode/skills/` |
| Listing links | Optional `Apartment.listingUrl`, edited in `ApartmentModal` |
| AI import | `src/components/AIImportPanel.tsx` |
| Browser MCP | `opencode.json` (`playwright`) |
| Theme | `src/App.tsx` + `src/index.css`, persisted in `localStorage` |

## All wiki files

| File | Scope |
|---|---|
| [README.md](./README.md) | How agents use and grow the wiki |
| [project-overview.md](./project-overview.md) | App architecture and data flow |
| [repo-layout.md](./repo-layout.md) | Top-level repository paths |
| [agent-playbook.md](./agent-playbook.md) | Where to edit common changes |
| [bug-triage.md](./bug-triage.md) | Symptom-to-file routing |
