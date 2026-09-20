---
name: update-wiki
description: Maintain the project's agent wiki when repository structure, durable navigation patterns, or recurring symptom routing changes. Use explicitly after a structural discovery, not for one-off bug notes.
compatibility: opencode
metadata:
  scope: project
  wiki: .opencode/wiki
---

# Update Wiki

Maintain `.opencode/wiki/` as a small navigation map. Do not duplicate the source code or write ticket history.

## Scope contract

Before editing, state:

```text
Scope: update only <target wiki page> [+ index if a page or tier is new].
Do not read unrelated wiki pages.
```

## Update when

- A top-level folder, startup path, shared library, or persistence boundary changes.
- The same source area or symptom recurs and needs stable routing.
- A wiki path no longer matches the repository.

Skip routine edits within documented paths and one-off investigation notes.

## Placement

| Discovery | Target |
|---|---|
| Top-level path | `.opencode/wiki/repo-layout.md` |
| App architecture/data flow | `.opencode/wiki/project-overview.md` |
| Durable edit rule | `.opencode/wiki/agent-playbook.md` |
| Repeated symptom | `.opencode/wiki/bug-triage.md` |
| New concept | `.opencode/wiki/index.md` |

## Checklist

- Edit only affected pages.
- Keep YAML frontmatter with a required `type` on concept pages.
- Keep `[← Index](./index.md)` and a short Related section.
- Use real paths and links instead of copied implementation prose.
- Keep pages concise; split into a layer/domain page only when a pattern grows.
- Verify the changed path with a focused repository lookup.

## Anti-patterns

- No ticket IDs, branch names, or temporary debugging logs.
- No full-repository documentation pass.
- No new layer/domain page for a single occurrence.
- No wiki update when the only change is local implementation detail.
