import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import {
  formatUpdated,
  scanCatalog,
  truncatePath,
  type GraphEntry,
} from "./catalog";
import { embedHtmlAsBlob, revokeEmbeddedHtml } from "./embed-html";
import { openGraphHtml } from "./open-html";

export const VIEW_TYPE = "graphify-visualizer-view";

export class GraphifyVisualizerView extends ItemView {
  private selected: GraphEntry | null = null;
  private blobUrl: string | null = null;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE;
  }

  getDisplayText(): string {
    return "Graphify Obsidian Visualizer";
  }

  getIcon(): string {
    return "git-fork";
  }

  async onOpen(): Promise<void> {
    this.containerEl.addClass("graphify-viz-leaf");
    this.renderCatalog();
  }

  async onClose(): Promise<void> {
    this.clearBlob();
    this.selected = null;
    this.containerEl.removeClass("graphify-viz-leaf");
    this.contentEl.empty();
  }

  private clearBlob(): void {
    revokeEmbeddedHtml(this.blobUrl);
    this.blobUrl = null;
  }

  private renderCatalog(): void {
    this.clearBlob();
    this.selected = null;

    const root = this.contentEl;
    root.empty();
    root.addClass("graphify-viz-root");
    root.removeClass("graphify-viz-root-graph");

    const header = root.createDiv({ cls: "graphify-viz-header" });
    header.createEl("h2", { text: "Graphify Obsidian Visualizer" });
    header.createEl("p", {
      cls: "graphify-viz-sub",
      text: "Maps in ~/.cache/graphify-lupa — click a row to embed Graphify’s graph.html.",
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
        cls: entry.hasHtml
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
        if (!entry.hasHtml || !entry.htmlPath) {
          new Notice(
            `No graph.html — run: graphify cluster-only ${entry.cacheDir}`,
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
    this.clearBlob();
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

    const browserBtn = toolbar.createEl("button", {
      text: "Open in browser",
    });
    browserBtn.addEventListener("click", () => {
      void openGraphHtml(entry.htmlPath!).then((err) => {
        if (err) new Notice(`Could not open graph.html: ${err}`, 8000);
      });
    });

    const frameWrap = root.createDiv({ cls: "graphify-viz-frame-wrap" });

    let embedded;
    try {
      embedded = embedHtmlAsBlob(entry);
      this.blobUrl = embedded.url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      frameWrap.createDiv({
        cls: "graphify-viz-empty",
        text: `Could not embed graph.html: ${msg}`,
      });
      new Notice(`${msg} — use Open in browser`, 8000);
      return;
    }

    const iframe = frameWrap.createEl("iframe", {
      cls: "graphify-viz-iframe",
      attr: {
        src: embedded.url,
        title: `Graphify ${entry.slug}`,
        // allow-scripts: vis-network + Graphify UI
        // allow-same-origin: needed for some blob interactions
        // allow-popups / forms: Graphify controls
        sandbox: "allow-scripts allow-same-origin allow-popups allow-forms",
      },
    });

    iframe.addEventListener("error", () => {
      new Notice(
        "Embed failed to load — try Open in browser (CDN may be blocked)",
        8000,
      );
    });
  }
}
