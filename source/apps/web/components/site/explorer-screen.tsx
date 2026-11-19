/** Server-rendered explorer presentation. Data comes from generated contracts, never browser loaders. */
import { ExplorerShellUpdate } from "#/components/shell/app-frame.tsx";
import { ShareExplorer } from "#/components/site/share-explorer.tsx";
import Link from "next/link";
import type { LocalityLocalityProfile } from "@mzizi/api-client/types/locality/locality-profile.ts";
import PlaceFinance from "#/components/site/views/place-finance.tsx";
import PlaceElections from "#/components/site/views/place-elections.tsx";
import CompareRoute from "#/app/data/compare/view.tsx";
import InfrastructurePage from "#/app/infrastructure/page.tsx";
import CalendarPage from "#/app/calendar/page.tsx";
import { ExplorerView } from "#/lib/types/explorer-view.enum.ts";
import type { ExperienceContext } from "@mzizi/api-client/types/experience/context.ts";
import type { StructureStructureDocument } from "@mzizi/api-client/types/structure/structure-document.ts";
import type { ExplorerAddress } from "#/lib/types/explorer-address.ts";
import { explorerAt, explorerNavigation } from "#/lib/dryv/explorer-address.ts";
import { GovernanceStructure } from "#/components/site/governance/structure-screen.tsx";
import { PlaceStatistics } from "#/components/site/views/index.ts";
import { BrowsePage } from "#/components/site/views/browse-page.tsx";
import { LawPage } from "#/components/site/views/law-page.tsx";
import { PageFrame } from "#/components/site/ui/primitives.tsx";

interface ExplorerScreenProps {
  context: ExperienceContext;
  state: ExplorerAddress;
  structure: StructureStructureDocument | null;
  language: string;
  featureId?: string;
  locality?: LocalityLocalityProfile | null;
}

export function ExplorerScreen({ context, state, structure, language, featureId, locality }: ExplorerScreenProps) {
  const path = [context.country.code, context.place?.path].filter(Boolean).join("/");
  const shell = <ExplorerShellUpdate context={{ countryName: context.country.name, countryIso: context.country.isoCode, place: context.place, chain: context.chain, rest: context.rest }} />;
  const title = context.place?.name ?? context.country.name;
  const heading = explorerNavigation.find((entry) => entry.view === state.view)?.label ?? "Overview";
  if (state.view === "leaders" || state.view === "institutions") return <>{shell}<GovernanceStructure data={structure} path={path} state={state} placeName={title} /></>;
  if (state.view === "places") return <>{shell}<BrowsePage featureId={featureId} /></>;
  if (state.view === "statistics" && featureId) return <>{shell}<PlaceStatistics id={featureId} /></>;
  if (state.view === "finance" && featureId) return <>{shell}<PlaceFinance id={featureId} /></>;
  if (state.view === "elections" && featureId) return <>{shell}<PlaceElections id={featureId} /></>;
  if (state.view === "compare" && featureId) return <>{shell}<CompareRoute place={featureId} /></>;
  if (state.view === "infrastructure") return <>{shell}<InfrastructurePage searchParams={Promise.resolve({ featureId, class: state.classCode, q: state.q })} /></>;
  if (state.view === "calendar") return <>{shell}<CalendarPage searchParams={Promise.resolve({ featureId, year: state.year?.toString() })} /></>;
  if (state.view === "laws" && state.entity === "instrument" && state.id) return <LawPage instrument={state.id} provision={state.provision} />;
  return <>{shell}<PageFrame wide>
    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--border-default)] pb-6">
      <div><p className="kicker">{context.country.name} · {heading}</p><h1 className="hero-title mt-2 text-4xl sm:text-6xl">{title}</h1><p className="mt-3 max-w-2xl text-content-muted">Explore the people, decisions, public resources and evidence connected to this place.</p></div>
      <span className="chip">{context.place?.kindLabel ?? "Country"} · {language}</span>
    </div>
    <div className="mt-4"><ShareExplorer path={path} state={state} language={language} /></div>
    <div className="mt-6 rounded-2xl border border-[var(--border-default)] bg-surface-sunken px-5 py-3 text-sm"><strong>Development demonstration.</strong> Invented holders, companies and financial records are fixtures, not a verified public register.</div>
    {state.view === "overview" ? <>
      {locality ? <section className="mt-6 grid items-start gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass card"><p className="kicker">Representation</p><h2 className="mt-2 font-display text-2xl">People serving this place</h2><ul className="mt-5 divide-y divide-[var(--border-default)]">{locality.officials.slice(0, 8).map((official) => <li key={official.holderId} className="py-3"><Link className="font-semibold text-link" href={explorerAt(path, { view: ExplorerView.LEADERS, entity: "leader", id: official.holderId, lang: state.lang })}>{official.personName}</Link><p className="mt-1 text-sm text-content-muted">{official.officeTitle} · {official.unitName ?? "Scope not recorded"}</p></li>)}</ul>{locality.officials.length === 0 ? <p className="mt-4 text-content-muted">No representatives are recorded.</p> : null}</div>
        <div className="glass card"><p className="kicker">Public procurement</p><h2 className="mt-2 font-display text-2xl">Recorded activity</h2><p className="num mt-5 text-5xl">{locality.procurement.count}</p><p className="mt-2 text-sm text-content-muted">Procurements in this place document. Coverage may be incomplete.</p><Link className="btn btn-ghost mt-5" href={explorerAt(path, { view: ExplorerView.PROCUREMENT, lang: state.lang })}>Inspect procurement →</Link>{locality.gaps.map((gap) => <p key={gap} className="mt-3 text-xs text-content-muted">{gap}</p>)}</div>
      </section> : null}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{explorerNavigation.filter((entry) => entry.view !== "overview" && entry.view !== "evidence").map((entry) => <Link key={entry.view} href={explorerAt(path, { view: entry.view, lang: state.lang })} className="glass card card-lift flex min-h-28 flex-col justify-between"><h2 className="font-display text-xl">{entry.label}</h2><span className="mt-3 text-sm text-link">Explore {title} →</span></Link>)}</div>
      {structure ? <div className="mt-10"><GovernanceStructure data={structure} path={path} state={state} placeName={title} compact /></div> : null}
    </> : <section className="glass card mt-6"><h2 className="font-display text-2xl">{heading} for {title}</h2><p className="mt-3 text-content-muted">This contextual view is being migrated to its composed screen contract. No unrelated country-wide dataset is substituted for missing local data.</p></section>}
  </PageFrame></>;
}
