# Graphify Obsidian Visualizer — plugin package

Obsidian plugin source for [Graphify Obsidian Visualizer](../README.md). Companion to [Graphify Labs](https://github.com/Graphify-Labs/graphify) / [graphify.com](https://www.graphify.com).

## Build

```bash
cd plugin
bun install
bun run build    # production → main.js
bun run dev      # watch mode
```

Ship unit Obsidian loads: `main.js` + `manifest.json` + `styles.css`.

## Local install (this Claudesidian vault)

From repo root (or `plugin/`):

```bash
VAULT="/Users/nuevousuario/Library/CloudStorage/GoogleDrive-ivelasquezfr@gmail.com/My Drive/One Drive/Obsidian/Claude Code Setup/Claude Code"
PLUGIN_SRC="$(cd "$(dirname "$0")" && pwd)"

ln -sfn "$PLUGIN_SRC" "$VAULT/.obsidian/plugins/graphify-visualizer"
```

Then in Obsidian:

1. Settings → Community plugins → turn off Restricted mode if needed
2. Enable **Graphify Obsidian Visualizer**
3. Reload (`Cmd+R`) or restart
4. Command palette → **Open Graphify Visualizer**

## Layout

```text
plugin/
├── manifest.json
├── versions.json
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
├── styles.css
├── main.js              # built (gitignored)
├── src/
│   ├── main.ts
│   └── view.ts
└── README.md
```
