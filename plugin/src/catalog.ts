import { homedir } from "os";
import { join } from "path";

export type GraphEntry = {
  slug: string;
  cacheDir: string;
  outDir: string;
  repoRoot: string | null;
  hasJson: boolean;
  hasHtml: boolean;
  jsonPath: string | null;
  htmlPath: string | null;
  updatedMs: number | null;
  nodeCount: number | null;
  edgeCount: number | null;
};

type FsLike = {
  existsSync: (p: string) => boolean;
  readdirSync: (p: string, opts?: { withFileTypes?: boolean }) => unknown;
  readFileSync: (p: string, enc: string) => string;
  statSync: (p: string) => { mtimeMs: number; size: number };
};

function getFs(): FsLike | null {
  try {
    // Desktop Electron — same constraint as isDesktopOnly
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("fs") as FsLike;
  } catch {
    return null;
  }
}

export function defaultCacheRoot(): string {
  return join(homedir(), ".cache", "graphify-lupa");
}

function readCounts(fs: FsLike, jsonPath: string): {
  nodes: number | null;
  edges: number | null;
} {
  try {
    const raw = fs.readFileSync(jsonPath, "utf8");
    // ponytail: full parse OK for catalog mtime path; graphs are <2MB typical
    const data = JSON.parse(raw) as {
      nodes?: unknown[];
      links?: unknown[];
      edges?: unknown[];
    };
    const nodes = Array.isArray(data.nodes) ? data.nodes.length : null;
    const links = Array.isArray(data.links)
      ? data.links.length
      : Array.isArray(data.edges)
        ? data.edges.length
        : null;
    return { nodes, edges: links };
  } catch {
    return { nodes: null, edges: null };
  }
}

/** Scan ~/.cache/graphify-lupa (or override) for graphify-out entries. */
export function scanCatalog(cacheRoot = defaultCacheRoot()): GraphEntry[] {
  const fs = getFs();
  if (!fs || !fs.existsSync(cacheRoot)) return [];

  const dirents = fs.readdirSync(cacheRoot, { withFileTypes: true }) as Array<{
    name: string;
    isDirectory: () => boolean;
  }>;

  const entries: GraphEntry[] = [];

  for (const d of dirents) {
    if (!d.isDirectory() || d.name.startsWith(".")) continue;
    const slug = d.name;
    const cacheDir = join(cacheRoot, slug);
    const outDir = join(cacheDir, "graphify-out");
    if (!fs.existsSync(outDir)) continue;

    const jsonPath = join(outDir, "graph.json");
    const htmlPath = join(outDir, "graph.html");
    const rootPath = join(outDir, ".graphify_root");

    const hasJson = fs.existsSync(jsonPath);
    const hasHtml = fs.existsSync(htmlPath);

    let repoRoot: string | null = null;
    if (fs.existsSync(rootPath)) {
      try {
        repoRoot = fs.readFileSync(rootPath, "utf8").trim() || null;
      } catch {
        repoRoot = null;
      }
    }

    let updatedMs: number | null = null;
    if (hasJson) {
      try {
        updatedMs = fs.statSync(jsonPath).mtimeMs;
      } catch {
        updatedMs = null;
      }
    } else {
      try {
        updatedMs = fs.statSync(outDir).mtimeMs;
      } catch {
        updatedMs = null;
      }
    }

    let nodeCount: number | null = null;
    let edgeCount: number | null = null;
    if (hasJson) {
      const c = readCounts(fs, jsonPath);
      nodeCount = c.nodes;
      edgeCount = c.edges;
    }

    entries.push({
      slug,
      cacheDir,
      outDir,
      repoRoot,
      hasJson,
      hasHtml,
      jsonPath: hasJson ? jsonPath : null,
      htmlPath: hasHtml ? htmlPath : null,
      updatedMs,
      nodeCount,
      edgeCount,
    });
  }

  entries.sort((a, b) => (b.updatedMs ?? 0) - (a.updatedMs ?? 0));
  return entries;
}

export function truncatePath(p: string, max = 56): string {
  if (p.length <= max) return p;
  return "…" + p.slice(-(max - 1));
}

export function formatUpdated(ms: number | null): string {
  if (ms == null) return "—";
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return "—";
  }
}
