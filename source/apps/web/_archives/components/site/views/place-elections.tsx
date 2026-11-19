/** A place's elections (`/<place>/elections`): a place's elections over time — who won and how, turnout, and how registration has grown. */
import Link from "next/link";

import { Loaded } from "#/_archives/components/site/loaded";
import {
  BarList,
  LineChart,
  Stacked,
} from "#/_archives/components/site/ui/charts";
import {
  Gaps,
  PageFrame,
  PlaceTabs,
  PlaceTrail,
  Section,
  Stat,
} from "#/_archives/components/site/ui/primitives";
import { date, n, pct, words } from "#/_archives/lib/site/format";
import { electionAt } from "#/_archives/lib/site/links";
import { placeElections } from "#/_archives/lib/site/insights";

export default async function PlaceElections({ id }: { id: string }) {
  return (
    <PageFrame>
      <Loaded read={() => placeElections(id)}>
        {(d) => {
          const latest = d.elections[0]?.contests[0];
          return (
            <>
              <PlaceTrail
                chain={[d.place]}
                section={{ label: "Elections", suffix: "elections" }}
              />
              <PlaceTabs path={d.place.path} />
              <p className="kicker">{d.place.kindLabel} · elections</p>
              <h1 className="hero-title text-4xl sm:text-5xl">
                {d.place.name}
              </h1>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Stat
                  label="Registered voters"
                  value={n(
                    latest?.registered ?? d.registrationTrend.at(-1)?.value,
                  )}
                  hint={d.registrationTrend.at(-1)?.period.slice(0, 4)}
                />
                <Stat
                  label="Turnout at the last election"
                  value={pct(latest?.turnout)}
                />
                <Stat label="Elections recorded" value={d.elections.length} />
              </div>
              {d.registrationTrend.length > 1 ? (
                <Section
                  kicker="Registration"
                  title="How the voters' register has grown"
                >
                  <div className="glass card">
                    <LineChart
                      points={d.registrationTrend}
                      unit="voters"
                      label="Registered voters over time"
                      height={200}
                    />
                  </div>
                </Section>
              ) : null}
              {d.elections.map((e) => (
                <Section
                  key={e.electionId}
                  kicker={date(e.heldOn)}
                  title={`${e.year} general election`}
                  action={
                    <Link className="btn btn-ghost" href={electionAt(e)}>
                      Whole-country results
                    </Link>
                  }
                >
                  <div className="grid gap-4 lg:grid-cols-2">
                    {e.contests.map((c) => (
                      <div key={c.kind} className="glass card">
                        <h3 className="font-display text-xl">
                          {words(c.kind)}
                        </h3>
                        <p className="text-sm text-content-muted">
                          {n(c.registered)} registered · turnout{" "}
                          {pct(c.turnout)}
                        </p>
                        <div className="my-3">
                          <Stacked
                            label="Share of votes"
                            parts={c.candidates.map((x) => ({
                              label: x.name,
                              value: x.votes,
                            }))}
                          />
                        </div>
                        <BarList
                          items={c.candidates
                            .slice(0, 5)
                            .map((x) => ({
                              label: `${x.won ? "★ " : ""}${x.name}${x.party ? ` (${x.party})` : ""}`,
                              value: x.share,
                              note: n(x.votes),
                            }))}
                          unit="pct"
                        />
                        {c.candidates[0]?.individualId ? (
                          <p className="mt-3 text-xs text-content-muted">
                            Winner: {c.candidates[0].name}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Section>
              ))}
              <Gaps items={d.gaps} topic={`elections in ${d.place.name}`} />
            </>
          );
        }}
      </Loaded>
    </PageFrame>
  );
}
