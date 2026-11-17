"use client";

import type { ReactNode } from "react";

import { useLanguage } from "#/lib/site/i18n.tsx";
import type { Loaded } from "#/lib/site/use-async.ts";

/** Shows a skeleton while loading, the message when a read failed, and the page content when it is ready. */
export function AsyncView<T>({
  loaded,
  children,
}: {
  loaded: Loaded<T>;
  children: (value: T) => ReactNode;
}) {
  const { t } = useLanguage();
  if (loaded.state === "loading") {
    return (
      <div className="space-y-4" aria-busy="true" aria-label={t("loading")}>
        {[0, 1, 2].map((row) => (
          <div key={row} className="h-24 skeleton rounded-[var(--radius)]" />
        ))}
      </div>
    );
  }
  if (loaded.state === "failed") {
    return (
      <div
        role="alert"
        className="rounded-[var(--radius)] border border-danger/40 bg-surface-elevated p-6"
      >
        <p className="font-display text-xl text-danger">{t("errorTitle")}</p>
        <p className="mt-2 text-sm text-content-muted">{loaded.message}</p>
      </div>
    );
  }
  return <>{children(loaded.value)}</>;
}
