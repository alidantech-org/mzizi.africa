/** What applies to this place, with scope and relationship labelled. Out-of-scope records are not listed; uncertain ones say so. */
import Link from "next/link";
import { officesFor, type Scope } from "#/lib/applies";
import { build, type Ctx } from "#/lib/route";
import type { OkPlace } from "#/views/types";
import { Panel } from "./panel";
import { RoleBadge } from "./ui";

const scopeLabel: Record<Scope, string> = { national: "National", county: "County", constituency: "Constituency", ward: "Ward" };

export function Applies({ place, ctx }: { place: OkPlace; ctx: Ctx }) {
  const list = officesFor(place);
  const groups = (["national", "county", "constituency", "ward"] as Scope[]).map((s) => ({ s, items: list.filter((x) => x.scope === s) })).filter((g) => g.items.length);
  return (
    <Panel title={`What applies to ${place.trail.at(-1)?.name ?? place.countryName}`} note="Scope and relationship">
      <p className="mb-4 text-sm text-muted">A national office applies here because its authority covers the whole country. A local office applies only if it represents this place. Records outside this place are left out.</p>
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map((g) => (
          <div key={g.s} className="rounded-lg border border-line p-4">
            <div className="mb-2 flex items-center justify-between"><span className="font-medium">{scopeLabel[g.s]}</span><span className="text-xs text-muted">{g.items[0].scopeName}</span></div>
            <ul className="divide-y divide-line text-sm">
              {g.items.slice(0, 8).map((x) => <li key={x.office.id} className="flex items-center justify-between gap-2 py-2"><span>{x.office.name}<span className="ml-2 text-xs text-muted">{x.relation}</span></span>{x.office.role && <RoleBadge role={x.office.role} />}</li>)}
            </ul>
          </div>
        ))}
        <div className="rounded-lg border border-dashed border-muted p-4"><div className="font-medium">Not established</div>
          <p className="mt-2 text-sm text-muted">County legislation, national programmes and service coverage for this place are not loaded, so their applicability is shown as unknown rather than assumed.</p></div>
      </div>
      <Link href={build(ctx, { view: "leaders" })} className="mt-4 inline-block text-sm font-medium text-accent">Open Leaders for this place →</Link>
    </Panel>
  );
}
