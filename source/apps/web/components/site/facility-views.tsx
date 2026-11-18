import Link from "next/link";

import type { ExperienceFacilityRow } from "@mzizi/api-client/types/experience/facility-row.ts";
import type { ExperienceClassCount } from "@mzizi/api-client/types/experience/class-count.ts";

/** The top-level classes (parents of nothing above them) as filter chips with counts. */
export function ClassChips({ classes, base, active }: { classes: readonly ExperienceClassCount[]; base: string; active?: string }) {
  const top = classes.filter((c) => !c.parentCode);
  return (
    <nav aria-label="Classes" className="flex flex-wrap gap-2">
      <Link href={base} className="tab" data-active={!active}>All</Link>
      {top.map((c) => (
        <Link key={c.code} href={`${base}?class=${c.code}`} className="tab inline-flex items-center gap-1.5" data-active={active === c.code}>
          {c.label}<span className="num text-xs opacity-70">{c.count}</span>
        </Link>
      ))}
    </nav>
  );
}

export function FacilityCard({ facility }: { facility: ExperienceFacilityRow }) {
  return (
    <Link href={`/infrastructure/facilities/${facility.code}`} className="glass card card-lift block">
      <p className="kicker">{facility.classLabel}</p>
      <h3 className="mt-1 font-display text-lg leading-snug">{facility.name}</h3>
      <p className="mt-1 text-sm text-content-muted">{[facility.operator, facility.statusLabel].filter(Boolean).join(" · ")}</p>
      {facility.capacity.length > 0 ? (
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {facility.capacity.map((c) => (
            <div key={c.indicatorCode}><dt className="text-xs text-content-muted">{c.label}</dt><dd className="num font-semibold">{new Intl.NumberFormat("en").format(c.value)}</dd></div>
          ))}
        </dl>
      ) : null}
    </Link>
  );
}
