/** A scope filter removes unrelated nodes without inventing relationships across hidden levels. */
import type { GovernanceTree } from "#/_archives/lib/site/governance/contracts";

export function treeAtLevel(
  tree: GovernanceTree,
  level: string,
): GovernanceTree {
  if (level === "") return tree;
  const nodes = tree.nodes.filter((node) => node.level === level);
  const ids = new Set(nodes.map((node) => node.id));
  return {
    ...tree,
    nodes,
    edges: tree.edges.filter((edge) => ids.has(edge.from) && ids.has(edge.to)),
  };
}

/** Start at the selected place's populated scope, otherwise the first populated scope supplied by the API. */
export function initialTreeLevel(tree: GovernanceTree): string {
  const hasLeaders = (code: string): boolean =>
    tree.nodes.some((node) => node.type === "leader" && node.level === code);
  const selected = tree.place
    ? tree.rail.find(
        (level) =>
          level.unit?.featureId === tree.place?.featureId &&
          hasLeaders(level.code),
      )
    : undefined;
  return (
    selected?.code ??
    tree.rail.find((level) => hasLeaders(level.code))?.code ??
    ""
  );
}
