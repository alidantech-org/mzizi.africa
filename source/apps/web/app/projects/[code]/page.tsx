/** Route `/projects/<code>`: one project — where, who is responsible, the money, the tender and bids, pictures and evidence. */
import Link from "next/link";

import { placeAt } from "#/lib/site/links.ts";
import { Loaded } from "#/components/site/loaded.tsx";
import { ProjectsMapLazy } from "#/components/site/map/projects-map-lazy.tsx";
import { Gallery } from "#/components/site/ui/media.tsx";
import { Breadcrumbs, Gaps, PageFrame, Pill, Section, Stat } from "#/components/site/ui/primitives.tsx";
import { statusTone } from "#/components/site/ui/status.ts";
import { ReactionButton, ViewBeacon } from "#/components/site/reaction.tsx";
import { LikeProject } from "#/components/site/save-buttons.tsx";
import { date, words } from "#/lib/site/format.ts";
import { Money } from "#/lib/site/country.tsx";
import { projectOf } from "#/lib/site/insights.ts";

export default async function ProjectRoute({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <PageFrame>
      <Loaded read={() => projectOf(decodeURIComponent(code))}>
        {(d) => {
          const p = d.project;
          const total = d.money.reduce((a, m) => a + (m.amount ?? 0), 0);
          return (
            <>
              <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Money & projects", href: "/finance" }, { label: p.unit, href: placeAt(p.unit_path, "finance") }, { label: p.name }]} />
              <div className="flex flex-wrap items-center gap-2"><Pill tone={statusTone(p.status)}>{words(p.status)}</Pill>{p.started_on ? <span className="text-sm text-content-muted">Started {date(p.started_on)}</span> : null}</div>
              <h1 className="hero-title mt-3 text-3xl sm:text-5xl">{p.name}</h1>
              <p className="mt-3 max-w-3xl text-content-muted">{p.description}</p>
              <p className="mt-3 flex items-center gap-3 text-sm text-content-muted"><ReactionButton table="civic.projects" subject={p.code} /><LikeProject project={{ id: p.code, title: p.name }} /> Save this project<ViewBeacon table="civic.projects" subject={p.code} /></p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Stat label="Money recorded" value={total ? <Money value={total} /> : "—"} hint={`${d.money.length} flow${d.money.length === 1 ? "" : "s"}`} />
                <Stat label="Responsible body" value={<span className="text-xl">{p.responsible ?? "Not recorded"}</span>} />
                <Stat label="Area" value={<Link className="text-xl underline" href={placeAt(p.unit_path, "finance")}>{p.unit}</Link>} />
              </div>
              {p.location ? <Section kicker="Where" title="Location"><ProjectsMapLazy height={320} pins={[{ code: p.code, name: p.name, status: p.status, location: p.location, href: "#" }]} /><p className="mt-2 text-xs text-content-muted">The point is approximate unless the source gives coordinates.</p></Section> : null}
              {d.procurement ? (
                <Section kicker="Tender" title={d.procurement.title ?? "Procurement"}>
                  <div className="glass card">
                    <div className="flex flex-wrap items-center gap-2"><Pill tone={statusTone(d.procurement.status)}>{words(d.procurement.status ?? "unknown")}</Pill><Pill>{words(d.procurement.procedure)}</Pill>{d.procurement.reference ? <span className="text-xs text-content-muted">Ref {d.procurement.reference}</span> : null}</div>
                    <p className="mt-2 text-sm text-content-muted">Buyer: {d.procurement.buyer ?? "—"} · published {date(d.procurement.published_on)} · closes {date(d.procurement.closes_on)}{d.procurement.awarded_on ? ` · awarded ${date(d.procurement.awarded_on)}` : ""}</p>
                    {d.procurement.contracts.map((c) => <p key={c.contractor} className="mt-3"><span className="kicker">Awarded to</span><br /><span className="font-display text-xl">{c.contractor}</span> <span className="num text-content-muted">· <Money value={c.amount} /> · signed {date(c.signed_on)} · {words(c.status)}</span></p>)}
                    {d.procurement.bids.length > 0 ? <table className="table-clean mt-4"><thead><tr><th>Bidder</th><th>Bid</th><th>Outcome</th></tr></thead><tbody>{d.procurement.bids.map((b) => <tr key={b.bidder}><td>{b.bidder}</td><td className="num"><Money value={b.amount} /></td><td><Pill tone={statusTone(b.outcome === "successful" ? "awarded" : null)}>{words(b.outcome)}</Pill></td></tr>)}</tbody></table> : null}
                  </div>
                </Section>
              ) : null}
              {d.money.length > 0 ? <Section kicker="Money" title="Where the money came from and went"><div className="glass card overflow-x-auto"><table className="table-clean"><thead><tr><th>Date</th><th>Kind</th><th>Class</th><th>Amount</th></tr></thead><tbody>{d.money.map((m) => <tr key={m.code}><td>{date(m.occurred_on)}</td><td>{words(m.kind)}</td><td>{m.class ?? "—"}</td><td className="num"><Money value={m.amount} /></td></tr>)}</tbody></table></div></Section> : null}
              {d.media.length > 0 ? <Section kicker="See it" title="Pictures"><Gallery items={d.media} /></Section> : null}
              {d.evidence.length > 0 ? <Section kicker="Sources" title="Evidence"><ul className="space-y-2 text-sm">{d.evidence.map((e) => <li key={e.citationId}><Link className="underline" href={`/data/sources?citationId=${e.citationId}`}>{e.sourceName}</Link> <span className="text-content-muted">· {e.locator}</span></li>)}</ul></Section> : null}
              <Gaps items={d.gaps} topic={p.name} />
            </>
          );
        }}
      </Loaded>
    </PageFrame>
  );
}
