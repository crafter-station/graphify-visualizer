<div align="center">

<pre>
╔══════════════════════════════════════════════╗

   ██████╗ ██╗   ██╗
  ██╔════╝ ██║   ██║
  ██║  ███╗██║   ██║
  ██║   ██║╚██╗ ██╔╝
  ╚██████╔╝ ╚████╔╝
   ╚═════╝   ╚═══╝

  GRAPHIFY VISUALIZER
  Obsidian plugin  ·  CLI bridge  ·  click → file

╚══════════════════════════════════════════════╝
</pre>

### Graphify Visualizer

**Catalog Graphify maps from `~/.cache/graphify-lupa`, then open or navigate them.**  
The plugin is a **filing cabinet + viewer bridge** — it does not analyze code.

[![Status](https://img.shields.io/badge/status-fase3-16A34A)](docs/ROADMAP.md)
[![Stack](https://img.shields.io/badge/stack-TypeScript%20%2B%20Obsidian%20API%20%2B%20vis--network-3b82f6)](docs/DECISIONS.md)
[![License](https://img.shields.io/badge/license-MIT-047857)](LICENSE)

</div>

![Bridge architecture](docs/assets/bridge-architecture.png)

## What it does

Graphify already cooks graphs in the terminal. This plugin lists them in Obsidian:

| Capability | Phase |
|---|---|
| **Catalog** cache slugs + code root + json/html flags | ✅ Fase 1 |
| **Open** `graph.html` in system browser | ✅ Fase 2 |
| **Render** network in Obsidian + click → file | ✅ Fase 3 |
| **Refresh** via CLI subprocess | Fase 4 |

## What it is not

- Not Obsidian’s note graph
- Not a whole-vault indexer
- Not a new tree-sitter / Python analysis engine
- Not Excalidraw freehand drawing
- Not a local HTTP API (CLI subprocess only)
- Not mobile Refresh (Desktop / Electron)

## How the bridge works

```text
Software repo
    → Graphify CLI  extract --code-only
    → ~/.cache/graphify-lupa/<slug>/graphify-out/
    → This plugin (catalog → browser / vis-network)
    → click node → open file in editor (Fase 3)
```

Full write-up: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · decisions: [`docs/DECISIONS.md`](docs/DECISIONS.md)

## Status

| Phase | State |
|---|---|
| Scaffold (docs + repo) | Done |
| Fase 0 — empty ItemView boilerplate | Done |
| Fase 1 — catalog of cache graphs | Done |
| Fase 2 — open graph.html | Done |
| Fase 3 — vis-network in Obsidian | Done |
| Fase 4 — Refresh → CLI | Next |

Track: [`docs/ROADMAP.md`](docs/ROADMAP.md)

## Quick start (today)

```bash
git clone git@github.com:TheVeller/graphify-visualizer.git
cd graphify-visualizer/plugin
bun install && bun run build
# symlink plugin/ into <vault>/.obsidian/plugins/graphify-visualizer — see plugin/README.md
```

Enable **Graphify Visualizer** in Obsidian → command **Open Graphify Visualizer**.

Fase 1 will load Graphify cache JSON:

`~/.cache/graphify-lupa/<slug>/graphify-out/graph.json`

## Repo map

```text
graphify-visualizer/
├── README.md
├── AGENTS.md
├── LICENSE
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DECISIONS.md
│   ├── ROADMAP.md
│   └── assets/           # Excalidraw + PNG
├── Development-Log/
└── plugin/               # Obsidian plugin (Fase 0 ItemView + esbuild)
```

## Contributing

Private repo — collaborate with the owner.  
Non-code help welcome: tighten docs, critique the bridge diagram, report schema mismatches against real `graph.json`.

Agent rules: [`AGENTS.md`](AGENTS.md)

## License

[MIT](LICENSE)
