# Agent Wiki Setup

This project uses the portable Agent Wiki pattern under `.opencode/wiki/`.
The wiki is a small, git-tracked navigation map for agents, not a duplicate of
the source code. Read the root index first, then one scoped concept page. Use
`update-wiki` only when a navigation pattern or repository structure changes.

## Bootstrap rules

- Keep the wiki minimal and practical.
- Every non-reserved Markdown page has YAML frontmatter with a `type` field.
- `index.md` files are listings, not concept pages.
- Use real paths from the repository.
- Do not document every component or one-off bug.
- Add layer/domain pages only after a recurring navigation pattern appears.

## Skills

- `.opencode/skills/read-wiki/SKILL.md`: navigate the wiki before scoped code search.
- `.opencode/skills/update-wiki/SKILL.md`: maintain only pages affected by durable structural discoveries.
