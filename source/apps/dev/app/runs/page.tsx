"use client";

/** Route `/runs`: every engine run, newest first, with its status, duration and a one-line summary of what it was given. */
import Link from "next/link";
import { useEffect, useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { ago, buttonPrimary, duration, Empty, StatusMark } from "#/components/portal/ui.tsx";
import { explore, type Job, type JsonValue } from "#/lib/portal/explore.ts";
import { useAsync } from "#/lib/portal/use-async.ts";
import { Icon } from "#/components/brand/icon.tsx";

const FILTERS = ["all", "running", "queued", "succeeded", "failed"] as const;

function summary(input: Record<string, JsonValue>): string {
  const hint = ["url", "endpoint", "path", "source", "query", "out_dir"].find(
    (key) => typeof input[key] === "string" && input[key] !== "",
  );
  return hint ? `${hint}: ${String(input[hint]).split("/").slice(-2).join("/")}` : "";
}

function Row({ job }: { job: Job }) {
  return (
    <Link
      href={`/runs/${job.id}`}
      className="flex items-center gap-4 border-b border-border-default px-4 py-3 last:border-0 hover:bg-surface-sunken/60"
    >
      <StatusMark status={job.status} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{job.kind}</p>
        <p className="truncate text-xs text-content-muted">
          <span className="font-mono">#{job.id.slice(0, 8)}</span>
          {summary(job.input) ? ` · ${summary(job.input)}` : ""}
          {job.attempts > 1 ? ` · attempt ${job.attempts}` : ""}
        </p>
      </div>
      <div className="text-right text-xs text-content-muted">
        <p>{duration(job.started_at, job.finished_at)}</p>
        <p>{ago(job.created_at)}</p>
      </div>
    </Link>
  );
}

export default function RunsRoute() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTick((value) => value + 1), 4000);
    return () => clearInterval(timer);
  }, []);
  const loaded = useAsync(() => explore.jobs(), `runs-${tick}`);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-border-default bg-surface-elevated p-1 text-sm">
          {FILTERS.map((name) => (
            <button
              key={name}
              onClick={() => setFilter(name)}
              className={`rounded-md px-3 py-1 capitalize ${filter === name ? "bg-clay text-cream" : "hover:bg-surface-sunken"}`}
            >
              {name}
            </button>
          ))}
        </div>
        <Link href="/runs/new" className={buttonPrimary}>
          <span className="inline-flex items-center gap-1.5"><Icon name="plus" size={16} />New run</span>
        </Link>
      </div>
      <AsyncView loaded={loaded}>
        {({ jobs }) => {
          const shown = jobs.filter((job) => filter === "all" || job.status === filter);
          return shown.length === 0 ? (
            <Empty title="No runs here" hint="Start one with “New run” — pick a capability and fill in its form." />
          ) : (
            <div className="overflow-hidden rounded-xl border border-border-default bg-surface-elevated">
              <p className="border-b border-border-default bg-surface-sunken px-4 py-2 text-xs text-content-muted">
                {shown.length} run{shown.length === 1 ? "" : "s"} · refreshes every few seconds
              </p>
              {shown.map((job) => (
                <Row key={job.id} job={job} />
              ))}
            </div>
          );
        }}
      </AsyncView>
    </div>
  );
}
