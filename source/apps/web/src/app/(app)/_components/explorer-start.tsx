import { setupLink } from "../_lib/navigation";
import { SharePlace } from "./share";
import { DevicePreferences } from "./preferences";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { loadOverview, preferences, value, href, type Query } from "../_lib/explorer";
export default function ExplorerPage(props: {
  params: Promise<{ country: string; place?: string[] }>;
  searchParams: Promise<Query>;
}) {
  return (
    <Suspense
      fallback={
        <main className="real-shell">
          <h1>Mzizi explorer</h1>
          <p>Loading recorded place data…</p>
        </main>
      }
    >
      <Explorer {...props} />
    </Suspense>
  );
}
async function Explorer({
  params,
  searchParams,
}: {
  params: Promise<{ country: string; place?: string[] }>;
  searchParams: Promise<Query>;
}) {
  const { country, place = [] } = await params;
  if (!/^[a-z]{2}$/i.test(country)) notFound();
  const query = await searchParams;
  for (const key of Object.keys(query))
    if (!["view", "lang"].includes(key)) throw new Error(`Unsupported overview parameter: ${key}`);
  const prefs = await preferences(query);
  const view = value(query, "view") ?? "overview";
  if (view !== "overview")
    return (
      <main className="real-shell">
        <h1>This view is not available yet</h1>
        <p>The selected place has been preserved.</p>
        <a href={href(`/${country}/${place.map(encodeURIComponent).join("/")}`.replace(/\/$/, ""), prefs.explicitLanguage)}>
          Return to place overview
        </a>
      </main>
    );
  const response = await loadOverview(country, place.join("/"), prefs.language);
  if (!response.success || !response.body) {
    if (response.status === 404) notFound();
    return (
      <main className="real-shell">
        <h1>Place data is unavailable</h1>
        <p role="alert">{response.message}</p>
        <a href="/?view=setup">Choose another place</a>
      </main>
    );
  }
  const data = response.body;
  const context = data.context;
  return (
    <main className="real-shell">
      <DevicePreferences theme={prefs.theme} explicitLanguage={prefs.explicitLanguage} />
      <header className="real-header">
        <a className="real-brand" href="/">
          <img src="/icons/icon.svg" alt="" />
          Mzizi
        </a>
        <a
          href={setupLink(
            { "filters.country": context.country.code, "view.entity": "place", "view.id": context.place.featureId },
            prefs.explicitLanguage,
          )}
        >
          Change place
        </a>
      </header>
      <nav className="real-crumbs" aria-label="Place hierarchy">
        {context.chain.map((ancestor) => (
          <a key={ancestor.featureId} href={href(ancestor.canonicalPath, prefs.explicitLanguage)}>
            {ancestor.name}
          </a>
        ))}
      </nav>
      <section className="real-hero">
        <p className="eyebrow">
          {context.country.name} · {context.place.kind}
        </p>
        <h1>{context.place.name}</h1>
        <p>Explore this place through its registered geography and recorded evidence.</p>
      </section>
      <section className="real-grid" aria-label="Recorded coverage">
        {data.counts.map((count) => (
          <article className="real-card" key={count.label}>
            <span>{count.label}</span>
            <strong>{count.value.toLocaleString()}</strong>
            <small>Recorded coverage</small>
          </article>
        ))}
      </section>
      <section className="real-card" style={{ marginTop: 24 }}>
        <h2>Places within {context.place.name}</h2>
        <ul className="real-list">
          {data.children.places.map((child) => (
            <li key={child.featureId}>
              <a href={href(child.canonicalPath, prefs.explicitLanguage)}>
                {child.name}
                <small>{child.kind} →</small>
              </a>
            </li>
          ))}
        </ul>
        <p className="real-note">
          Showing {data.children.places.length} of {data.children.total} registered direct child places.
        </p>
        {data.children.gaps.map((gap) => (
          <p key={gap}>{gap}</p>
        ))}
      </section>
      <section>
        <h2>Sources and gaps</h2>
        {data.gaps.map((gap) => (
          <p className="real-note" key={gap}>
            {gap}
          </p>
        ))}
        <p className="real-note">
          Names are shown from available language records; unavailable interface translations fall back to English. These counts
          are not statistical measures or verified completeness scores.
        </p>
      </section>
      <SharePlace language={context.language} />
      <footer className="real-footer">
        <a href="/demo">Open the permanent design demo</a>
      </footer>
    </main>
  );
}
