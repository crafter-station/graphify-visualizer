import { ItemView, Notice, WorkspaceLeaf } from "obsidian";
import {
  formatUpdated,
  scanCatalog,
  truncatePath,
  type GraphEntry,
} from "./catalog";

export const VIEW_TYPE = "graphify-visualizer-view";

export class GraphifyVisualizerView extends ItemView {
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
    this.contentEl.empty();
  }

  private renderCatalog(): void {
    const root = this.contentEl;
    root.empty();
    root.addClass("graphify-viz-root");

    const header = root.createDiv({ cls: "graphify-viz-header" });
    header.createEl("h2", { text: "Graphify Visualizer" });
    header.createEl("p", {
      cls: "graphify-viz-sub",
      text: "Maps in ~/.cache/graphify-lupa — linked to their code roots.",
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
        cls: "graphify-viz-row",
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
        const lines = [
          `slug: ${entry.slug}`,
          entry.repoRoot ? `repo: ${entry.repoRoot}` : "repo: (missing)",
          entry.jsonPath ? `json: ${entry.jsonPath}` : "json: missing",
          entry.htmlPath ? `html: ${entry.htmlPath}` : "html: missing",
        ];
        new Notice(lines.join("\n"), 8000);
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
}
