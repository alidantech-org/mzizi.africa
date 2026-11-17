"use client";

/** Route `/capability-list`. Scaffolded by Dryv once; this file belongs to the app. */
import { useState } from "react";

import { AsyncView } from "#/components/portal/async-view.tsx";
import { capabilities } from "#/lib/portal/engine.ts";
import { useAsync } from "#/lib/portal/use-async.ts";
import type { Capability } from "#/lib/types/capability.ts";

export default function CapabilityListRoute() {
  const loaded = useAsync(capabilities, "capabilities");
  const [query, setQuery] = useState("");
  return (
    <div className="space-y-5">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Filter by name, package or description"
        aria-label="Filter capabilities"
        className="w-full max-w-md rounded-lg border border-border-default bg-surface-elevated px-4 py-2 text-sm outline-none focus:border-clay"
      />
      <AsyncView loaded={loaded}>
        {(list) => {
          const needle = query.trim().toLowerCase();
          const shown = list.capabilities.filter(
            (item) =>
              needle === "" ||
              `${item.name} ${item.package} ${item.description ?? ""}`
                .toLowerCase()
                .includes(needle),
          );
          const byPackage = new Map<string, Capability[]>();
          for (const item of shown)
            byPackage.set(item.package, [...(byPackage.get(item.package) ?? []), item]);
          return (
            <div className="space-y-6">
              <p className="text-sm text-content-muted">
                {shown.length} of {list.capabilities.length} capabilities
              </p>
              {[...byPackage.entries()].map(([pkg, items]) => (
                <section key={pkg}>
                  <h2 className="mb-2 font-display text-lg">{pkg}</h2>
                  <div className="overflow-hidden rounded-xl border border-border-default bg-surface-elevated">
                    <table className="w-full text-left text-sm">
                      <tbody className="divide-y divide-border-default">
                        {items.map((item) => (
                          <tr key={item.name}>
                            <td className="w-64 px-4 py-2.5 font-mono text-xs">{item.name}</td>
                            <td className="px-4 py-2.5 text-content-muted">{item.description}</td>
                            <td className="w-20 px-4 py-2.5 text-right text-xs text-content-muted">
                              v{item.version}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          );
        }}
      </AsyncView>
    </div>
  );
}
