import Link from "next/link";

import type { Crumb } from "./types.ts";

/** The path to the current page, from the country down; every step but the last is a link. */
export function Breadcrumbs({ crumbs, label = "Breadcrumb" }: { crumbs: readonly Crumb[]; label?: string }) {
  if (crumbs.length === 0) return null;
  return (
    <nav aria-label={label} className="min-w-0">
      <ol className="flex min-w-0 flex-nowrap items-center gap-x-1.5 overflow-hidden text-sm text-content-muted">
        {crumbs.map((crumb, index) => {
          const last = index === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex min-w-0 items-center gap-1.5">
              {index > 0 ? <span aria-hidden="true" className="opacity-50">/</span> : null}
              {crumb.href && !last ? (
                <Link href={crumb.href} className="truncate hover:text-content-primary hover:underline">{crumb.label}</Link>
              ) : (
                <span className="truncate font-semibold text-content-primary" aria-current={last ? "page" : undefined}>{crumb.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
