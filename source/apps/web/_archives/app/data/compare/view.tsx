/** Comparison data is loaded on the server; selecting a peer navigates to a reproducible URL. */
import Link from "next/link";
import { headers } from "next/headers";
import { getCompareOptions } from "@mzizi/api-client/actions/insights/get-compare-options.actions.ts";
import { getComparison } from "@mzizi/api-client/actions/insights/get-comparison.actions.ts";
import { PageFrame, Section } from "#/_archives/components/site/ui/primitives";
import { unwrap, loadContext } from "#/_archives/lib/server/data";

export default async function CompareRoute({ place }: { place?: string }) {
  const context = await loadContext(undefined, place);
  const featureId = place ?? context?.place?.featureId;
  if (!featureId)
    return (
      <PageFrame>
        <h1 className="hero-title text-4xl">Compare places</h1>
        <p className="mt-4">
          Choose a place to see comparable recorded measures.
        </p>
      </PageFrame>
    );
  const requestHeaders = await headers();
  const query = new URLSearchParams(requestHeaders.get("x-query") ?? "");
  const metric = query.get("view.metric") ?? undefined;
  const target = query.get("view.compareTo") ?? undefined;
  const options = await unwrap(
    getCompareOptions({ query: { featureId, metric } }),
  );
  const comparison = target
    ? await unwrap(getComparison({ query: { a: featureId, b: target } }))
    : null;
  const href = (id: string) => {
    const next = new URLSearchParams(query);
    next.set("view", "compare");
    next.set("view.compareTo", id);
    return `?${next}`;
  };
  return (
    <PageFrame wide>
      <p className="kicker">
        {options?.place?.name ?? context?.place?.name} · Compare
      </p>
      <h1 className="hero-title mt-2 text-4xl">Put your place in context</h1>
      <p className="mt-3 max-w-2xl text-content-muted">
        Compare recorded measures with nearby peers. A larger number is not
        automatically a better outcome.
      </p>
      <Section title="Choose a comparison">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {options?.nearby.map((peer) => (
            <Link
              key={peer.featureId ?? peer.name}
              href={peer.featureId ? href(peer.featureId) : "#"}
              className="glass card card-lift"
            >
              <strong>{peer.name}</strong>
              <p className="mt-1 text-xs text-content-muted">
                {peer.distanceKm !== null
                  ? `${peer.distanceKm.toFixed(1)} km away`
                  : "Distance not recorded"}
              </p>
            </Link>
          ))}
        </div>
      </Section>
      {comparison ? (
        <Section
          title={`${comparison.a?.name ?? "Selected place"} and ${comparison.b?.name ?? "Comparison"}`}
        >
          <div className="glass overflow-x-auto rounded-2xl">
            <table className="table-clean">
              <thead>
                <tr>
                  <th>Measure</th>
                  <th>{comparison.a?.name}</th>
                  <th>{comparison.b?.name}</th>
                  <th>Unit</th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr key={row.code}>
                    <th>{row.title}</th>
                    <td className="num">{row.a ?? "—"}</td>
                    <td className="num">{row.b ?? "—"}</td>
                    <td>{row.unit ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-content-muted">
            A dash means missing data; it is not zero.
          </p>
        </Section>
      ) : null}
      {options?.gaps.map((gap) => (
        <p key={gap} className="mt-3 text-sm text-content-muted">
          {gap}
        </p>
      ))}
    </PageFrame>
  );
}
