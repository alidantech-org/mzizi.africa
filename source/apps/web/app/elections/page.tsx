"use client";

/** Route `/elections`: every election on record, newest first, with the national result and how many people were registered. */
import Link from "next/link";

import { AsyncView } from "#/components/site/async-view.tsx";
import { Stacked } from "#/components/site/ui/charts.tsx";
import { Breadcrumbs, Gaps, PageFrame } from "#/components/site/ui/primitives.tsx";
import { date, n, pct } from "#/lib/site/format.ts";
import { elections } from "#/lib/site/insights.ts";
import { useAsync } from "#/lib/site/use-async.ts";

export default function ElectionsRoute() {
  const loaded = useAsync(() => elections(), "elections");
  return (
    <PageFrame wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Elections" }]} />
      <p className="kicker">Votes and voters</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Elections</h1>
      <p className="mt-2 max-w-2xl text-content-muted">Who won, with how many votes, where — and how the voters' register has grown. Open an election for the heat map, or a place for its own history.</p>
      <AsyncView loaded={loaded}>
        {({ elections: list }) => (
          <>
            <ol className="mt-8 grid gap-5 lg:grid-cols-3">
              {list.map((e, index) => (
                <li key={e.electionId}>
                  <Link href={`/elections/${e.electionId}`} className="glass card card-lift block h-full" style={{ animationDelay: `${index * 80}ms` }}>
                    <p className="kicker">{date(e.heldOn)}</p>
                    <h2 className="font-display text-3xl">{e.year} general election</h2>
                    <p className="mt-3 text-sm text-content-muted">Registered voters</p>
                    <p className="num font-display text-2xl">{n(e.registeredVoters)}</p>
                    {e.winner ? (
                      <div className="mt-4">
                        <p className="text-sm text-content-muted">President elected</p>
                        <p className="font-semibold">{e.winner.name} <span className="font-normal text-content-muted">· {e.winner.party}</span></p>
                        <p className="num text-sm">{n(e.winner.votes)} votes{e.validVotes ? ` (${pct(e.winner.votes / e.validVotes)})` : ""}</p>
                        {e.runnerUp && e.validVotes ? <div className="mt-3"><Stacked label="Share of the vote" parts={[{ label: e.winner.name, value: e.winner.votes }, { label: e.runnerUp.name, value: e.runnerUp.votes }, { label: "Others", value: Math.max(0, e.validVotes - e.winner.votes - e.runnerUp.votes) }]} /></div> : null}
                      </div>
                    ) : null}
                    <p className="mt-4 text-xs text-content-muted">{e.contests} contests recorded</p>
                  </Link>
                </li>
              ))}
            </ol>
            <Gaps topic="election results" items={["Presidential totals are the published figures; the split by county and the governor and member-of-parliament results are sample data for development. Ward-level results are not recorded."]} />
          </>
        )}
      </AsyncView>
    </PageFrame>
  );
}
