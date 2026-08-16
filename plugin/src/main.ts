import { Plugin } from "obsidian";
import { GraphifyVisualizerView, VIEW_TYPE } from "./view";

export default class GraphifyVisualizerPlugin extends Plugin {
	async onload(): Promise<void> {
		this.registerView(VIEW_TYPE, (leaf) => new GraphifyVisualizerView(leaf));

		this.addRibbonIcon("git-graph", "Graphify Visualizer", () => {
			void this.activateView();
		});

		this.addCommand({
			id: "open",
			name: "Open Graphify Visualizer",
			callback: () => {
				void this.activateView();
			},
		});
	}

	onunload(): void {
		// View cleanup handled by Obsidian when leaves detach.
	}

	async activateView(): Promise<void> {
		const existing = this.app.workspace.getLeavesOfType(VIEW_TYPE);
		if (existing.length > 0) {
			await this.app.workspace.revealLeaf(existing[0]);
			return;
		}
		const leaf = this.app.workspace.getLeaf("tab");
		await leaf.setViewState({ type: VIEW_TYPE, active: true });
		await this.app.workspace.revealLeaf(leaf);
	}
}
