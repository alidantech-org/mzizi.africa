"use client";

/** Route `/runs/<id>`: one run as a pipeline — stages, steps, input, result and the files it wrote. */
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import {
  bytes,
  button,
  Card,
  Crumbs,
  duration,
  filesLink,
  Grid,
  JsonTree,
  StatusBadge,
  StatusMark,
} from "#/components/portal/ui.tsx";
import { explore, type JobDetail, type JsonValue } from "#/lib/portal/explore.ts";
import { useAsync } from "#/lib/portal/use-async.ts";

interface Page {
  number: number;
  url: string;
  status: number;
  bytes: number;
  items: number;
  rows_with_errors: number;
}

function Stage({ label, at, state, last }: { label: string; at: string | null; state: string; last?: boolean }) {
  return (
    <div className="flex items-center">
      <div className="flex min-w-32 flex-col items-center gap-1 rounded-xl border border-border-default bg-surface-elevated px-4 py-3">
        <StatusMark status={state} />
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[11px] text-content-muted">{at ? new Date(at).toLocaleTimeString() : "—"}</p>
      </div>
      {last ? null : <div className="h-0.5 w-10 bg-border-default" />}
    </div>
  );
}

function Pipeline({ detail }: { detail: JobDetail }) {
  const { job } = detail;
  const finished = job.status === "succeeded" || job.status === "failed" || job.status === "cancelled";
  return (
    <div className="flex flex-wrap items-center gap-y-3">
      <Stage label="Queued" at={job.created_at} state="succeeded" />
      <Stage
        label="Running"
        at={job.started_at}
        state={job.started_at ? (finished ? "succeeded" : "running") : "queued"}
      />
      <Stage
        label={finished ? (job.status === "succeeded" ? "Succeeded" : job.status === "failed" ? "Failed" : "Cancelled") : "Finishing"}
        at={job.finished_at}
        state={finished ? job.status : "queued"}
        last
      />
    </div>
  );
}

function CollectPages({ result }: { result: Record<string, JsonValue> }) {
  const pages = (result.pages ?? []) as unknown as Page[];
  if (pages.length === 0) return null;
  return (
    <Card title={`Steps · ${pages.length} pages fetched`}>
      <ol className="max-h-96 space-y-1 overflow-auto">
        {pages.map((page) => (
          <li key={page.number} className="flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-surface-sunken/60">
            <StatusMark status={page.status === 200 && page.rows_with_errors === 0 ? "succeeded" : "failed"} size="sm" />
            <span className="w-16 text-content-muted">Page {page.number}</span>
            <span className="min-w-0 flex-1 truncate font-mono text-xs">{page.url}</span>
            <span className="text-xs text-content-muted">
              {page.items} items · {bytes(page.bytes)}
            </span>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default function RunDetailRoute() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [tick, setTick] = useState(0);
  const [failure, setFailure] = useState("");
  const loaded = useAsync(() => explore.job(id), `${id}-${tick}`);
  const active = loaded.state === "ready" && (loaded.value.job.status === "running" || loaded.value.job.status === "queued");
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setTick((value) => value + 1), 1500);
    return () => clearInterval(timer);
  }, [active]);

  async function again(detail: JobDetail): Promise<void> {
    try {
      const next = await explore.submit(detail.job.kind, detail.job.input);
      router.push(`/runs/${next.id}`);
    } catch (error) {
      setFailure(error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <AsyncView loaded={loaded}>
      {(detail) => {
        const { job } = detail;
        const result = job.result && typeof job.result === "object" && !Array.isArray(job.result) ? (job.result as Record<string, JsonValue>) : null;
        return (
          <div className="space-y-4">
            <Crumbs items={[{ href: "/runs", label: "Runs" }, { label: `#${job.id.slice(0, 8)}` }]} />
            <div className="flex flex-wrap items-center gap-4">
              <StatusMark status={job.status} size="lg" />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-2xl">{job.kind}</h2>
                <p className="text-sm text-content-muted">
                  <span className="font-mono">{job.id}</span> · took {duration(job.started_at, job.finished_at)} · attempt {job.attempts}/{job.max_attempts}
                </p>
              </div>
              <StatusBadge status={job.status} />
              {active ? (
                <button className={button} onClick={() => explore.cancel(job.id).then(() => setTick((v) => v + 1))}>
                  Cancel
                </button>
              ) : (
                <button className={button} onClick={() => again(detail)}>
                  ↻ Run again
                </button>
              )}
            </div>
            {failure ? <p className="text-sm text-danger">{failure}</p> : null}
            <Pipeline detail={detail} />
            {job.error ? (
              <Card title="Why it failed">
                <pre className="whitespace-pre-wrap font-mono text-xs text-danger">{job.error}</pre>
              </Card>
            ) : null}
            {result ? <CollectPages result={result} /> : null}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card title="Result">
                {job.result === null ? <p className="text-sm text-content-muted">No result yet.</p> : <JsonTree value={job.result} />}
              </Card>
              <Card title="Input">
                <JsonTree value={job.input} />
              </Card>
            </div>
            <Card title={`Output files${detail.output ? ` · ${detail.output.root}/${detail.output.path}` : ""}`}>
              {detail.output ? (
                <>
                  <Grid
                    header={["name", "kind", "size", "modified"]}
                    rows={detail.output.entries.map((e) => [e.directory ? `${e.name}/` : e.name, e.kind, e.directory ? "" : bytes(e.size), e.modified])}
                  />
                  <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                    {detail.output.entries.map((entry) => (
                      <li key={entry.path}>
                        <Link href={filesLink(detail.output!.root, entry.path)} className="rounded-lg border border-border-default px-2.5 py-1 hover:bg-surface-sunken">
                          {entry.directory ? "📁" : "📄"} {entry.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-sm text-content-muted">This run did not name an output folder under a known root.</p>
              )}
            </Card>
            <Card title={`Timeline · ${detail.events.length} events`}>
              <ol className="space-y-2">
                {detail.events.map((event) => (
                  <li key={event.seq} className="flex gap-3 text-sm">
                    <span className="w-20 shrink-0 font-mono text-xs text-content-muted">{new Date(event.created_at).toLocaleTimeString()}</span>
                    <span className="font-medium">{event.kind}</span>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        );
      }}
    </AsyncView>
  );
}
