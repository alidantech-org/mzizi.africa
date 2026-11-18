import type { ExperienceFacilityList } from "@mzizi/api-client/types/experience/facility-list.ts";

import { ClassChips, FacilityCard } from "#/components/site/facility-views.tsx";
import { PageFrame } from "#/components/site/ui/primitives.tsx";

export function FacilitiesPage({ list, classCode, q, base }: { list: ExperienceFacilityList | null; classCode?: string; q?: string; base: string }) {
  return (
    <PageFrame>
      <p className="kicker">Infrastructure</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Offices, schools, hospitals and polling stations</h1>
      <p className="mt-2 max-w-2xl text-content-muted">What exists, where it is, how big it is and who runs it. A place with nothing listed may simply not have been collected yet.</p>
      <form action={base} className="mt-5 flex max-w-xl gap-2">
        {classCode ? <input type="hidden" name="class" value={classCode} /> : null}
        <input name="q" defaultValue={q} placeholder="Search by name" className="glass w-full rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--clay)]" />
        <button className="btn btn-primary" type="submit">Search</button>
      </form>
      {list ? (
        <div className="mt-5 space-y-5">
          <ClassChips classes={list.classes} base={base} active={classCode} />
          <p className="text-sm text-content-muted"><span className="num font-semibold">{new Intl.NumberFormat("en").format(list.total)}</span> recorded; showing {list.facilities.length}</p>
          {list.facilities.length === 0 ? <p className="glass card text-content-muted">{list.gaps[0] ?? "Nothing matches."}</p> : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.facilities.map((facility) => <FacilityCard key={facility.code} facility={facility} />)}</div>
          )}
        </div>
      ) : <p className="glass card mt-5 text-content-muted">The register could not be loaded.</p>}
    </PageFrame>
  );
}

