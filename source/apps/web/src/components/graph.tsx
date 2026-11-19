"use client";
/** Knowledge graph on WebGL (Sigma + graphology). Colours follow the active theme and update live. */
import Graph from "graphology";
import forceAtlas2 from "graphology-layout-forceatlas2";
import { useEffect, useRef, useState } from "react";
import Sigma from "sigma";
import { edges, nodes } from "#/data/fake";
import { readTokens } from "#/lib/palette";

const sizes = [13, 8, 10];
const kinds = ["Source", "Claim", "Place"];
const keys = ["c1", "c3", "c2"] as const;

export function KnowledgeGraph() {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    const graph = new Graph();
    nodes.forEach((n, i) => graph.addNode(n.id, { name: n.label, size: sizes[n.kind], x: Math.cos(i) * 10 + i, y: Math.sin(i * 1.7) * 10 }));
    edges.forEach(([a, b]) => graph.hasNode(a) && graph.hasNode(b) && !graph.hasEdge(a, b) && graph.addEdge(a, b, { size: 1.5 }));
    forceAtlas2.assign(graph, { iterations: 200, settings: { gravity: 1, scalingRatio: 12 } });

    const recolor = () => {
      const t = readTokens();
      nodes.forEach((n) => graph.setNodeAttribute(n.id, "color", t[keys[n.kind]]));
      graph.forEachEdge((e) => graph.setEdgeAttribute(e, "color", t.line));
      sigma?.refresh();
    };

    let sigma: Sigma | undefined;
    try {
      sigma = new Sigma(graph, ref.current!);
    } catch {
      setFailed(true); // no WebGL in this browser
      return;
    }
    recolor();
    sigma.on("enterNode", ({ node }) => {
      const p = sigma!.graphToViewport({ x: graph.getNodeAttribute(node, "x"), y: graph.getNodeAttribute(node, "y") });
      const kind = nodes.find((n) => n.id === node)!.kind;
      setTip({ x: p.x, y: p.y, text: `${kinds[kind]} · ${graph.getNodeAttribute(node, "label")}` });
    });
    sigma.on("leaveNode", () => setTip(null));

    const observer = new MutationObserver(recolor); // theme or palette changed
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-mode", "data-palette"] });
    return () => {
      observer.disconnect();
      sigma?.kill();
    };
  }, []);

  if (failed) return <div className="grid h-[320px] place-items-center rounded-lg bg-paper p-6 text-center text-sm text-muted">The evidence graph needs WebGL, which this browser does not provide.</div>;
  return (
    <div className="relative">
      <div ref={ref} className="h-[320px] w-full rounded-lg bg-paper" aria-label="Knowledge graph of sources, claims and places" />
      {tip && <div className="pointer-events-none absolute -translate-x-1/2 -translate-y-[170%] whitespace-nowrap rounded-full bg-ink px-3 py-1 text-xs text-paper" style={{ left: tip.x, top: tip.y }}>{tip.text}</div>}
      <div className="mt-3 flex gap-4 text-xs text-muted">
        {kinds.map((k, i) => (
          <span key={k} className="flex items-center gap-1.5"><span className="size-2.5 rounded-full" style={{ background: `var(--${keys[i]})` }} />{k}</span>
        ))}
      </div>
    </div>
  );
}
