import { setupLink, type SetupParameters } from "./_lib/navigation";
import { DevicePreferences } from "./_components/preferences";
import { Suspense } from "react";
import { bootstrap, preferences, value, href, resolveContext, selectPlaces, type Query } from "./_lib/explorer";
import { completeSetup } from "./_lib/actions";
import { WelcomeDialog, DeviceLocation } from "./_components/welcome-dialog";

export default function Home({ searchParams }: { searchParams: Promise<Query> }) {
  return (
    <Suspense
      fallback={
        <main className="real-shell">
          <h1>Mzizi</h1>
          <p>Loading your explorer…</p>
        </main>
      }
    >
      <Welcome searchParams={searchParams} />
    </Suspense>
  );
}
async function Welcome({ searchParams }: { searchParams: Promise<Query> }) {
  const query = await searchParams;
  const accepted = new Set(["view", "view.tab", "view.entity", "view.id", "filters.country", "filters.query", "lang"]);
  for (const key of Object.keys(query)) if (!accepted.has(key)) throw new Error(`Unsupported setup parameter: ${key}`);
  if (value(query, "view") && value(query, "view") !== "setup") throw new Error("Choose a place before opening a subject.");
  if (value(query, "view.entity") && value(query, "view.entity") !== "place")
    throw new Error("Only place selection is supported here.");
  if (value(query, "view.id") && !value(query, "filters.country")) throw new Error("A selected place needs its country.");
  const searchText = value(query, "filters.query");
  if (searchText && (searchText.trim().length < 2 || searchText.length > 100))
    throw new Error("Search text must contain 2 to 100 characters.");
  const prefs = await preferences(query);
  const open = value(query, "view") === "setup" || !prefs.completed;
  let catalogue;
  try {
    catalogue = await bootstrap(prefs.language);
  } catch {
    return (
      <main className="real-shell">
        <h1>Mzizi</h1>
        <div className="real-error">
          <h2>The explorer is temporarily unavailable</h2>
          <p>We could not load the country and language catalogue. Please try again.</p>
          <a href="/">Retry</a>
        </div>
        <a href="/demo">Open the permanent demo</a>
      </main>
    );
  }
  const country = value(query, "filters.country")?.toUpperCase();
  const selectedId = value(query, "view.id");
  if (selectedId && value(query, "view.entity") !== "place") throw new Error("A selected place needs view.entity=place.");
  const selected = country && selectedId ? await resolveContext(country, "", prefs.language, selectedId) : undefined;
  const places = country
    ? await selectPlaces(country, prefs.language, value(query, "filters.query"), selected?.body?.place.featureId)
    : undefined;
  const setupHref = (fields: SetupParameters) => setupLink(fields, prefs.explicitLanguage);
  const tab = value(query, "view.tab") ?? "place";
  if (!["place", "preferences"].includes(tab)) throw new Error("Unknown setup tab.");
  return (
    <main className="real-shell">
      <DevicePreferences theme={prefs.theme} explicitLanguage={prefs.explicitLanguage} />
      <header className="real-header">
        <a className="real-brand" href="/">
          <img src="/icons/icon.svg" alt="" />
          Mzizi
        </a>
        <a href="/demo">Design demo</a>
      </header>
      <section className="real-hero">
        <p className="eyebrow">Knowledge in context</p>
        <h1>Understand the place you call home.</h1>
        <p>Explore places through their recorded evidence, relationships and history. Choose a place to begin.</p>
        <a className="primary-link" href={setupHref({})}>
          Choose your place
        </a>
        {prefs.savedPath && /^\/[a-z]{2}(\/|$)/.test(prefs.savedPath) && (
          <p>
            <a href={href(prefs.savedPath, prefs.explicitLanguage)}>Continue exploring your saved place →</a>
          </p>
        )}
      </section>
      <p className="real-note">Explore recorded geography and evidence. Coverage varies by place.</p>
      {open && (
        <WelcomeDialog>
          <header className="real-header">
            <h2 id="setup-title">Welcome to Mzizi</h2>
            {prefs.completed && <a href="/">Close</a>}
          </header>
          <p>Set your place and preferences on this device. No account is required.</p>
          <nav className="setup-tabs" aria-label="Setup steps">
            <a
              aria-current={tab === "place" ? "step" : undefined}
              href={setupHref({
                ...(country ? { "filters.country": country } : {}),
                ...(selectedId ? { "view.entity": "place", "view.id": selectedId } : {}),
                "view.tab": "place",
              })}
            >
              1. Place
            </a>
            <a
              aria-current={tab === "preferences" ? "step" : undefined}
              href={setupHref({
                ...(country ? { "filters.country": country } : {}),
                ...(selectedId ? { "view.entity": "place", "view.id": selectedId } : {}),
                "view.tab": "preferences",
              })}
            >
              2. Preferences
            </a>
          </nav>
          {tab === "place" && (
            <>
              <form method="get" className="setup-search">
                <input type="hidden" name="view" value="setup" />
                {prefs.explicitLanguage && <input type="hidden" name="lang" value={prefs.explicitLanguage} />}
                <label>
                  Country
                  <select name="filters.country" defaultValue={country ?? ""} required>
                    <option value="" disabled>
                      Choose a country
                    </option>
                    {catalogue.countries.map((item) => (
                      <option key={item.id} value={item.code} disabled={!item.rootFeatureId}>
                        {item.name}
                        {!item.rootFeatureId ? " — geography unavailable" : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <button>Choose country</button>
              </form>
              {country && (
                <>
                  <DeviceLocation country={country} explicitLanguage={prefs.explicitLanguage} />
                  <form method="get" className="setup-search">
                    <input type="hidden" name="view" value="setup" />
                    <input type="hidden" name="filters.country" value={country} />
                    {prefs.explicitLanguage && <input type="hidden" name="lang" value={prefs.explicitLanguage} />}
                    <label>
                      Search within this country
                      <input
                        name="filters.query"
                        minLength={2}
                        maxLength={100}
                        defaultValue={value(query, "filters.query")}
                        placeholder="Place name"
                      />
                    </label>
                    <button>Search</button>
                  </form>
                  {selected?.success && selected.body && (
                    <>
                      <p>
                        Selected: <strong>{selected.body.place.name}</strong> · {selected.body.place.kind}
                      </p>
                      <nav className="real-crumbs" aria-label="Selected place ancestors">
                        {selected.body.chain.map((place) => (
                          <a
                            key={place.featureId}
                            href={setupHref({ "filters.country": country, "view.entity": "place", "view.id": place.featureId })}
                          >
                            {place.name}
                          </a>
                        ))}
                      </nav>
                      <a
                        className="primary-link"
                        href={setupHref({
                          "filters.country": country,
                          "view.entity": "place",
                          "view.id": selected.body.place.featureId,
                          "view.tab": "preferences",
                        })}
                      >
                        Use {selected.body.place.name}
                      </a>
                    </>
                  )}
                  {selected && !selected.success && <p role="alert">{selected.message}</p>}
                  {places?.success && places.body ? (
                    <>
                      <h3>{value(query, "filters.query") ? "Search results" : "Explore child places"}</h3>
                      <ul className="real-list">
                        {places.body.places.map((place) => (
                          <li key={`${place.featureId}:${place.canonicalPath}`}>
                            <a
                              href={setupHref({ "filters.country": country, "view.entity": "place", "view.id": place.featureId })}
                            >
                              {place.name}
                              <small>{place.kind}</small>
                            </a>
                          </li>
                        ))}
                      </ul>
                      <p className="real-note">
                        Showing {places.body.places.length} of {places.body.total} registered places. Narrow your search to find
                        another place.
                      </p>
                      {places.body.gaps.map((gap) => (
                        <p className="real-note" key={gap}>
                          {gap}
                        </p>
                      ))}
                    </>
                  ) : (
                    <p role="alert">{places?.message ?? "Choose a country to load places."}</p>
                  )}
                  {!selectedId && (
                    <a
                      href={setupHref({
                        "filters.country": country,
                        "view.entity": "place",
                        "view.id": catalogue.countries.find((item) => item.code === country)?.rootFeatureId ?? "",
                      })}
                    >
                      Select the whole country
                    </a>
                  )}
                </>
              )}
            </>
          )}
          {tab === "preferences" &&
            (selected?.success && selected.body ? (
              <form action={completeSetup} className="setup-form">
                <p>
                  Your context: <strong>{selected.body.place.name}</strong>
                </p>
                <input type="hidden" name="country" value={country} />
                <input type="hidden" name="place" value={selected.body.place.featureId} />
                <input type="hidden" name="explicitLanguage" value={prefs.explicitLanguage ? "yes" : "no"} />
                <label>
                  Language
                  <select name="language" defaultValue={prefs.language}>
                    {catalogue.languages.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="real-note">
                  Place names use available language records. Interface copy may fall back to English where a translation is
                  unavailable.
                </p>
                <label>
                  Appearance
                  <select name="theme" defaultValue="system">
                    <option value="system">Follow device</option>
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </label>
                <button className="primary-link">Save and explore</button>
              </form>
            ) : (
              <p>Select a place before saving your preferences.</p>
            ))}
          <p className="real-note">
            Preferences stay in cookies on this device. Device location is used only when requested and must be confirmed before
            saving.
          </p>
        </WelcomeDialog>
      )}
    </main>
  );
}
