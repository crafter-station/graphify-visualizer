import { App, FileSystemAdapter, normalizePath } from "obsidian";
import { dirname, join } from "path";
import type { GraphEntry } from "./catalog";

type FsLike = {
  existsSync: (p: string) => boolean;
  mkdirSync: (p: string, opts: { recursive: boolean }) => void;
  copyFileSync: (src: string, dest: string) => void;
  statSync: (p: string) => { mtimeMs: number };
};

function getFs(): FsLike | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("fs") as FsLike;
  } catch {
    return null;
  }
}

const PLUGIN_ID = "graphify-visualizer";

export type CachedHtml = {
  vaultRel: string;
  absPath: string;
  resourceUrl: string;
};

/** Vault-relative path under the installed plugin folder (symlink-safe). */
export function cachedHtmlVaultRel(slug: string): string {
  return normalizePath(
    `.obsidian/plugins/${PLUGIN_ID}/cache/${slug}/graph.html`,
  );
}

/**
 * Copy official graph.html into plugin cache so Obsidian can serve it
 * via getResourcePath (scripts/CDN work under app resource protocol).
 */
export function ensureCachedHtml(
  app: App,
  entry: GraphEntry,
): CachedHtml {
  if (!entry.htmlPath || !entry.hasHtml) {
    throw new Error("No graph.html — run graphify cluster-only first");
  }

  const fs = getFs();
  if (!fs) throw new Error("Filesystem unavailable (desktop only)");

  const adapter = app.vault.adapter;
  if (!(adapter instanceof FileSystemAdapter)) {
    throw new Error("Desktop filesystem adapter required");
  }

  const vaultRel = cachedHtmlVaultRel(entry.slug);
  const absPath = join(adapter.getBasePath(), vaultRel);
  const src = entry.htmlPath;

  if (!fs.existsSync(src)) {
    throw new Error(`Missing source HTML: ${src}`);
  }

  const destDir = dirname(absPath);
  fs.mkdirSync(destDir, { recursive: true });

  // Always refresh when source is newer or dest missing
  let needCopy = !fs.existsSync(absPath);
  if (!needCopy) {
    try {
      needCopy = fs.statSync(src).mtimeMs > fs.statSync(absPath).mtimeMs;
    } catch {
      needCopy = true;
    }
  }
  if (needCopy) fs.copyFileSync(src, absPath);

  const resourceUrl = adapter.getResourcePath(vaultRel);
  return { vaultRel, absPath, resourceUrl };
}
