"use client";

/** A connected, collapsible graph built exclusively from API nodes, edges, categories and scope labels. */
import Link from "next/link";
import { leaderAt } from "#/lib/site/links.ts";
import { useEffect, useRef, useState } from "react";
import {
  Empty,
} from "#/components/site/governance/shared.tsx";
import { Avatar } from "#/components/site/ui/media.tsx";
import { Gaps } from "#/components/site/ui/primitives.tsx";
import type {
  GovernanceTree,
  TreeNode,
} from "#/lib/site/governance/contracts.ts";
import {
  initialTreeLevel,
  treeAtLevel,
} from "#/lib/site/governance/tree-view.ts";

function Branch({
  node,
  document,
  depth,
  trail,
  scope,
  inspect,
}: {
  node: TreeNode;
  document: GovernanceTree;
  depth: number;
  trail: readonly string[];
  scope: string;
  inspect: (node: TreeNode) => void;
}) {
  const [open, setOpen] = useState(depth < 3);
  const children = document.edges
    .filter((e) => e.from === node.id)
    .flatMap((edge) => {
      const child = document.nodes.find((n) => n.id === edge.to);
      return child && !trail.includes(child.id) ? [{ node: child, edge }] : [];
    });
  const dimmed = scope !== "" && node.level !== scope;
  return (
    <li className="mz-tree-branch">
      <div className="mz-tree-node" style={{ opacity: dimmed ? 0.3 : 1 }}>
        <button
          type="button"
          onClick={() => inspect(node)}
          className="block w-full rounded-2xl p-4 text-left focus-visible:outline-2 focus-visible:outline-clay"
          title={
            node.type === "leader"
              ? `${node.tier.label} · ${node.how.label}`
              : node.type === "body"
                ? (node.purpose ?? node.name)
                : node.name
          }
        >
          <span className="flex items-center gap-3">
            {node.type === "leader" ? (
              <Avatar name={node.name} src={node.photo} size={40} />
            ) : (
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface-sunken text-xl text-clay"
              >
                {node.type === "body" ? "▥" : "◇"}
              </span>
            )}
            <span className="min-w-0">
              <strong className="block text-sm leading-snug">
                {node.name}
              </strong>
              <span className="mt-1 block text-xs text-content-muted">
                {node.type === "leader"
                  ? node.tier.label
                  : node.type === "body"
                    ? node.kind
                    : ""}
              </span>
            </span>
          </span>
          {node.type === "leader" ? (
            <>
              <span className="mt-3 block text-xs text-content-muted">
                {node.how.label}
                {node.unit ? ` · ${node.unit.name}` : ""}
              </span>
              {node.performance ? (
                <span className="mt-2 block">
                  <span className="flex justify-between gap-2 text-xs">
                    <span>{node.performance.score}%</span>
                    <span>
                      #{node.performance.rank} / {node.performance.of}
                    </span>
                  </span>
                  <progress
                    aria-label={node.performance.text}
                    className="mt-1 h-1.5 w-full accent-[var(--clay)]"
                    max={100}
                    value={node.performance.score}
                  />
                  <span className="mt-1 block text-[11px] text-content-muted">
                    {node.performance.text}
                  </span>
                </span>
              ) : (
                <span className="mt-2 block text-xs text-content-muted">
                  Performance not recorded
                </span>
              )}
            </>
          ) : null}
        </button>
        {children.length > 0 ? (
          <button
            type="button"
            className="w-full rounded-b-2xl border-t border-[var(--border-default)] px-3 py-2 text-xs font-semibold text-clay"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? "− Collapse" : `+ Show ${children.length} connections`}
          </button>
        ) : null}
      </div>
      {open && children.length > 0 ? (
        <ul className="mz-tree-children">
          {children.map(({ node: child, edge }) => (
            <li key={child.id} className="mz-tree-edge">
              <span className="mz-tree-relation">
                {document.legend.find((l) => l.code === edge.kind)?.label ??
                  edge.kind}
              </span>
              <ul>
                <Branch
                  node={child}
                  document={document}
                  depth={depth + 1}
                  trail={[...trail, child.id]}
                  scope={scope}
                  inspect={inspect}
                />
              </ul>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}
export function GovernanceGraph({ document }: { document: GovernanceTree }) {
  const [scope, setScope] = useState(() => initialTreeLevel(document));
  const [selected, setSelected] = useState<TreeNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [viewKey, setViewKey] = useState(0);
  const canvas = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const details = useRef<HTMLElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    left: number;
    top: number;
  } | null>(null);
  const view = treeAtLevel(document, scope);
  const targets = new Set(view.edges.map((e) => e.to));
  const roots = view.nodes.filter((n) => !targets.has(n.id));
  useEffect(() => {
    if (selected)
      details.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "nearest",
      });
  }, [selected]);
  const reset = () => {
    setZoom(1);
    setViewKey((key) => key + 1);
    canvas.current?.scrollTo({ left: 0, top: 0 });
  };
  const fit = () => {
    if (canvas.current && scene.current) {
      setZoom(
        Math.max(
          0.2,
          Math.min(
            1,
            (canvas.current.clientWidth - 32) / scene.current.offsetWidth,
          ),
        ),
      );
      canvas.current.scrollTo({ left: 0, top: 0 });
    }
  };

  return (
    <>
      <div className="mt-6">
        <div className="min-w-0">
          <p className="mb-3 text-xs text-content-muted">
            Drag the canvas or scroll to explore. Select a node for its purpose
            and record; expand branches to see more. Current officeholders are
            supplied by the backend.
          </p>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-content-muted">
              {view.nodes.filter((node) => node.type === "leader").length}{" "}
              current leaders · {view.nodes.length} visible nodes
            </span>
            <div
              className="flex flex-wrap items-center gap-1"
              role="group"
              aria-label="Tree view controls"
            >
              <button
                className="btn btn-ghost"
                aria-label="Zoom out"
                onClick={() => setZoom((value) => Math.max(0.2, value - 0.15))}
              >
                −
              </button>
              <output
                className="min-w-12 text-center text-xs"
                aria-label="Zoom level"
              >
                {Math.round(zoom * 100)}%
              </output>
              <button
                className="btn btn-ghost"
                aria-label="Zoom in"
                onClick={() => setZoom((value) => Math.min(2, value + 0.15))}
              >
                +
              </button>
              <button className="btn btn-ghost" onClick={fit}>
                Fit
              </button>
              <button className="btn btn-ghost" onClick={reset}>
                Reset
              </button>
            </div>
          </div>
          {roots.length === 0 ? (
            <Empty title="No leadership tree is recorded for this view">
              Choose another category, institution or place.
            </Empty>
          ) : (
            <div
              className="mz-tree-canvas"
              ref={canvas}
              onPointerDown={(event) => {
                if ((event.target as HTMLElement).closest("button,a")) return;
                const element = event.currentTarget;
                drag.current = {
                  x: event.clientX,
                  y: event.clientY,
                  left: element.scrollLeft,
                  top: element.scrollTop,
                };
                element.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                if (!drag.current) return;
                event.currentTarget.scrollLeft =
                  drag.current.left - event.clientX + drag.current.x;
                event.currentTarget.scrollTop =
                  drag.current.top - event.clientY + drag.current.y;
              }}
              onPointerUp={(event) => {
                drag.current = null;
                if (event.currentTarget.hasPointerCapture(event.pointerId))
                  event.currentTarget.releasePointerCapture(event.pointerId);
              }}
              onLostPointerCapture={() => {
                drag.current = null;
              }}
              onKeyDown={(event) => {
                const step = 80;
                if (event.key === "+" || event.key === "=") {
                  event.preventDefault();
                  setZoom((value) => Math.min(2, value + 0.15));
                } else if (event.key === "-") {
                  event.preventDefault();
                  setZoom((value) => Math.max(0.2, value - 0.15));
                } else if (event.key === "0") {
                  event.preventDefault();
                  reset();
                } else if (event.key.startsWith("Arrow")) {
                  event.preventDefault();
                  event.currentTarget.scrollBy({
                    left:
                      event.key === "ArrowLeft"
                        ? -step
                        : event.key === "ArrowRight"
                          ? step
                          : 0,
                    top:
                      event.key === "ArrowUp"
                        ? -step
                        : event.key === "ArrowDown"
                          ? step
                          : 0,
                  });
                }
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
              tabIndex={0}
              aria-label="Scrollable leadership relationship tree"
            >
              <div
                ref={scene}
                style={{ zoom, width: "max-content", minWidth: "100%" }}
              >
                <ul className="mz-tree-roots" key={`${scope}:${viewKey}`}>
                  {roots.map((root) => (
                    <Branch
                      key={root.id}
                      node={root}
                      document={view}
                      depth={0}
                      trail={[root.id]}
                      scope=""
                      inspect={setSelected}
                    />
                  ))}
                </ul>
              </div>
            </div>
          )}
          <nav
            aria-label="Filter leadership by level"
            className="mz-tree-levels mt-3 rounded-2xl border border-[var(--border-default)] bg-surface-elevated p-2"
          >
            <p className="px-2 pb-1 text-xs font-semibold text-content-muted">
              View level
            </p>
            <div className="flex gap-2 overflow-x-auto">
              <button
                className="tab shrink-0"
                data-active={!scope}
                aria-pressed={!scope}
                onClick={() => {
                  setScope("");
                  setSelected(null);
                  setZoom(1);
                }}
              >
                All levels
              </button>
              {document.rail.map((level) => (
                <button
                  key={level.code}
                  className="tab shrink-0"
                  aria-pressed={scope === level.code}
                  data-active={scope === level.code}
                  title={level.about ?? undefined}
                  onClick={() => {
                    setScope(level.code);
                    setSelected(null);
                    setZoom(1);
                  }}
                >
                  <span className="block">{level.label}</span>
                  <span className="block text-xs font-normal text-content-muted">
                    {level.unit?.name ?? `${level.count} leaders`}
                  </span>
                </button>
              ))}
            </div>
            {scope ? (
              <p className="px-2 pt-2 text-xs text-content-muted">
                {document.rail.find((level) => level.code === scope)?.about}{" "}
                Only this level is shown. Connections to hidden levels are
                omitted.
              </p>
            ) : null}
          </nav>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-content-muted">
            {document.legend.map((l) => (
              <span key={l.code}>↳ {l.label}</span>
            ))}
          </div>
        </div>
      </div>
      {selected ? (
        <section
          ref={details}
          className="glass card mt-6 scroll-mt-24"
          aria-label="Selected node details"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="kicker">Selected connection</p>
              <h3 className="mt-1 font-display text-2xl">{selected.name}</h3>
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => setSelected(null)}
              aria-label="Close node details"
            >
              ×
            </button>
          </div>
          {selected.type === "leader" ? (
            <>
              <p className="mt-3 text-content-muted">
                {selected.tier.label} · {selected.how.label}
                {selected.unit ? ` · ${selected.unit.name}` : ""}
              </p>
              <p className="mt-2 text-sm">
                {selected.performance?.text ??
                  "No recorded votes or projects are available to calculate a measure for this role."}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={leaderAt(selected)}
                  className="btn btn-primary"
                >
                  Open leader record →
                </Link>
                <Link
                  href={`/government/institutions/${encodeURIComponent(selected.body.code)}`}
                  className="btn btn-ghost"
                >
                  {selected.body.name} →
                </Link>
              </div>
              <p className="mt-4 text-sm text-content-muted">Open the record to inspect its recorded legal basis and evidence.</p>
            </>
          ) : selected.type === "body" ? (
            <>
              <p className="mt-3 text-content-muted">
                {selected.purpose ?? "Purpose not recorded."}
              </p>
              <p className="mt-2 text-sm">
                {selected.arm} ·{" "}
                {selected.basis ?? "Establishment basis not recorded"}
              </p>
              <Link
                className="btn btn-primary mt-4"
                href={`/government/institutions/${encodeURIComponent(selected.code)}`}
              >
                Explore institution →
              </Link>
            </>
          ) : null}
          <details className="mt-5 text-xs text-content-muted">
            <summary className="cursor-pointer">
              Reference values behind this node
            </summary>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
              {Object.entries(selected.refs)
                .filter(([, value]) => value !== null)
                .map(([name, value]) => (
                  <div key={name} className="contents">
                    <dt>{name}</dt>
                    <dd className="break-all">{value}</dd>
                  </div>
                ))}
            </dl>
          </details>
        </section>
      ) : null}
      <Gaps items={document.gaps} topic="Leadership tree" />
    </>
  );
}
