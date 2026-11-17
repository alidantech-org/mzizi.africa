"use client";

import type { ReactNode } from "react";

import type { Loaded } from "#/lib/portal/use-async.ts";

/** A skeleton while loading, the failure message when a read failed, and the content when it is ready. */
export function AsyncView<T>({
  loaded,
  children,
}: {
  loaded: Loaded<T>;
  children: (value: T) => ReactNode;
}) {
  if (loaded.state === "loading") {
    return (
      <div className="space-y-3" aria-busy="true">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="h-12 animate-pulse rounded-xl bg-surface-sunken" />
        ))}
      </div>
    );
  }
  if (loaded.state === "failed") {
    return (
      <div role="alert" className="rounded-xl border border-danger/40 bg-surface-elevated p-5">
        <p className="font-medium text-danger">The engine could not answer</p>
        <p className="mt-1 text-sm text-content-muted">{loaded.message}</p>
      </div>
    );
  }
  return <>{children(loaded.value)}</>;
}
