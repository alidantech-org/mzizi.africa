"use client";

/** Overview at `/`. Scaffolded by Dryv once; this file belongs to the app. */
import Link from "next/link";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { health } from "#/lib/portal/engine.ts";
import { useAsync } from "#/lib/portal/use-async.ts";
import { routes } from "#/lib/dryv/routes.ts";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="reveal rounded-xl border border-border-default bg-surface-elevated p-5 shadow-[var(--shadow)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-content-muted">{label}</p>
      <p className="mt-1 font-display text-3xl">{value}</p>
    </div>
  );
}

export default function OverviewPage() {
  const loaded = useAsync(health, "health");
  return (
    <div className="space-y-8">
      <AsyncView loaded={loaded}>
        {(engine) => (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="Status" value={engine.status} />
              <Stat label="Version" value={engine.version} />
              <Stat label="Capabilities" value={engine.capabilities} />
              <Stat label="Active jobs" value={engine.active_jobs} />
            </div>
            <section>
              <h2 className="mb-3 text-lg">Runtime</h2>
              <dl className="grid gap-3 rounded-xl border border-border-default bg-surface-elevated p-5 text-sm sm:grid-cols-3">
                <div>
                  <dt className="text-content-muted">Service</dt>
                  <dd>{engine.service}</dd>
                </div>
                <div>
                  <dt className="text-content-muted">Object store</dt>
                  <dd>{engine.store}</dd>
                </div>
                <div>
                  <dt className="text-content-muted">Authentication</dt>
                  <dd>{engine.auth}</dd>
                </div>
              </dl>
            </section>
            <section>
              <h2 className="mb-3 text-lg">Packages</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {engine.packages.map((pkg) => (
                  <li
                    key={pkg.name}
                    className="flex items-center justify-between rounded-xl border border-border-default bg-surface-elevated px-5 py-4"
                  >
                    <div>
                      <p className="font-medium">{pkg.name}</p>
                      <p className="text-xs text-content-muted">{pkg.exposure}</p>
                    </div>
                    <p className="text-sm text-content-muted">
                      {pkg.in_flight} / {pkg.max_concurrency} running
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          </>
        )}
      </AsyncView>
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            href: routes.capabilityList,
            title: "Capabilities",
            body: "Everything the engine can run, by package.",
          },
          { href: routes.jobList, title: "Jobs", body: "Recent runs and their status." }, 
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-xl border border-border-default bg-surface-elevated p-5 transition hover:border-clay"
          >
            <p className="font-display text-lg">{card.title}</p>
            <p className="mt-1 text-sm text-content-muted">{card.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
