# Roadmap — Graphify Visualizer

Build order is strict: **see first, refresh second**.

| Phase | Name | Deliverable | Done when |
|---|---|---|---|
| **Scaffold** | Docs + repo | This folder, nested git, architecture docs | ✅ 2026-08-16 |
| **0** | Plugin boilerplate | `plugin/` with `manifest.json`, `main.ts`, empty `ItemView`, `styles.css`, `package.json`, `tsconfig` | ✅ 2026-08-16 — Agentfiles-shaped build; symlink + enabled in vault |
| **1** | Read-only viewer | Load configured `graph.json` into vis-network | Nodes render; click opens file via `openLinkText` |
| **2** | Refresh bridge | Button/command runs Graphify CLI / `run-code-only.sh` | JSON updates and view reloads without leaving Obsidian |
| **3** | UX hardening | Settings UI, loading state, clear errors | Missing CLI / bad path show human messages |
| **4** | Optional | Cytoscape, vault snapshot copy, filters, Community publish | Only if Fase 1–3 hurt or human asks |

## Phase notes

### Scaffold (done)

- PARA+ path chosen
- Decisions locked in `DECISIONS.md`
- No plugin TypeScript yet

### Fase 0 — done

Agentfiles-shaped package under `plugin/`:

- `esbuild` → `main.js`; `manifest.json` (`isDesktopOnly: true`); `styles.css`
- Ribbon + command **Open Graphify Visualizer**
- Empty ItemView (“Fase 0 — empty view”)
- Local symlink: vault `.obsidian/plugins/graphify-visualizer` → `plugin/`
- Enabled in vault `community-plugins.json`

No CLI / vis-network wiring yet.

### Fase 1

- Inspect one real `graph.json` from `~/.cache/graphify-lupa/`
- Map node/edge fields → vis-network
- Resolve file paths relative to analyzed repo root (setting)

### Fase 2

- Settings: CLI binary or script path, target repo slug/root, timeout
- Async exec; never freeze Obsidian UI thread
- Reuse vault helper when possible:  
  `bash <vault>/.agents/skills/graphify-lupa/run-code-only.sh <repo> [slug]`

### Fase 3

- Disable Refresh on non-Desktop
- Status bar / notice with last refresh time
- Validate JSON before render

### Fase 4 triggers

- Graphs regularly > ~5k nodes → evaluate Cytoscape
- Need shareable vault-local artifact → optional snapshot copy
- Want public install → Community Plugin checklist (separate effort)

## Explicitly deferred

- Semantic / LLM Graphify
- Whole Claudesidian index
- Local HTTP API
- Mobile Refresh
