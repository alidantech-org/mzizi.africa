"use client";

/** Small shared pieces of the portal: status marks, cards, paging, a JSON tree and byte/time formatting. */
import Link from "next/link";
import type { ReactNode } from "react";

import type { JsonValue } from "#/lib/portal/explore.ts";

const STATUS: Record<string, { tone: string; mark: string }> = {
  queued: { tone: "text-calabash border-calabash/50", mark: "◔" },
  running: { tone: "text-link border-link/50", mark: "◐" },
  succeeded: { tone: "text-raffia border-raffia/50", mark: "✔" },
  failed: { tone: "text-danger border-danger/50", mark: "✖" },
  cancelled: { tone: "text-content-muted border-border-default", mark: "⊘" },
};

/** A round status mark, like the one beside a workflow run. */
export function StatusMark({ status, size = "md" }: { status: string; size?: "sm" | "md" | "lg" }) {
  const look = STATUS[status] ?? STATUS.cancelled;
  const box = size === "lg" ? "h-9 w-9 text-lg" : size === "sm" ? "h-5 w-5 text-[10px]" : "h-7 w-7 text-sm";
  return (
    <span
      title={status}
      className={`inline-grid shrink-0 place-items-center rounded-full border-2 bg-surface-elevated ${box} ${look.tone} ${status === "running" ? "animate-pulse" : ""}`}
    >
      {look.mark}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const look = STATUS[status] ?? STATUS.cancelled;
  return (
    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${look.tone}`}>
      {status}
    </span>
  );
}

export function Card({
  title,
  action,
  children,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-xl border border-border-default bg-surface-elevated">
      {title ? (
        <header className="flex items-center justify-between gap-3 border-b border-border-default px-4 py-2.5">
          <h2 className="font-display text-base">{title}</h2>
          {action}
        </header>
      ) : null}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function Empty({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border-default p-10 text-center">
      <p className="font-display text-lg">{title}</p>
      {hint ? <p className="mt-1 text-sm text-content-muted">{hint}</p> : null}
    </div>
  );
}

export const button =
  "rounded-lg border border-border-default bg-surface-elevated px-3 py-1.5 text-sm transition hover:bg-surface-sunken disabled:opacity-40";
export const buttonPrimary =
  "rounded-lg bg-clay px-3.5 py-1.5 text-sm font-medium text-cream transition hover:opacity-90 disabled:opacity-40";
export const field =
  "w-full rounded-lg border border-border-default bg-surface-background px-3 py-1.5 text-sm outline-none focus:border-clay";

export function Pager({
  offset,
  limit,
  total,
  onChange,
}: {
  offset: number;
  limit: number;
  total: number;
  onChange: (offset: number) => void;
}) {
  const last = Math.max(0, Math.floor((total - 1) / limit) * limit);
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-content-muted">
      <span>
        {total === 0 ? "No rows" : `${offset + 1}–${Math.min(offset + limit, total)} of ${total.toLocaleString()}`}
      </span>
      <span className="flex gap-1.5">
        <button className={button} disabled={offset === 0} onClick={() => onChange(0)}>
          «
        </button>
        <button className={button} disabled={offset === 0} onClick={() => onChange(Math.max(0, offset - limit))}>
          ‹ Prev
        </button>
        <button className={button} disabled={offset >= last} onClick={() => onChange(offset + limit)}>
          Next ›
        </button>
        <button className={button} disabled={offset >= last} onClick={() => onChange(last)}>
          »
        </button>
      </span>
    </div>
  );
}

/** A scrollable data grid; cells stay on one line and long values are cut with the full text in the tooltip. */
export function Grid({
  header,
  rows,
  caption,
}: {
  header: readonly string[];
  rows: readonly (readonly (string | number | boolean | null)[])[];
  caption?: string;
}) {
  return (
    <div className="overflow-auto rounded-lg border border-border-default">
      <table className="w-full text-left text-xs">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="sticky top-0 bg-surface-sunken text-[11px] uppercase tracking-wide text-content-muted">
          <tr>
            {header.map((name) => (
              <th key={name} className="whitespace-nowrap px-3 py-2">
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-surface-sunken/60">
              {row.map((cell, column) => (
                <td key={column} className="max-w-[28rem] truncate px-3 py-1.5 font-mono" title={String(cell ?? "")}>
                  {cell === null ? <span className="text-content-muted">∅</span> : String(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A collapsible view of any JSON value. */
export function JsonTree({ value, depth = 0 }: { value: JsonValue; depth?: number }) {
  if (value === null || typeof value !== "object") {
    const text = typeof value === "string" ? `"${value}"` : String(value);
    return (
      <span className={typeof value === "string" ? "text-raffia" : "text-link"}>
        {text.length > 400 ? `${text.slice(0, 400)}…` : text}
      </span>
    );
  }
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);
  if (entries.length === 0) return <span className="text-content-muted">{Array.isArray(value) ? "[]" : "{}"}</span>;
  return (
    <details open={depth < 1} className="font-mono text-xs">
      <summary className="cursor-pointer select-none text-content-muted">
        {Array.isArray(value) ? `[${entries.length}]` : `{${entries.length}}`}
      </summary>
      <ul className="ml-3 border-l border-border-default pl-3">
        {entries.slice(0, 200).map(([key, item]) => (
          <li key={key} className="py-0.5">
            <span className="text-content-muted">{key}: </span>
            <JsonTree value={item as JsonValue} depth={depth + 1} />
          </li>
        ))}
        {entries.length > 200 ? <li className="text-content-muted">… {entries.length - 200} more</li> : null}
      </ul>
    </details>
  );
}

export const bytes = (size: number): string =>
  size < 1024 ? `${size} B` : size < 1048576 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1048576).toFixed(1)} MB`;

export function duration(start: string | null, end: string | null): string {
  if (!start) return "—";
  const seconds = Math.max(0, ((end ? Date.parse(end) : Date.now()) - Date.parse(start)) / 1000);
  if (seconds < 1) return `${Math.round(seconds * 1000)} ms`;
  if (seconds < 90) return `${seconds.toFixed(1)} s`;
  return `${Math.floor(seconds / 60)} m ${Math.round(seconds % 60)} s`;
}

export const ago = (iso: string): string => {
  const seconds = (Date.now() - Date.parse(iso)) / 1000;
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`;
  return new Date(iso).toLocaleDateString();
};

export const filesLink = (root: string, path: string): string =>
  `/files?root=${encodeURIComponent(root)}&path=${encodeURIComponent(path)}`;

export function Crumbs({ items }: { items: readonly { href?: string; label: string }[] }) {
  return (
    <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-content-muted">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-1.5">
          {index > 0 ? <span>/</span> : null}
          {item.href ? (
            <Link href={item.href} className="hover:text-content-primary hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-content-primary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
