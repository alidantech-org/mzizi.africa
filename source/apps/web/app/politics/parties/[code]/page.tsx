/** Route `/politics/parties/<code>`: a party's members, its votes by election and the fund money it received. */
import Link from "next/link";

import { Loaded } from "#/components/site/loaded.tsx";
import { BarList } from "#/components/site/ui/charts.tsx";
import { Gallery } from "#/components/site/ui/media.tsx";
import { Breadcrumbs, Gaps, PageFrame, Section, Stat } from "#/components/site/ui/primitives.tsx";
import { n, words } from "#/lib/site/format.ts";
import { Money } from "#/lib/site/country.tsx";
import { partyOf } from "#/lib/site/insights.ts";

export default async function PartyRoute({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return (
    <PageFrame>
      <Loaded read={() => partyOf(decodeURIComponent(code))}>
        {(d) => (
          <>
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Parties", href: "/politics/parties" }, { label: d.party.name }]} />
            <p className="kicker">Political party</p>
            <h1 className="hero-title text-4xl sm:text-5xl">{d.party.name}</h1>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Stat label="Members listed" value={n(d.members.length)} />
              <Stat label="Latest fund allocation" value=<Money value={d.funding.at(-1)?.amountKes} /> hint={d.funding.at(-1) ? `${d.funding.at(-1)!.year}` : undefined} />
              <Stat label="Contests entered" value={n(d.results.reduce((a, r) => a + r.candidates, 0))} />
            </div>
            <Section kicker="At the ballot" title="Votes obtained by election">
              <div className="glass card overflow-x-auto">
                <table className="table-clean"><thead><tr><th>Year</th><th>Contest</th><th>Candidates</th><th>Votes</th></tr></thead>
                  <tbody>{d.results.map((r) => <tr key={`${r.year}-${r.contest}`}><td className="num">{r.year}</td><td>{words(r.contest)}</td><td className="num">{r.candidates}</td><td className="num">{n(r.votes)}</td></tr>)}</tbody></table>
              </div>
              {d.results.length > 0 ? <div className="glass card mt-4"><BarList items={d.results.map((r) => ({ label: `${r.year} · ${words(r.contest)}`, value: r.votes }))} unit="short" /></div> : null}
            </Section>
            {d.party.media.length > 0 ? <Section title="Media" kicker="Social"><Gallery items={d.party.media} /></Section> : null}
            <Section kicker="People" title={`Members (${d.members.length}${d.members.length >= 400 ? "+" : ""})`}>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {d.members.map((m) => (
                  <li key={m.individualId}>
                    {m.holderId ? <Link href={`/leaders/${m.holderId}`} className="glass card card-lift block !py-3"><span className="block font-semibold">{m.name}</span><span className="text-xs text-content-muted">{m.office ?? "Member"}{m.unit ? ` · ${m.unit}` : ""}</span></Link>
                      : <span className="glass card block !py-3"><span className="block font-semibold">{m.name}</span><span className="text-xs text-content-muted">Member</span></span>}
                  </li>
                ))}
              </ul>
            </Section>
            <Gaps items={d.gaps} topic={d.party.name} />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
