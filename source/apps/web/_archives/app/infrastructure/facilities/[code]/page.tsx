/** One facility: what it is, who runs it, how big it is, where it is, and the polling stations it hosts. */
import { notFound } from "next/navigation";

import { getFacility } from "@mzizi/api-client/actions/experience/get-facility.actions.ts";

import { PageFrame } from "#/_archives/components/site/ui/primitives";
import { serverLanguage, unwrap } from "#/_archives/lib/server/data";

export const dynamic = "force-dynamic";

export default async function FacilityPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const detail = await unwrap(
    getFacility({
      params: { code },
      query: { languageCode: await serverLanguage() },
    }),
  );
  if (!detail) notFound();
  const { facility, chain, stations } = detail;
  return (
    <PageFrame>
      <p className="kicker">
        {facility.domainLabel} · {facility.classLabel}
      </p>
      <h1 className="hero-title text-4xl sm:text-5xl">{facility.name}</h1>
      <p className="mt-2 text-content-muted">
        {[facility.operator, facility.ownershipLabel, facility.statusLabel]
          .filter(Boolean)
          .join(" · ")}
      </p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <section className="glass card">
          <h2 className="font-display text-xl">Size and capacity</h2>
          {facility.capacity.length === 0 ? (
            <p className="mt-2 text-sm text-content-muted">
              No size or capacity has been recorded for this facility.
            </p>
          ) : (
            <dl className="mt-3 grid grid-cols-2 gap-4">
              {facility.capacity.map((c) => (
                <div key={c.indicatorCode}>
                  <dt className="text-xs text-content-muted">{c.label}</dt>
                  <dd className="num font-display text-3xl">
                    {new Intl.NumberFormat("en").format(c.value)}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>
        <section className="glass card">
          <h2 className="font-display text-xl">Where</h2>
          <ol className="mt-2 text-sm text-content-muted">
            {chain.map((place) => (
              <li key={place.featureId}>
                <a className="hover:underline" href={`/${place.path}`}>
                  {place.name}
                </a>{" "}
                <span className="opacity-60">({place.kindLabel})</span>
              </li>
            ))}
          </ol>
          {facility.latitude != null && facility.longitude != null ? (
            <p className="num mt-3 text-xs text-content-muted">
              {facility.latitude.toFixed(4)}, {facility.longitude.toFixed(4)}
            </p>
          ) : null}
        </section>
      </div>
      {stations.length > 0 ? (
        <section className="mt-5">
          <h2 className="font-display text-xl">Polling stations hosted here</h2>
          <ul className="mt-2 divide-y divide-[var(--border-default)] glass rounded-2xl">
            {stations.map((s) => (
              <li
                key={`${s.stationName}-${s.electionCode}`}
                className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-3 text-sm"
              >
                <span>
                  <span className="font-semibold">{s.stationName}</span>{" "}
                  <span className="text-content-muted">
                    {s.electionYear} · {s.statusLabel}
                  </span>
                </span>
                <span className="num text-content-muted">
                  {s.registeredVoters != null
                    ? `${new Intl.NumberFormat("en").format(s.registeredVoters)} registered`
                    : ""}
                  {s.ballotsCast != null
                    ? ` · ${new Intl.NumberFormat("en").format(s.ballotsCast)} voted`
                    : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </PageFrame>
  );
}
