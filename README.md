---
title: Graphify Visualizer
type: software-project
status: scaffolding
category: programs/software
tags:
  - obsidian-plugin
  - graphify
  - visualization
  - bridge-architecture
created: 2026-08-16
updated: 2026-08-16
related:
  - "[[02_Programs/0-Projects/Agentic OS Setup/spikes/graphify-mak-439]]"
  - MAK-439
---

# Graphify Visualizer

**Type:** Side project · Obsidian plugin  
**Status:** 🟡 Scaffolding (docs + repo; plugin code not started)  
**Tech stack:** TypeScript · Obsidian API · vis-network · Graphify CLI (external)  
**Started:** 2026-08-16  
**Repository:** [TheVeller/graphify-visualizer](https://github.com/TheVeller/graphify-visualizer) (private) · local path `02_Programs/3-Software/graphify-visualizer/`

## What this is

Interactive **viewer** inside Obsidian for `graph.json` files produced by the **Graphify CLI**.

It does **not** analyze code itself. It is a **bridge**:

```text
[software repo]
      ↓
[Graphify CLI --code-only]     ← already exists (graphify-lupa)
      ↓
[~/.cache/.../graph.json]      ← outside the vault (MAK-439 policy)
      ↓
[This plugin: ItemView]        ← NEW
      ↓
[click node → open file in Obsidian]
```

## Why it exists

Today Graphify answers live in the terminal (`path` / `explain`).  
This plugin turns the same data into a clickable map for humans who are not living in the CLI.

## Non-goals (MVP)

- Not a replacement for Obsidian’s note graph
- Not whole-vault indexing (Drive noise; blocked by root `.graphifyignore`)
- Not Excalidraw freehand drawing
- Not a new tree-sitter / Python analysis engine
- Not a local HTTP API (CLI subprocess only)
- Not mobile Obsidian (Desktop / Electron only for Refresh)
- Not Community Plugin store publish (later, optional)

## Closed stack decisions

See [[docs/DECISIONS|docs/DECISIONS.md]] for full rationale.

| Concern | Choice |
|---|---|
| Motor | Reuse Graphify CLI + `graphify-lupa` helper |
| Refresh | Direct CLI / subprocess (no API server) |
| Graph UI | vis-network (Cytoscape = later if needed) |
| JSON location | `~/.cache/graphify-lupa/<slug>/graphify-out/graph.json` |
| Plugin language | TypeScript + Obsidian API |

## Folder map

```text
graphify-visualizer/
├── README.md              ← you are here
├── AGENTS.md              ← rules for coding agents
├── docs/
│   ├── ARCHITECTURE.md    ← bridge design
│   ├── DECISIONS.md       ← ADR-style closed choices
│   └── ROADMAP.md         ← phases 0 → 4
├── Development-Log/       ← session notes
└── plugin/                ← Obsidian plugin source (empty until Fase 0)
```

## Related vault surfaces

| Surface | Role |
|---|---|
| `/graphify-lupa` skill | On-demand CLI extract (`--code-only`) |
| MAK-439 spike | Surface decision: CLI on-demand, no MCP always-on |
| Root `.graphifyignore` | Keeps vault corpus out of Graphify |

## Next action

**Fase 0:** scaffold Obsidian plugin boilerplate inside `plugin/` (empty ItemView + `manifest.json`).  
Ask agent: “Fase 0 boilerplate del plugin”.

## Docs index

| File | Purpose |
|---|---|
| [AGENTS.md](AGENTS.md) | Agent constraints |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | How the bridge works |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Why this stack |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Build order |
| [Development-Log/](Development-Log/) | What happened when |
