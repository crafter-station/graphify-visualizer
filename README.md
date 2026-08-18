<div align="center">

<pre>
╔══════════════════════════════════════════════════╗

   ██████╗ ██╗   ██╗
  ██╔════╝ ██║   ██║
  ██║  ███╗██║   ██║
  ██║   ██║╚██╗ ██╔╝
  ╚██████╔╝ ╚████╔╝
   ╚═════╝   ╚═══╝

  GRAPHIFY OBSIDIAN VISUALIZER
  Obsidian plugin  ·  Graphify bridge  ·  embed graph.html

╚══════════════════════════════════════════════════╝
</pre>

# Graphify Obsidian Visualizer

**Browse [Graphify](https://www.graphify.com) knowledge graphs inside [Obsidian](https://obsidian.md/)** — catalog cache maps, embed official `graph.html`, keep Node Info 1:1 with the web viewer.

Companion to [Graphify](https://github.com/Graphify-Labs/graphify) by [Graphify Labs](https://www.graphify.com). This plugin is a **viewer bridge** 🗂️ — it does not analyze code.

[![Obsidian](https://img.shields.io/badge/Obsidian-plugin-7C3AED?logo=obsidian&logoColor=white)](https://obsidian.md)
[![Graphify](https://img.shields.io/badge/upstream-Graphify%20Labs-111827)](https://github.com/Graphify-Labs/graphify)
[![Org](https://img.shields.io/badge/org-Crafter%20Station-0EA5E9)](https://github.com/crafter-station)
[![Status](https://img.shields.io/badge/status-v0.5%20embed-16A34A)](docs/ROADMAP.md)
[![License](https://img.shields.io/badge/license-MIT-047857)](LICENSE)

[Website](https://www.graphify.com) · [Upstream CLI / skill](https://github.com/Graphify-Labs/graphify) · [App early access](https://app.graphify.com/login)

### Compatible with

<p>
  <a href="https://obsidian.md/"><img src="docs/assets/obsidian-badge.png" alt="Obsidian" height="48"/></a>
  &nbsp;&nbsp;
  <a href="https://graphify.com/"><img src="docs/assets/graphify-badge.png" alt="Graphify" height="48"/></a>
</p>

<a href="https://obsidian.md/">Obsidian</a> · <a href="https://graphify.com/">Graphify</a>

<br/>

<img src="docs/assets/cover-paqa.png" alt="Graphify Obsidian Visualizer — paqa map embedded with Node Info panel" width="900"/>

</div>

## ✨ Why this exists + Features

[Graphify](https://github.com/Graphify-Labs/graphify) turns a codebase into a queryable knowledge graph (`graph.html` + `graph.json`). You already open that HTML in a browser.

**Graphify Obsidian Visualizer** puts the same official viewer next to your notes:

| Feature | What you get |
|---|---|
| 📚 **Catalog** | Lists every slug under `~/.cache/graphify-lupa` with json/html flags, node counts, code root |
| 🖼️ **Embed** | Official Graphify `graph.html` inside an Obsidian leaf (communities legend + Node Info) |
| 🌐 **Browser escape hatch** | One click opens the same HTML in the system browser |
| 🗂️ **Filing cabinet** | Obsidian indexes and opens maps — Graphify CLI still cooks them |

<p align="center">
  <img src="docs/assets/catalog-list.png" alt="Catalog of Graphify maps in Obsidian" width="720"/>
  <br/>
  <em>Catalog view — pick a cache slug, then embed or open in browser.</em>
</p>

## What it is not

- Not Obsidian’s built-in note graph
- Not a vault-wide indexer or second Graphify engine
- Not tree-sitter / Python analysis (that stays in [upstream Graphify](https://github.com/Graphify-Labs/graphify))
- Not mobile Refresh (desktop / Electron only)

## How the bridge works

<img src="docs/assets/bridge-architecture.png" alt="Bridge architecture: software repo → Graphify CLI → cache → Obsidian embed" width="900"/>

<p align="center"><em>Software repo → Graphify CLI → <code>~/.cache/graphify-lupa</code> → this plugin embeds <code>graph.html</code> in Obsidian.</em></p>

Architecture: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · decisions: [`docs/DECISIONS.md`](docs/DECISIONS.md) · diagram source: [`docs/assets/bridge-architecture.excalidraw`](docs/assets/bridge-architecture.excalidraw)

## Upstream

| Resource | URL |
|---|---|
| **Origin repo** | [github.com/Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) |
| **Product site** | [www.graphify.com](https://www.graphify.com) |
| **Platform login** | [app.graphify.com](https://app.graphify.com/login) |

Install Graphify first (`uv tool install graphifyy` → `graphify install` → `/graphify .` in your assistant). Then use this plugin to browse the resulting maps in Obsidian.

## Status

| Phase | State |
|---|---|
| Fase 0 — ItemView scaffold | ✅ Done |
| Fase 1 — catalog of cache graphs | ✅ Done |
| Fase 2 — open `graph.html` in browser | ✅ Done |
| Fase 3 — embed official `graph.html` in Obsidian | ✅ Done |
| Fase 4 — Refresh via CLI subprocess | 🔜 Next |

Track: [`docs/ROADMAP.md`](docs/ROADMAP.md)

## 🚀 Quick start

```bash
git clone git@github.com:crafter-station/graphify-visualizer.git
cd graphify-visualizer/plugin
bun install && bun run build
# symlink plugin/ → <vault>/.obsidian/plugins/graphify-visualizer
```

Enable **Graphify Obsidian Visualizer** in Obsidian → command **Open Graphify Obsidian Visualizer**.

Expect maps at:

`~/.cache/graphify-lupa/<slug>/graphify-out/graph.html`

Details: [`plugin/README.md`](plugin/README.md)

## Repo map

```text
graphify-visualizer/
├── README.md
├── AGENTS.md
├── LICENSE
├── docs/                 # architecture, ADRs, roadmap, brand assets
├── Development-Log/
└── plugin/               # Obsidian plugin (esbuild → main.js)
```

## Topics / search keywords

`obsidian` · `obsidian-plugin` · `graphify` · `knowledge-graph` · `code-map` · `graph-visualization` · `pkm` · `typescript` · `desktop`

## Contributing

Issues and PRs welcome on docs, bridge UX, and schema mismatches against real `graph.json` / `graph.html`.

Agent rules: [`AGENTS.md`](AGENTS.md)

## License

[MIT](LICENSE) — plugin code. Graphify itself is owned by [Graphify Labs](https://github.com/Graphify-Labs/graphify); this repo only embeds their generated `graph.html`.

---

<div align="center">

**with 🖤 by [TheVeller](https://github.com/TheVeller) & [Crafter Station](https://github.com/crafter-station)**

</div>
