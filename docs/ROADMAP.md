# Roadmap — Graphify Visualizer

**North star:** Obsidian is the filing cabinet for Graphify maps in `~/.cache/graphify-lupa/`. Catalog first, then browser viz, then in-app graph, then refresh.

| Phase | Name | Deliverable | Done when |
|---|---|---|---|
| **Scaffold** | Docs + repo | Nested git + architecture docs | ✅ 2026-08-16 |
| **0** | Boilerplate | Empty ItemView, ribbon, command | ✅ 2026-08-16 |
| **1** | Catalog | List cache slugs + repo path + json/html flags | ✅ 2026-08-16 |
| **2** | Open standard viz | Button opens `graph.html` in system browser | ✅ 2026-08-16 |
| **3** | In-Obsidian viewer | vis-network + click → `openLinkText` | ✅ 2026-08-16 |
| **4** | Refresh | Desktop subprocess extract / cluster-only | Pending |
| **5** | UX | Settings (cache root), clear errors | Pending |
| **6** | Later | Extract wizard, Community publish, Cytoscape | Only if asked |

## Phase notes

### Fase 0 — done

Agentfiles-shaped `plugin/`: esbuild, desktop-only manifest, empty view, vault symlink.

### Fase 1 — done (catalog)

- Scan `~/.cache/graphify-lupa/<slug>/graphify-out/`
- Show slug, code root (`.graphify_root`), mtime, json/html badges
- Refresh list button; row click → Notice with paths (superseded in Fase 2)
- No vis-network yet (Fase 3)

### Fase 2 — done (open standard viz)

- Row click / Enter → `electron.shell.openPath(graph.html)`
- Missing html → Notice with `graphify cluster-only` hint
- Rows without html use `is-disabled` styling

### Fase 3 — done (in-Obsidian viewer)

- Row click → load `graph.json` into vis-network in the same ItemView
- Node click → open `repoRoot/source_file` in Obsidian (or OS if outside vault)
- **Back** + **Open in browser** / row **Browser** button keep Fase 2 path

### Fase 4

- Call `run-code-only.sh` + optional `graphify cluster-only`

### Fase 5

- Setting for cache root; disable actions when artifacts missing

### Explicitly deferred

- Semantic / LLM Graphify
- Whole Claudesidian index
- Local HTTP API
- Mobile Refresh
