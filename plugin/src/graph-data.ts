import { join } from "path";

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

export type VisNode = {
  id: string;
  label: string;
  title?: string;
  group?: string;
  source_file?: string;
};

export type VisEdge = {
  id: string;
  from: string;
  to: string;
  title?: string;
};

export type LoadedGraph = {
  nodes: VisNode[];
  edges: VisEdge[];
};

type RawGraph = {
  nodes?: Array<{
    id?: string;
    label?: string;
    source_file?: string;
    community?: number;
    community_name?: string;
  }>;
  links?: Array<{
    source?: string;
    target?: string;
    relation?: string;
  }>;
};

const PALETTE = [
  "#4e79a7",
  "#f28e2b",
  "#e15759",
  "#76b7b2",
  "#59a14f",
  "#edc948",
  "#b07aa1",
  "#ff9da7",
  "#9c755f",
  "#bab0ac",
];

/** Load NetworkX-style graph.json into vis-network node/edge arrays. */
export function loadGraph(jsonPath: string): LoadedGraph {
  const fs = getFs();
  if (!fs || !fs.existsSync(jsonPath)) {
    throw new Error(`Missing graph.json: ${jsonPath}`);
  }
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as RawGraph;
  const nodes: VisNode[] = [];
  for (const n of raw.nodes ?? []) {
    if (n.id == null) continue;
    const id = String(n.id);
    const label = n.label ?? id;
    const community = n.community ?? 0;
    nodes.push({
      id,
      label,
      title: [n.source_file, n.community_name]
        .filter(Boolean)
        .join(" · "),
      group: String(community),
      source_file: n.source_file,
    });
  }

  const edges: VisEdge[] = [];
  let i = 0;
  for (const l of raw.links ?? []) {
    if (l.source == null || l.target == null) continue;
    edges.push({
      id: `e${i++}`,
      from: String(l.source),
      to: String(l.target),
      title: l.relation,
    });
  }

  return { nodes, edges };
}

export function communityColor(group: string | undefined): string {
  const n = Number(group);
  if (!Number.isFinite(n)) return PALETTE[0];
  return PALETTE[((n % PALETTE.length) + PALETTE.length) % PALETTE.length];
}

export function resolveSourceAbs(
  repoRoot: string | null,
  sourceFile: string | undefined,
): string | null {
  if (!repoRoot || !sourceFile) return null;
  return join(repoRoot, sourceFile);
}
