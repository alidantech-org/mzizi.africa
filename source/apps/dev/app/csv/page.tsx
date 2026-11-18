"use client";

/** Route `/csv`: prepare a CSV — choose, rename and clean columns, see the result live, then save a cleaned copy. */
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { button, buttonPrimary, Card, Crumbs, field, filesLink, Grid } from "#/components/portal/ui.tsx";
import { explore, type PrepareResult } from "#/lib/portal/explore.ts";
import { useAsync } from "#/lib/portal/use-async.ts";

const CLEAN: readonly { value: string; label: string }[] = [
  { value: "trim", label: "Trim spaces" },
  { value: "collapse_whitespace", label: "Collapse spaces" },
  { value: "upper", label: "UPPER CASE" },
  { value: "lower", label: "lower case" },
  { value: "normalise_name", label: "Tidy a name" },
  { value: "nfc", label: "Normalise accents" },
];

interface Plan {
  source: string;
  name: string;
  keep: boolean;
  clean: string[];
}

function Pane({ root, path, header }: { root: string; path: string; header: readonly string[] }) {
  const [plan, setPlan] = useState<Plan[]>(() => header.map((source) => ({ source, name: source, keep: true, clean: ["trim"] })));
  const [skip, setSkip] = useState(true);
  const [saveAs, setSaveAs] = useState(`${path.split("/").pop()?.replace(/\.csv$/, "") ?? "prepared"}-clean.csv`);
  const [result, setResult] = useState<PrepareResult | null>(null);
  const [message, setMessage] = useState("");
  const body = (save: string) => ({
    root,
    path,
    columns: plan.map((p) => ({ ...p, name: p.name === p.source ? "" : p.name })),
    skip_empty_rows: skip,
    save_as: save,
  });
  useEffect(() => {
    const timer = setTimeout(() => {
      explore.prepare(body("")).then((r) => { setResult(r); setMessage(""); }, (e: Error) => setMessage(e.message));
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, skip]);
  const update = (index: number, change: Partial<Plan>) => setPlan((current) => current.map((p, i) => (i === index ? { ...p, ...change } : p)));
  async function save(): Promise<void> {
    try {
      const saved = await explore.prepare(body(saveAs));
      setResult(saved);
      setMessage(`Saved ${saved.total_rows} rows to dev/${saved.saved}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : String(error));
    }
  }
  return (
    <div className="grid min-w-0 gap-4 xl:grid-cols-[28rem_minmax(0,1fr)]">
      <Card title="Columns">
        <ul className="max-h-[34rem] space-y-2 overflow-auto">
          {plan.map((column, index) => (
            <li key={column.source} className={`rounded-lg border border-border-default p-2 ${column.keep ? "" : "opacity-50"}`}>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={column.keep} onChange={(e) => update(index, { keep: e.target.checked })} aria-label={`Keep ${column.source}`} />
                <span className="w-32 truncate font-mono text-xs text-content-muted" title={column.source}>{column.source}</span>
                <span>→</span>
                <input className={field} value={column.name} onChange={(e) => update(index, { name: e.target.value })} />
              </div>
              {column.keep ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {CLEAN.map((step) => {
                    const on = column.clean.includes(step.value);
                    return (
                      <button
                        key={step.value}
                        onClick={() => update(index, { clean: on ? column.clean.filter((c) => c !== step.value) : [...column.clean, step.value] })}
                        className={`rounded-full border px-2 py-0.5 text-[11px] ${on ? "border-clay bg-clay text-cream" : "border-border-default hover:bg-surface-sunken"}`}
                      >
                        {step.label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
        <label className="mt-3 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={skip} onChange={(e) => setSkip(e.target.checked)} /> Skip empty rows
        </label>
      </Card>
      <Card
        title={result ? `Preview · ${result.total_rows} rows${result.dropped_rows ? ` (${result.dropped_rows} empty skipped)` : ""}` : "Preview"}
        action={
          <div className="flex items-center gap-2">
            <input className={`${field} w-56`} value={saveAs} onChange={(e) => setSaveAs(e.target.value)} aria-label="Saved file name" />
            <button className={buttonPrimary} onClick={save}>Save copy</button>
          </div>
        }
      >
        {message ? <p className="mb-2 text-sm text-content-muted">{message}</p> : null}
        {result ? <Grid header={result.header} rows={result.rows} /> : null}
        {result?.problems.length ? (
          <ul className="mt-3 list-disc pl-5 text-xs text-danger">
            {result.problems.slice(0, 8).map((problem) => <li key={problem}>{problem}</li>)}
          </ul>
        ) : null}
        {result?.saved ? <a className={`${button} mt-3 inline-block`} href={filesLink("dev", result.saved)}>Open saved file</a> : null}
      </Card>
    </div>
  );
}

function Prepare() {
  const params = useSearchParams();
  const root = params.get("root") ?? "";
  const path = params.get("path") ?? "";
  const file = useAsync(() => (root && path ? explore.file(root, path, 0, 1) : Promise.reject(new Error("Open a CSV from the file browser and choose “Prepare this CSV”."))), `${root}|${path}`);
  return (
    <div className="space-y-4">
      <Crumbs items={[{ href: "/files", label: "Files" }, { label: "Prepare CSV" }, { label: path || "no file chosen" }]} />
      <AsyncView loaded={file}>
        {(view) => <Pane key={`${root}|${path}`} root={root} path={path} header={view.header} />}
      </AsyncView>
    </div>
  );
}

export default function CsvRoute() {
  return (
    <Suspense>
      <Prepare />
    </Suspense>
  );
}
