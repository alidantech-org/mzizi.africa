"use client";

/** Route `/job-list`. Scaffolded by Dryv once; this file belongs to the app. */
import { AsyncView } from "#/components/portal/async-view.tsx";
import { jobs } from "#/lib/portal/engine.ts";
import { useAsync } from "#/lib/portal/use-async.ts";

const TONE: Record<string, string> = {
  queued: "bg-calabash/20 text-calabash",
  running: "bg-link/20 text-link",
  succeeded: "bg-raffia/20 text-raffia",
  failed: "bg-danger/20 text-danger",
  cancelled: "bg-surface-sunken text-content-muted",
};

export default function JobListRoute() {
  const loaded = useAsync(jobs, "jobs");
  return (
    <AsyncView loaded={loaded}>
      {(list) =>
        list.jobs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border-default p-10 text-center">
            <p className="font-display text-lg">No jobs yet</p>
            <p className="mt-1 text-sm text-content-muted">
              Submitted engine jobs appear here with their status and result.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border-default bg-surface-elevated">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-sunken text-xs uppercase tracking-wide text-content-muted">
                <tr>
                  <th className="px-4 py-2">Job</th>
                  <th className="px-4 py-2">Kind</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Attempts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {list.jobs.map((job) => (
                  <tr key={job.id}>
                    <td className="px-4 py-2.5 font-mono text-xs">{job.id}</td>
                    <td className="px-4 py-2.5">{job.kind}</td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${TONE[job.status] ?? ""}`}
                      >
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{job.attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      }
    </AsyncView>
  );
}
