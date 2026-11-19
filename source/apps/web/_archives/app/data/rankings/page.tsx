/** Route `/data/rankings`: rank places, leaders and parties by finance, civic delivery, elections, activity and statistics. */
import Link from "next/link";
import { placeAt, leaderAt } from "#/_archives/lib/site/links";
import { T } from "#/_archives/lib/site/i18n";

import { Loaded } from "#/_archives/components/site/loaded";
import {
  Breadcrumbs,
  Gaps,
  PageFrame,
  Pill,
} from "#/_archives/components/site/ui/primitives";
import { n1, short } from "#/_archives/lib/site/format";
import { boardOf, metrics } from "#/_archives/lib/site/insights";

const DOMAINS: Record<string, string> = {
  statistics: "Statistics",
  finance: "Finance",
  civic: "Civic delivery",
  elections: "Elections",
  activity: "Activity of leaders",
};

export const dynamic = "force-dynamic";

export default async function RankingsRoute({
  searchParams,
}: {
  searchParams: Promise<{ metric?: string; kind?: string }>;
}) {
  const q = await searchParams;
  const all = (await metrics().catch(() => ({ metrics: [] }))).metrics;
  const metric = q.metric ?? all[0]?.code ?? "";
  const kind = q.kind ?? "constituency";
  const href = (next: Record<string, string>) =>
    `/data/rankings?${new URLSearchParams({ metric, kind, ...next }).toString()}`;
  return (
    <PageFrame wide>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Rankings" }]}
      />
      <p className="kicker">Who is doing what</p>
      <h1 className="hero-title text-4xl sm:text-5xl">
        <T>{"Rankings"}</T>
      </h1>
      <p className="mt-2 max-w-2xl text-content-muted">
        <T>
          {
            "Rank counties and constituencies — and leaders — on the money spent, the projects delivered, the votes cast and the statistics published. Every ranking says how it is worked out."
          }
        </T>
      </p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[18rem_1fr]">
        <div>
          {
            <nav
              aria-label="Choose a ranking"
              className="glass card max-h-[40rem] space-y-4 overflow-auto p-3"
            >
              {Object.entries(DOMAINS).map(([d, label]) => (
                <div key={d}>
                  <p className="kicker px-2">{label}</p>
                  <ul className="mt-1">
                    {all
                      .filter((m) => m.domain === d)
                      .map((m) => (
                        <li key={m.code}>
                          <Link
                            href={href({ metric: m.code })}
                            className="tab block w-full text-left"
                            data-active={metric === m.code}
                          >
                            {m.title}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </nav>
          }
        </div>
        <div>
          <Loaded read={() => boardOf(metric, kind, undefined, 100)}>
            {(b) => {
              const leader =
                b.rows[0]?.subjectId !== null && b.rows[0] !== undefined;
              const top = Math.max(...b.rows.map((r) => r.value), 1);
              return (
                <>
                  <div className="glass card">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h2 className="font-display text-2xl">
                          {b.metric.title}
                        </h2>
                        <p className="mt-1 max-w-xl text-sm text-content-muted">
                          {b.metric.describe}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Pill tone="info">{b.scope}</Pill>
                        <Pill tone={b.metric.higherIsBetter ? "good" : "warn"}>
                          {b.metric.higherIsBetter
                            ? "higher is better"
                            : "lower is better"}
                        </Pill>
                      </div>
                    </div>
                    {!leader ? (
                      <div
                        className="mt-4 flex gap-2"
                        role="group"
                        aria-label="Level"
                      >
                        {["county", "constituency", "ward"].map((k) => (
                          <Link
                            key={k}
                            href={href({ kind: k })}
                            className="tab"
                            data-active={kind === k}
                          >
                            {k[0]!.toUpperCase() + k.slice(1)}s
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <ol className="mt-4 space-y-2">
                    {b.rows.map((r) => (
                      <li key={`${r.rank}-${r.name}`}>
                        <Link
                          href={
                            r.subjectId
                              ? leaderAt(r)
                              : placeAt(r.path, "finance")
                          }
                          className="glass card card-lift grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 !py-3"
                        >
                          <span
                            className="num grid h-9 w-9 place-items-center rounded-full text-sm font-bold"
                            style={{
                              background:
                                r.rank <= 3
                                  ? "var(--calabash)"
                                  : "var(--surface-sunken)",
                              color: r.rank <= 3 ? "var(--ink)" : undefined,
                            }}
                          >
                            {r.rank}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold">
                              {r.name}
                            </span>
                            <span className="mt-1 block h-1.5 rounded-full bar-track">
                              <span
                                className="bar-fill block h-full"
                                style={{
                                  width: `${Math.max(2, (r.value / top) * 100)}%`,
                                }}
                              />
                            </span>
                            {r.detail ? (
                              <span className="mt-1 block truncate text-xs text-content-muted">
                                {r.detail}
                              </span>
                            ) : null}
                          </span>
                          <span className="num text-right font-display text-xl">
                            {r.value > 9999 ? short(r.value) : n1(r.value)}
                            <span className="ml-1 text-xs text-content-muted">
                              {b.metric.unit}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                  <Gaps items={b.gaps} topic={b.metric.title} />
                </>
              );
            }}
          </Loaded>
        </div>
      </div>
    </PageFrame>
  );
}
