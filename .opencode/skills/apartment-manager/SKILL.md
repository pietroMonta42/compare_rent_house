---
name: apartment-manager
description: Use the Playwright MCP browser to inspect and manage apartments in the local Rent Radar app. Use when the user asks to create, import, update, archive, or verify apartments through the running site.
compatibility: opencode
metadata:
  scope: project
  app: rent-house-radar
  storage: localStorage
---

# Apartment Manager

Use this skill only with explicit user intent to modify or inspect the running local app.

## Preconditions

- The user has started the app with `npm run dev`.
- The local page is open in the Playwright-controlled browser.
- Ask for confirmation before deleting, archiving, or overwriting an apartment.

## Application contract

| Item | Value |
|---|---|
| Development URL | `http://localhost:5173` |
| Apartment storage key | `milano_rent_apartments_v2` |
| Settings storage key | `milano_rent_settings_v2` |
| Initialization key | `milano_rent_initialized_v2` |
| AI import UI | `Aggiungi con AI` button |

## Preferred workflow

1. Inspect the visible app state before changing data.
2. For a description, produce the exact JSON schema requested by the app or use the `Aggiungi con AI` page.
3. Prefer the app's visible import UI over directly mutating `localStorage`.
4. After import, verify the new title appears and the displayed totals render.
5. Only use `localStorage` evaluation for read-only inspection or when the UI cannot perform the requested operation.

## Safety

- Never invent unknown apartment facts; use `null`, `""`, `false`, or the app default.
- Do not export or expose API keys.
- Never delete all entries without an explicit confirmation.
- Do not overwrite an existing ID when the request is to create a new apartment.
