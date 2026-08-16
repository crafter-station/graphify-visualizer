# Decisions — Graphify Visualizer

Closed choices for the MVP. Reopen only with explicit human OK.

---

## ADR-001 — Product shape: viewer bridge, not new analyzer

**Date:** 2026-08-16  
**Status:** Accepted

**Context:** Need an Obsidian-native way to explore Graphify graphs. Temptation: rebuild analysis with Python + tree-sitter inside `/scripts`.

**Decision:** Plugin reads Graphify CLI JSON. Motor stays external (existing CLI + `graphify-lupa`).

**Rationale:** Less code, matches MAK-439, zero LLM for code-only path, one schema to maintain.

**Alternatives rejected:**

- New Python tree-sitter pipeline — duplicate work, maintenance tax.
- Semantic Graphify (LLM) inside plugin — credit/auth fragile; deferred in spike.

---

## ADR-002 — Refresh via CLI subprocess, not local API

**Date:** 2026-08-16  
**Status:** Accepted

**Context:** Plugin needs a way to regenerate `graph.json` without leaving Obsidian.

**Decision:** Button/command runs CLI/script through `child_process` on Desktop.

**Rationale:** Single-user, one machine, fewer moving parts than a always-on HTTP server.

**Alternatives rejected:**

- Local HTTP API / daemon — port, lifecycle, CORS, “is it running?” failures.
- Manual-only refresh — worse UX but acceptable fallback if CLI path unset.

**Consequence:** Refresh is **Desktop-only**. Document that clearly in UI copy.

---

## ADR-003 — vis-network for MVP visualization

**Date:** 2026-08-16  
**Status:** Accepted

**Context:** Need interactive network rendering. Candidates: Cytoscape.js vs vis-network.

**Decision:** vis-network for MVP.

**Rationale:** Faster to ship; enough for repo/slice graphs (hundreds–low thousands of nodes). Cytoscape reserved if scale/filtering demands it.

**Alternatives rejected:**

- Cytoscape day-1 — more power, more config, slower MVP.
- Excalidraw-style free canvas — different product (drawing), not dependency map.

---

## ADR-004 — JSON lives in Graphify cache, not vault by default

**Date:** 2026-08-16  
**Status:** Accepted

**Context:** Vault sits on Google Drive; Graphify policy keeps `graphify-out/` out of git/Drive noise.

**Decision:** Default settings point at `~/.cache/graphify-lupa/<slug>/graphify-out/graph.json`. Plugin setting = absolute path.

**Rationale:** Aligns with graphify-lupa hard rules and MAK-439.

**Alternatives deferred:** Optional “copy snapshot into vault” for versioning a frozen graph — Fase 4+ if asked.

---

## ADR-005 — Home in PARA+ Software, nested git

**Date:** 2026-08-16  
**Status:** Accepted

**Context:** Need a durable home for code + docs inside Claudesidian without polluting ADK.

**Decision:** `02_Programs/3-Software/graphify-visualizer/` as nested git repo; parent vault gitignores the path until/unless a different integration is chosen.

**Rationale:** Same pattern as other standalone software under `3-Software/`; docs stay next to code; vault root stays clean.

---

## ADR-006 — Catalog-first (maps live in cache, not vault)

**Date:** 2026-08-16  
**Status:** Accepted

**Context:** Graphify’s default writes `graphify-out/` inside the analyzed repo. graphify-lupa redirects to `~/.cache/graphify-lupa/<slug>/` so Drive/git stay clean. The plugin’s first job is not a blank canvas — it is listing those maps and linking each to its code root.

**Decision:** Ship **catalog UI before** in-app vis-network or browser open. Phase order: Catalog → open `graph.html` → vis-network → CLI refresh → settings.

**Rationale:** Matches how Ignacio already uses Graphify (CLI + browser). Obsidian becomes the filing cabinet over cache, not a second analyzer.

**Alternatives rejected for v1:** Re-analyze vault in-plugin; require graphs inside the vault; skip catalog and jump straight to canvas.
