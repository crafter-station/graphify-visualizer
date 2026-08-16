import { ItemView, type WorkspaceLeaf } from "obsidian";

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
		return "git-graph";
	}

	async onOpen(): Promise<void> {
		const container = this.contentEl;
		container.empty();
		container.addClass("gv-empty");

		const title = container.createEl("h2", { cls: "gv-empty__title" });
		title.setText("Graphify Visualizer");

		const hint = container.createEl("p", { cls: "gv-empty__hint" });
		hint.setText(
			"Fase 0 — empty view. Fase 1 will load graph.json into vis-network."
		);
	}

	async onClose(): Promise<void> {
		this.contentEl.empty();
	}
}
