import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import { DataSet } from "vis-data";
import { Network, type Options } from "vis-network";
import {
  formatUpdated,
  scanCatalog,
  truncatePath,
  type GraphEntry,
} from "./catalog";
import { communityColor, loadGraph } from "./graph-data";
import { openGraphHtml } from "./open-html";
import { openSourceFile } from "./open-file";

export const VIEW_TYPE = "graphify-visualizer-view";

const NETWORK_OPTS: Options = {
  autoResize: true,
  interaction: { hover: true, tooltipDelay: 120, navigationButtons: true },
  physics: {
    // ponytail: barnesHut OK for ~1k nodes; upgrade to forceAtlas2Based if lag
    barnesHut: { gravitationalConstant: -8000, springLength: 95 },
    stabilization: { iterations: 120 },
  },
  nodes: {
    shape: "dot",
    size: 10,
    font: { size: 12, face: "var(--font-interface)" },
    borderWidth: 1,
  },
  edges: {
    arrows: { to: { enabled: true, scaleFactor: 0.4 } },
    color: { opacity: 0.45 },
    smooth: { type: "continuous", roundness: 0.2 },
  },
};

export class GraphifyVisualizerView extends ItemView {
  private network: Network | null = null;
  private selected: GraphEntry | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Graphify Visualizer";
  }

  getIcon(): string {
    return "git-fork";
  }

  async onOpen(): Promise<void> {
    this.renderCatalog();
  }

  async onClose(): Promise<void> {
    this.destroyNetwork();
    this.contentEl.empty();
  }

  private destroyNetwork(): void {
    if (this.network) {
      this.network.destroy();
      this.network = null;
    }
  }

  private renderCatalog(): void {
    this.destroyNetwork();
    this.selected = null;

    const root = this.contentEl;
    root.empty();
    root.addClass("graphify-viz-root");
    root.removeClass("graphify-viz-root-graph");

    const header = root.createDiv({ cls: "graphify-viz-header" });
    header.createEl("h2", { text: "Graphify Visualizer" });
    header.createEl("p", {
      cls: "graphify-viz-sub",
      text: "Maps in ~/.cache/graphify-lupa — click a row to open in Obsidian.",
    });

    const actions = header.createDiv({ cls: "graphify-viz-actions" });
    const refreshBtn = actions.createEl("button", {
      cls: "mod-cta",
      text: "Refresh list",
    });
    refreshBtn.addEventListener("click", () => {
      this.renderCatalog();
      new Notice("Graphify catalog refreshed");
    });

    let entries: GraphEntry[] = [];
    try {
      entries = scanCatalog();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      root.createDiv({
        cls: "graphify-viz-empty",
        text: `Could not scan cache: ${msg}`,
      });
      return;
    }

    if (entries.length === 0) {
      root.createDiv({
        cls: "graphify-viz-empty",
        text: "No graphs yet — run graphify-lupa on a software repo",
      });
      return;
    }

    const list = root.createDiv({ cls: "graphify-viz-list" });

    for (const entry of entries) {
      const row = list.createDiv({
        cls: entry.hasJson
          ? "graphify-viz-row"
          : "graphify-viz-row is-disabled",
        attr: { tabindex: "0", role: "button" },
      });

      const title = row.createDiv({ cls: "graphify-viz-row-title" });
      title.createSpan({ cls: "graphify-viz-slug", text: entry.slug });

      const badges = title.createDiv({ cls: "graphify-viz-badges" });
      badges.createSpan({
        cls: entry.hasJson
          ? "graphify-viz-badge is-on"
          : "graphify-viz-badge is-off",
        text: "json",
      });
      badges.createSpan({
        cls: entry.hasHtml
          ? "graphify-viz-badge is-on"
          : "graphify-viz-badge is-off",
        text: "html",
      });

      if (entry.hasHtml && entry.htmlPath) {
        const browserBtn = badges.createEl("button", {
          cls: "graphify-viz-browser-btn",
          text: "Browser",
        });
        browserBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          void openGraphHtml(entry.htmlPath!).then((err) => {
            if (err) new Notice(`Could not open graph.html: ${err}`, 8000);
          });
        });
      }

      const repoLabel = entry.repoRoot
        ? truncatePath(entry.repoRoot)
        : "(no .graphify_root)";
      row.createDiv({
        cls: "graphify-viz-row-repo",
        text: repoLabel,
        attr: entry.repoRoot ? { title: entry.repoRoot } : {},
      });

      const metaBits: string[] = [formatUpdated(entry.updatedMs)];
      if (entry.nodeCount != null && entry.edgeCount != null) {
        metaBits.push(`${entry.nodeCount} nodes · ${entry.edgeCount} edges`);
      }
      row.createDiv({
        cls: "graphify-viz-row-meta",
        text: metaBits.join(" · "),
      });

      const activate = () => {
        if (!entry.hasJson || !entry.jsonPath) {
          new Notice(
            `No graph.json — run graphify-lupa extract on a repo`,
            8000,
          );
          return;
        }
        this.renderGraph(entry);
      };

      row.addEventListener("click", activate);
      row.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          activate();
        }
      });
    }
  }

  private renderGraph(entry: GraphEntry): void {
    this.destroyNetwork();
    this.selected = entry;

    const root = this.contentEl;
    root.empty();
    root.addClass("graphify-viz-root");
    root.addClass("graphify-viz-root-graph");

    const toolbar = root.createDiv({ cls: "graphify-viz-toolbar" });
    const backBtn = toolbar.createEl("button", { text: "Back" });
    backBtn.addEventListener("click", () => this.renderCatalog());

    toolbar.createSpan({
      cls: "graphify-viz-toolbar-title",
      text: entry.slug,
    });

    if (entry.hasHtml && entry.htmlPath) {
      const browserBtn = toolbar.createEl("button", {
        text: "Open in browser",
      });
      browserBtn.addEventListener("click", () => {
        void openGraphHtml(entry.htmlPath!).then((err) => {
          if (err) new Notice(`Could not open graph.html: ${err}`, 8000);
        });
      });
    }

    const canvas = root.createDiv({ cls: "graphify-viz-canvas" });

    let loaded;
    try {
      loaded = loadGraph(entry.jsonPath!);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      canvas.setText(`Could not load graph: ${msg}`);
      return;
    }

    const nodes = new DataSet(
      loaded.nodes.map((n) => ({
        id: n.id,
        label: n.label,
        title: n.title,
        group: n.group,
        color: communityColor(n.group),
        source_file: n.source_file,
      })),
    );
    const edges = new DataSet(loaded.edges);

    this.network = new Network(canvas, { nodes, edges }, NETWORK_OPTS);

    this.network.on("click", (params) => {
      const id = params.nodes?.[0];
      if (id == null) return;
      const node = nodes.get(id) as { source_file?: string } | null;
      if (!node?.source_file) {
        new Notice("Node has no source_file", 4000);
        return;
      }
      void openSourceFile(this.app, entry.repoRoot, node.source_file).then(
        (err) => {
          if (err) new Notice(`Could not open file: ${err}`, 8000);
        },
      );
    });
  }
}
