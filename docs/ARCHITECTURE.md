# Architecture — Graphify Visualizer

## Intent

Render Graphify dependency graphs inside Obsidian so a human can click a node and open the matching source file.

## Bridge model

```text
┌─────────────────────────────────────────────────────────┐
│  External motor (already exists)                        │
│                                                         │
│  graphify extract <repo> --code-only                    │
│       or                                                │
│  bash .agents/skills/graphify-lupa/run-code-only.sh …   │
│                                                         │
│  writes → ~/.cache/graphify-lupa/<slug>/graphify-out/   │
│            graph.json                                   │
└───────────────────────────┬─────────────────────────────┘
                            │ read-only
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Obsidian plugin (this repo → plugin/)                  │
│                                                         │
│  Settings: graph.json path, CLI/script path             │
│  ItemView: vis-network canvas                           │
│  Command: Open Graphify Visualizer                      │
│  Command/button: Refresh (child_process → CLI)          │
│  Node click: app.workspace.openLinkText(...)            │
└─────────────────────────────────────────────────────────┘
```

## Responsibilities

| Layer | Owns | Does not own |
|---|---|---|
| Graphify CLI | AST extract, JSON schema, `path`/`explain` | UI, Obsidian vault layout |
| graphify-lupa skill | Agent recipes, cache paths, `--code-only` policy | Plugin code |
| This plugin | ItemView, settings, refresh trigger, open file | Parsing repos, LLM semantic graphs |

## Data contract (MVP)

- **Input:** one `graph.json` path (absolute), configurable in plugin settings.
- **Assumption:** schema matches Graphify CLI output used by `graphify-lupa` (inspect a real file before coding adapters).
- **Output:** none required for MVP (read-only viewer). Optional later: copy snapshot into vault — out of scope until ROADMAP says so.

## Refresh path

1. User clicks Refresh (or runs command).
2. Plugin spawns configured CLI/script via Electron/`child_process` (non-blocking UI: show loading state).
3. On success: re-read `graph.json`, rebuild vis-network.
4. On failure: human-readable notice (CLI missing, bad path, non-zero exit).

Mobile Obsidian: Refresh disabled or hidden; view may still open a pre-generated JSON if path is readable.

## Security / ops notes

- No secrets in plugin settings beyond local filesystem paths.
- Do not shell-interpolate untrusted strings; pass argv arrays where possible.
- Cache directory is outside Google Drive vault on purpose (MAK-439 / Drive sync noise).

## Alignment with Agentic OS

MAK-439 chose **CLI on-demand**, not portable MCP, not always-on install.  
This plugin is an optional **UI skin** on that same CLI. It must not become a background indexer of the Claudesidian root.
