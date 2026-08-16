import {
  App,
  FileSystemAdapter,
  Notice,
  TFile,
  normalizePath,
} from "obsidian";
import { isAbsolute, relative } from "path";
import { resolveSourceAbs } from "./graph-data";

/**
 * Open a graph node's source_file in Obsidian when under the vault,
 * otherwise open with the OS default editor/viewer.
 * @returns null OK, error message on failure
 */
export async function openSourceFile(
  app: App,
  repoRoot: string | null,
  sourceFile: string | undefined,
): Promise<string | null> {
  const abs = resolveSourceAbs(repoRoot, sourceFile);
  if (!abs) return "Node has no source_file";

  const adapter = app.vault.adapter;
  if (adapter instanceof FileSystemAdapter) {
    const base = adapter.getBasePath();
    const rel = relative(base, abs);
    if (rel && !rel.startsWith("..") && !isAbsolute(rel)) {
      const vaultPath = normalizePath(rel);
      const af = app.vault.getAbstractFileByPath(vaultPath);
      if (af instanceof TFile) {
        await app.workspace.getLeaf(false).openFile(af);
        return null;
      }
      try {
        await app.workspace.openLinkText(vaultPath, "", false);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : String(e);
      }
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const electron = require("electron") as {
      shell: { openPath: (p: string) => Promise<string> };
    };
    const err = await electron.shell.openPath(abs);
    if (err && err.length > 0) return err;
    new Notice(`Opened outside vault:\n${abs}`, 5000);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : String(e);
  }
}
