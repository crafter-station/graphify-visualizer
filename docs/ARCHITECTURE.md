# Architecture — Graphify Visualizer

## Intent

Obsidian **catalog + viewer** for Graphify maps stored outside the vault. Humans see which graphs exist, which code root each one maps, and (later) open HTML or navigate nodes in-app.

## Bridge model

```text
┌─────────────────────────────────────────────────────────┐
│  External motor (Graphify CLI + graphify-lupa)          │
│  extract --code-only → ~/.cache/graphify-lupa/<slug>/   │
│    graphify-out/graph.json                              │
│    graphify-out/graph.html   (after cluster-only)       │
│    graphify-out/.graphify_root                          │
└───────────────────────────┬─────────────────────────────┘
                            │ read-only scan
                            ▼
┌─────────────────────────────────────────────────────────┐
│  Obsidian plugin (plugin/)                              │
│                                                         │
│  Fase 1: Catalog ItemView (list slugs)                  │
│  Fase 2: Open graph.html in system browser              │
│  Fase 3: vis-network + openLinkText                     │
│  Fase 4: Refresh via child_process → CLI                │
└─────────────────────────────────────────────────────────┘
```

## Responsibilities

| Layer | Owns | Does not own |
|---|---|---|
| Graphify CLI | AST extract, cluster, `graph.html`, JSON schema | Obsidian UI |
| graphify-lupa | Cache paths, `--code-only` policy, never write into vault | Plugin code |
| This plugin | Catalog, open viz, optional in-app graph, refresh trigger | Parsing repos, LLM semantic graphs, whole-vault index |

## Data contract (catalog)

- **Cache root (default):** `~/.cache/graphify-lupa/`
- **Entry:** each child directory = `slug`
- **Artifacts:** `graphify-out/graph.json`, optional `graph.html`, `.graphify_root` (absolute code root)
- **Output:** none required for Fase 1 (read-only list)

## Alignment with Agentic OS

MAK-439: CLI on-demand; graphs stay off Google Drive. Plugin is a UI skin over that cache, not a background indexer of Claudesidian.
