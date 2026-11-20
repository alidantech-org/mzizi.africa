"use client";
/** Opens a source file we hold: PDF, Word, CSV, Excel, JSON or GeoJSON, without leaving the page. */
import { Search } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import type { SourceFile } from "#demo/_data/sources";
import { TextField } from "#demo/_components/ui/controls";

type Table = { head: string[]; rows: string[][]; total: number };

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') ((field += '"'), i++);
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") (row.push(field), (field = ""));
    else if (c === "\n") (row.push(field), rows.push(row), (row = []), (field = ""));
    else if (c !== "\r") field += c;
  }
  if (field || row.length) (row.push(field), rows.push(row));
  return rows;
}

const toTable = (rows: string[][]): Table => ({
  head: rows[0] ?? [],
  rows: rows.slice(1, 501),
  total: Math.max(0, rows.length - 1),
});

const isNum = (v: string) => v !== "" && /^-?\d+(\.\d+)?$/.test(v.trim());

function TableView({ t }: { t: Table }) {
  const [q, setQ] = useState("");
  const numeric = t.head.map(
    (_, c) => t.rows.length > 0 && t.rows.every((r) => r[c] === "" || r[c] === undefined || isNum(r[c])),
  );
  const rows = q ? t.rows.filter((r) => r.some((c) => c.toLowerCase().includes(q.toLowerCase()))) : t.rows;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-3 py-2 text-xs text-muted">
        <TextField
          label="Filter rows"
          value={q}
          onChange={setQ}
          placeholder="Filter rows"
          icon={<Search size={14} />}
          size="sm"
          className="w-52"
        />
        <span className="font-mono">
          {rows.length.toLocaleString("en")} of {t.total.toLocaleString("en")} rows · {t.head.length} columns
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-full border-separate border-spacing-0 text-left text-xs">
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky top-0 z-10 w-10 border-b border-line bg-surface px-2 py-2 text-right font-mono text-[10px] text-muted"
              >
                #
              </th>
              {t.head.map((h, i) => (
                <th
                  key={i}
                  scope="col"
                  className={`sticky top-0 z-10 border-b border-line bg-surface px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-accent ${numeric[i] ? "text-right" : ""}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="odd:bg-paper/60 hover:bg-accent-soft">
                <td className="border-b border-line/50 px-2 py-1.5 text-right font-mono text-[10px] text-muted">{i + 1}</td>
                {t.head.map((_, j) => {
                  const c = r[j] ?? "";
                  return (
                    <td
                      key={j}
                      title={c}
                      className={`max-w-[280px] truncate border-b border-line/50 px-3 py-1.5 ${numeric[j] ? "text-right font-mono tabular-nums text-c3" : ""} ${!numeric[j] && j === 0 ? "font-medium" : ""}`}
                    >
                      {numeric[j] && c ? Number(c).toLocaleString("en", { useGrouping: !/^(19|20)\d\d$/.test(c) }) : c}
                    </td>
                  );
                })}
              </tr>
            ))}
            {!rows.length && (
              <tr>
                <td colSpan={t.head.length + 1} className="px-3 py-6 text-center text-muted">
                  No rows match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {t.total > t.rows.length && (
          <p className="p-3 text-xs text-muted">
            Showing the first {t.rows.length} of {t.total} rows. Download the file for the rest.
          </p>
        )}
      </div>
    </div>
  );
}

const TOKEN = /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\[\],:]/g;
/** Pretty JSON: keys, strings, numbers and literals each get their own colour; a line-number gutter helps to point at things. */
function JsonView({ text, note }: { text: string; note?: string }) {
  const lines = text.split("\n");
  const tint = (line: string) => {
    const out: ReactNode[] = [];
    let last = 0;
    let k = 0;
    for (const m of line.matchAll(TOKEN)) {
      if (m.index > last) out.push(line.slice(last, m.index));
      const cls = m[1] ? (m[2] ? "text-accent" : "text-c2") : m[3] ? "text-c4" : /^-?\d/.test(m[0]) ? "text-c3" : "text-muted";
      out.push(
        <span key={k++} className={cls}>
          {m[1] && m[2] ? m[1] : m[0].replace(/\s*:$/, "")}
        </span>,
      );
      if (m[1] && m[2])
        out.push(
          <span key={k++} className="text-muted">
            :
          </span>,
        );
      last = m.index + m[0].length;
    }
    out.push(line.slice(last));
    return out;
  };
  return (
    <div className="font-mono text-[11.5px] leading-[1.65]">
      <div className="overflow-auto py-3">
        {lines.map((l, i) => (
          <div key={i} className="flex whitespace-pre hover:bg-accent-soft">
            <span className="w-12 shrink-0 select-none pr-3 text-right text-muted/60">{i + 1}</span>
            <code>{tint(l)}</code>
          </div>
        ))}
      </div>
      {note && <p className="border-t border-line px-4 py-2 font-sans text-xs text-muted">{note}</p>}
    </div>
  );
}

export function FileViewer({ file }: { file: SourceFile }) {
  const [state, setState] = useState<
    | { status: "loading" }
    | { status: "error"; message: string }
    | { status: "table"; t: Table }
    | { status: "html"; html: string }
    | { status: "text"; text: string; note?: string; json?: boolean }
  >({ status: "loading" });

  useEffect(() => {
    let live = true;
    const done = (s: typeof state) => live && setState(s);
    setState({ status: "loading" });
    (async () => {
      try {
        if (file.kind === "pdf") return done({ status: "text", text: "" });
        const res = await fetch(file.url);
        if (!res.ok) throw new Error(`The file could not be loaded (${res.status}). It may have been moved or removed.`);
        if (file.kind === "csv") return done({ status: "table", t: toTable(parseCsv(await res.text())) });
        if (file.kind === "xlsx") {
          const { default: readXlsx } = await import("read-excel-file/browser");
          const sheets = await readXlsx(await res.blob());
          const rows = (sheets[0]?.data ?? []).map((r) => r.map((c) => String(c ?? "")));
          return done({ status: "table", t: toTable(rows) });
        }
        if (file.kind === "docx") {
          const { default: mammoth } = await import("mammoth/mammoth.browser.js");
          const out = await mammoth.convertToHtml({ arrayBuffer: await res.arrayBuffer() });
          return done({ status: "html", html: out.value });
        }
        if (file.kind === "json" || file.kind === "geojson") {
          const pretty = JSON.stringify(JSON.parse(await res.text()), null, 2);
          const lines = pretty.split("\n");
          return done({
            status: "text",
            json: true,
            text: lines.slice(0, 400).join("\n"),
            note: lines.length > 400 ? `Showing the first 400 of ${lines.length} lines.` : undefined,
          });
        }
        done({ status: "text", text: await res.text() });
      } catch (e) {
        done({ status: "error", message: e instanceof Error ? e.message : "The file could not be opened." });
      }
    })();
    return () => {
      live = false;
    };
  }, [file]);

  if (file.kind === "pdf") return <iframe src={file.url} title={file.label} className="h-full min-h-[60vh] w-full bg-paper" />;
  if (state.status === "loading")
    return (
      <p className="p-5 text-sm text-muted" role="status">
        Opening {file.label}…
      </p>
    );
  if (state.status === "error")
    return (
      <p role="alert" className="p-5 text-sm text-c1">
        {state.message}
      </p>
    );
  if (state.status === "table") return <TableView t={state.t} />;
  if (state.status === "html")
    return (
      <article
        className="prose-doc space-y-3 p-5 text-sm leading-relaxed [&_h1]:font-display [&_h1]:text-2xl [&_h2]:mt-4 [&_h2]:font-display [&_h2]:text-lg [&_h3]:font-medium"
        dangerouslySetInnerHTML={{ __html: state.html }}
      />
    );
  if (state.json) return <JsonView text={state.text} note={state.note} />;
  return (
    <div>
      <pre className="overflow-auto p-4 font-mono text-[11px] leading-relaxed">{state.text}</pre>
      {state.note && <p className="px-4 pb-4 text-xs text-muted">{state.note}</p>}
    </div>
  );
}
