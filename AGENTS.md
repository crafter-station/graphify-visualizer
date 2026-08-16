# Graphify Visualizer — agent guide

Obsidian plugin that **visualizes** Graphify CLI output. Not a second analysis engine.

## Read first

| Doc | For |
|---|---|
| [`README.md`](README.md) | Product intent + non-goals |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Bridge data flow |
| [`docs/DECISIONS.md`](docs/DECISIONS.md) | Closed stack choices — do not reopen without human OK |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Phase order |

Vault context (outside this nested repo):

- Skill: `.agents/skills/graphify-lupa/SKILL.md`
- Spike: `02_Programs/0-Projects/Agentic OS Setup/spikes/graphify-mak-439.md`
- Linear: MAK-439

## Non-negotiables

1. **Bridge only.** Reuse Graphify CLI (`extract --code-only`). Do not invent a parallel tree-sitter motor in MVP.
2. **JSON stays in cache.** Default path under `~/.cache/graphify-lupa/`. Never commit `graphify-out/` into the Claudesidian vault.
3. **Refresh = subprocess.** No local HTTP API in MVP. Desktop Obsidian only.
4. **vis-network first.** Do not add Cytoscape until ROADMAP Fase 4 trigger is met.
5. **Code lives in `plugin/`.** Docs stay at repo root / `docs/`.
6. **Smallest diff.** Ponytail: no speculative abstractions, no Community Plugin publish pipeline until asked.

## Layout

```text
plugin/     ← TypeScript Obsidian plugin (manifest, main, styles, package.json)
docs/       ← human + agent architecture
```

## Tracking

- Planning authority: Linear (link issue when one exists for this plugin; MAK-439 covers Graphify CLI surface).
- This nested git repo is independent of the vault root repo.
- Do not push remotes or create GitHub repos unless the human asks.

## Done-when (current stage)

- [x] Nested folder under `02_Programs/3-Software/graphify-visualizer/`
- [x] README + ARCHITECTURE + DECISIONS + ROADMAP + AGENTS
- [x] Nested `git init` + GitHub remote
- [x] Fase 0: Agentfiles-shaped `plugin/` builds; vault symlink + community-plugins enable
- [ ] Fase 1: read-only vis-network viewer
