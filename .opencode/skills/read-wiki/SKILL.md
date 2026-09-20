---
name: read-wiki
description: Navigate this repository's agent wiki before broad code search. Use when starting work without a concrete file, locating architecture or data flow, or routing a recurring symptom to the right source path.
compatibility: opencode
metadata:
  scope: project
  wiki: .opencode/wiki
---

# Read Wiki

Use the project wiki as a compact navigation map, not as a replacement for source code.

## Scope contract

Before reading, state:

```text
Scope: read only <wiki page or skip>. Do not scan unrelated wiki pages or repo files.
Output: area, layer, concrete start path, and one next search target.
```

## Rules

- If the user gives a concrete file path, skip the wiki and open that file.
- Otherwise read `.opencode/wiki/index.md`, then at most one relevant concept page.
- For a symptom, use `.opencode/wiki/bug-triage.md` and follow one routing row.
- Never read every wiki page linearly.
- After orientation, search only the mapped source path.
- Trust current code if the wiki and code disagree; mention the mismatch and use `update-wiki` when it is structural.

## Routing

| Need | Read | Start code search |
|---|---|---|
| Architecture/data flow | `.opencode/wiki/project-overview.md` | `src/App.tsx` |
| File placement | `.opencode/wiki/repo-layout.md` | `src/` |
| Safe edit location | `.opencode/wiki/agent-playbook.md` | path from its table |
| Calculation bug | `.opencode/wiki/bug-triage.md` | `src/calc.ts` |
| Storage/migration bug | `.opencode/wiki/bug-triage.md` | `src/data.ts` |
| View/filter mismatch | `.opencode/wiki/bug-triage.md` | `src/App.tsx` and one view component |

## Output limit

Keep the orientation response under 50 lines. Include only product/area, layer, start path, and next targeted search.
