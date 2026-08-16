import type { GraphEntry } from "./catalog";

type FsLike = {
  existsSync: (p: string) => boolean;
  readFileSync: (p: string, enc: string) => string;
};

function getFs(): FsLike | null {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("fs") as FsLike;
  } catch {
    return null;
  }
}

export type EmbeddedHtml = {
  /** blob: URL — revoke with revokeEmbeddedHtml when leaving the view */
  url: string;
};

/**
 * Load official graph.html into a blob: URL for iframe.src.
 * Avoids getResourcePath / FileSystemAdapter instanceof (fragile under Obsidian bundling)
 * and works for files outside the vault (~/.cache/...).
 */
export function embedHtmlAsBlob(entry: GraphEntry): EmbeddedHtml {
  if (!entry.htmlPath || !entry.hasHtml) {
    throw new Error("No graph.html — run graphify cluster-only first");
  }
  const fs = getFs();
  if (!fs) throw new Error("Filesystem unavailable (desktop only)");
  if (!fs.existsSync(entry.htmlPath)) {
    throw new Error(`Missing source HTML: ${entry.htmlPath}`);
  }
  const html = fs.readFileSync(entry.htmlPath, "utf8");
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  return { url: URL.createObjectURL(blob) };
}

export function revokeEmbeddedHtml(url: string | null | undefined): void {
  if (url && url.startsWith("blob:")) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      /* ignore */
    }
  }
}
