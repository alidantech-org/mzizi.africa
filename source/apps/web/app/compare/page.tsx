"use client";

/** Suggested peers and the upward place ladder come from the comparison read, never a fixed country-specific list. */
import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AsyncView } from "#/components/site/async-view.tsx";
import { Empty } from "#/components/site/governance/shared.tsx";
import { PlacePicker } from "#/components/site/place-picker.tsx";
import {
  Breadcrumbs,
  Gaps,
  Loading,
  PageFrame,
  Section,
} from "#/components/site/ui/primitives.tsx";
import type {
  CompareOptions,
  CompareSuggestion,
} from "#/lib/site/governance/contracts.ts";
import { compareOptions, compare } from "#/lib/site/governance/reads.ts";
import { n1 } from "#/lib/site/format.ts";
import { comparisonDifference } from "#/lib/site/governance/comparison-display.ts";
import { useAsync } from "#/lib/site/use-async.ts";

function Pair({ a, b }: { a: string; b: string }) {
  const loaded = useAsync(() => compare(a, b), `compare:${a}:${b}`);
  return (
    <AsyncView loaded={loaded}>
      {(d) => (
        <>
          <h3 className="mb-4 font-display text-2xl">
            {d.a?.name ?? "Unknown place"}{" "}
            <span className="text-content-muted">and</span>{" "}
            {d.b?.name ?? "Unknown place"}
          </h3>
          {d.rows.length === 0 ? (
            <Empty title="No comparable measures recorded" />
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[var(--border-default)]">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-surface-sunken">
                  <tr>
                    <th className="p-4">Measure</th>
                    <th className="p-4">{d.a?.name ?? "First place"}</th>
                    <th className="p-4">{d.b?.name ?? "Second place"}</th>
                    <th className="p-4">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-default)]">
                  {d.rows.map((r) => (
                    <tr key={r.code}>
                      <th className="p-4 font-medium">
                        {r.title}
                        <span className="block text-xs font-normal text-content-muted">
                          {r.unit}
                        </span>
                      </th>
                      <td className="num p-4">
                        {r.a === null ? (
                          <span title="This figure has not been recorded">
                            —
                          </span>
                        ) : (
                          n1(r.a)
                        )}
                      </td>
                      <td className="num p-4">
                        {r.b === null ? (
                          <span title="This figure has not been recorded">
                            —
                          </span>
                        ) : (
                          n1(r.b)
                        )}
                      </td>
                      <td className="p-4">
                        {
                          comparisonDifference(r, d.b?.name ?? "second place")
                            .value
                        }
                        <span className="block text-xs text-content-muted">
                          {
                            comparisonDifference(r, d.b?.name ?? "second place")
                              .note
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="mt-3 text-xs text-content-muted">
            A dash means missing data. A larger population or area is not a
            performance score.
          </p>
          <Gaps items={d.gaps} />
        </>
      )}
    </AsyncView>
  );
}
function Suggestions({
  items,
  onChoose,
}: {
  items: CompareSuggestion[];
  onChoose: (id: string) => void;
}) {
  return items.length === 0 ? (
    <Empty title="No suggestions available">
      Try another measure or place level.
    </Empty>
  ) : (
    <ol className="divide-y divide-[var(--border-default)]">
      {items.map((s, index) => (
        <li key={s.featureId ?? `${s.name}:${index}`}>
          <button
            disabled={!s.featureId}
            className="flex w-full items-center justify-between gap-3 py-4 text-left disabled:opacity-50"
            onClick={() => s.featureId && onChoose(s.featureId)}
          >
            <span>
              <strong className="block text-sm">{s.name}</strong>
              <span className="text-xs text-content-muted">
                {s.distanceKm !== null
                  ? `${n1(s.distanceKm)} km away`
                  : s.rank !== null
                    ? `Rank #${s.rank}${s.value !== null ? ` · ${n1(s.value)}` : ""}`
                    : ""}
              </span>
            </span>
            <span className="text-clay">Compare →</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
function Options({
  data,
  metric,
  setMetric,
}: {
  data: CompareOptions;
  metric: string;
  setMetric: (metric: string) => void;
}) {
  const [other, setOther] = useState("");
  const [mode, setMode] = useState<"nearby" | "top">("nearby");
  return (
    <>
      <h2 className="mt-6 font-display text-3xl">
        {data.place?.name ?? "Place not available"}
      </h2>
      <p className="mt-1 text-content-muted">{data.place?.kindLabel}</p>
      <Section title="Compare at another level">
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {data.hierarchy.map((r) => (
            <li
              key={r.rung}
              className={`rounded-xl border border-[var(--border-default)] p-4 ${r.available ? "" : "bg-surface-sunken"}`}
            >
              <p className="text-xs font-semibold text-content-muted">
                {r.label}
              </p>
              {r.available && r.unit ? (
                <Link
                  className="mt-1 block font-semibold text-clay"
                  href={`/compare?place=${r.unit.featureId}`}
                >
                  {r.unit.name} →
                </Link>
              ) : (
                <p className="mt-1 text-sm text-content-muted">
                  {r.message ??
                    "No comparable places at this level are recorded."}
                </p>
              )}
            </li>
          ))}
        </ol>
      </Section>
      <Section title="Choose a comparison">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div
            role="tablist"
            aria-label="Comparison suggestions"
            className="flex gap-2"
          >
            <button
              role="tab"
              className="tab"
              aria-selected={mode === "nearby"}
              data-active={mode === "nearby"}
              onClick={() => setMode("nearby")}
            >
              10 closest
            </button>
            <button
              role="tab"
              className="tab"
              aria-selected={mode === "top"}
              data-active={mode === "top"}
              onClick={() => setMode("top")}
            >
              10 top performers
            </button>
          </div>
          <label className="w-full text-sm sm:max-w-sm">
            <span className="mb-1 block font-semibold">Ranking measure</span>
            <select
              className="input w-full"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
            >
              <option value="">Default measure</option>
              {data.metrics.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.title}
                </option>
              ))}
            </select>
          </label>
        </div>
        {metric ? (
          <p className="mt-3 text-sm text-content-muted">
            {data.metrics.find((m) => m.code === metric)?.describe}
          </p>
        ) : null}
        <Suggestions
          items={mode === "nearby" ? data.nearby : data.top}
          onChoose={setOther}
        />
      </Section>
      {other && data.place ? (
        <Section title="Side by side">
          <Pair a={data.place.featureId} b={other} />
        </Section>
      ) : null}
      <Gaps items={data.gaps} />
    </>
  );
}
function Read({ place }: { place: string }) {
  const [metric, setMetric] = useState("");
  const loaded = useAsync(
    () => compareOptions(place, metric || undefined),
    `options:${place}:${metric}`,
  );
  return (
    <AsyncView loaded={loaded}>
      {(data) => <Options data={data} metric={metric} setMetric={setMetric} />}
    </AsyncView>
  );
}
function Body() {
  const place = useSearchParams().get("place");
  return (
    <PageFrame>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Compare places" }]}
      />
      <p className="kicker">Put your place in context</p>
      <h1 className="hero-title text-4xl sm:text-5xl">Compare places</h1>
      <p className="mt-3 mb-6 max-w-2xl text-content-muted">
        Choose your place, then find nearby peers or compare a recorded measure.
        Move upward through the levels available in the data.
      </p>
      <div className="max-w-xl">
        <PlacePicker base="/compare" />
      </div>
      {place ? (
        <Read key={place} place={place} />
      ) : (
        <Empty title="Choose a place to begin">
          Search for the place you want to understand. Suggestions will use its
          geographic level.
        </Empty>
      )}
    </PageFrame>
  );
}
export default function CompareRoute() {
  return (
    <Suspense
      fallback={
        <PageFrame>
          <Loading />
        </PageFrame>
      }
    >
      <Body />
    </Suspense>
  );
}
