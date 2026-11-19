/** Governance presentation over generated screen documents. Relationship semantics stay in the API. */
import Link from "next/link";
import type { StructureStructureDocument } from "@mzizi/api-client/types/structure/structure-document.ts";
import { ExplorerView } from "#/lib/types/explorer-view.enum.ts";
import type { ExplorerAddress } from "#/lib/types/explorer-address.ts";
import { explorerAt } from "#/lib/dryv/explorer-address.ts";
import { PageFrame } from "#/components/site/ui/primitives.tsx";

interface GovernanceStructureProps {
  data: StructureStructureDocument | null;
  path: string;
  state: ExplorerAddress;
  placeName: string;
  compact?: boolean;
}

export function GovernanceStructure({ data, path, state, placeName, compact = false }: GovernanceStructureProps) {
  if (!data) return <PageFrame><h1 className="font-display text-3xl">Governance structure</h1><p role="status" className="mt-4">The structure document could not be loaded. No seat counts or relationships have been inferred.</p></PageFrame>;
  const selected = data.institutions.flatMap((body) => body.positions).find((position) => position.id === state.id || position.code === state.id);
  if (state.entity === "position" && !selected) return <PageFrame><h1 className="font-display text-3xl">Position not found in this country</h1><p role="alert" className="mt-4">The supplied identity does not identify a recorded position in this structure. No other record has been selected.</p><Link className="btn btn-ghost mt-5" href={explorerAt(path, { view: state.view, lang: state.lang })}>Return to the structure</Link></PageFrame>;
  const view = state.view === ExplorerView.OVERVIEW ? ExplorerView.LEADERS : state.view;
  const groups = new Map<string, StructureStructureDocument["institutions"]>();
  for (const body of data.institutions) {
    const key = body.arm ?? body.kind;
    const members = groups.get(key) ?? [];
    members.push(body);
    groups.set(key, members);
  }
  const contents = <>
    {!compact ? <header className="mb-6"><p className="kicker">{placeName} · Governance</p><h1 className="hero-title mt-2 text-4xl sm:text-5xl">Who holds power, and how?</h1><p className="mt-3 max-w-3xl text-content-muted">National structure for {data.countryName}. These records describe formal positions and legal powers; they do not establish a reporting relationship or prove local applicability.</p></header> : <h2 className="font-display text-3xl">Public institutions and positions</h2>}
    <p className="mb-3 text-xs text-content-muted">Names and source labels are shown in their recorded language. Interface language selection does not translate the evidence.</p>
    <p className="mb-4 rounded-xl border border-[var(--border-default)] bg-surface-sunken px-4 py-3 text-sm">Development proof: demonstration records and seat rules are synthetic. Recorded counts are coverage, not a verified complete register.</p>
    <div className="mb-6 mt-4 flex flex-wrap gap-2" aria-label="Structure presentation">{["tree", "matrix", "list"].map((mode) => <Link key={mode} href={explorerAt(path, { ...state, view, mode })} className="tab capitalize" aria-current={(state.mode ?? "tree") === mode ? "page" : undefined}>{mode}</Link>)}</div>
    <div className="mb-6 grid gap-3 sm:grid-cols-3"><div className="glass card"><p className="text-xs text-content-muted">Recorded institutions</p><p className="num mt-2 text-3xl">{data.institutions.length}</p></div><div className="glass card"><p className="text-xs text-content-muted">Position definitions</p><p className="num mt-2 text-3xl">{data.institutions.reduce((sum, body) => sum + body.positions.length, 0)}</p></div><div className="glass card"><p className="text-xs text-content-muted">Recorded procedures</p><p className="num mt-2 text-3xl">{data.procedures.length}</p></div></div>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="min-w-0 space-y-3" aria-label="Institutions and positions">
        {data.institutions.length === 0 ? <p className="glass card">No structure records are available for this country.</p> : null}
        {[...groups].slice(0, compact ? 2 : undefined).map(([group, bodies]) => <details key={group} className="rounded-2xl border border-[var(--border-default)] bg-surface-sunken p-3" open={bodies.some((body) => body.positions.some((position) => position.id === selected?.id))}>
          <summary className="cursor-pointer px-2 py-3"><strong className="font-display text-2xl">{group}</strong><span className="ml-3 text-xs text-content-muted">{bodies.length} recorded bodies</span></summary>
          <div className="mt-2 space-y-2">{bodies.map((body) => <details key={body.id} className="glass overflow-hidden rounded-2xl border border-[var(--border-default)]" open={state.mode === "list" || body.positions.some((position) => position.id === selected?.id)}>
          <summary className="cursor-pointer px-5 py-4"><strong className="font-display text-xl">{body.names[0]?.name ?? body.code}</strong><span className="ml-3 text-xs text-content-muted">{body.arm ?? body.kind} · {body.positions.length} recorded position types</span></summary>
          <div className="border-t border-[var(--border-default)] px-3 py-2">
            {body.positions.length === 0 ? <p className="p-3 text-sm text-content-muted">Positions have not been recorded.</p> : null}
            {body.positions.map((position) => <Link key={position.id} href={explorerAt(path, { ...state, view, entity: "position", id: position.code })} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-xl px-3 py-3 hover:bg-surface-sunken">
              <span><strong className="block">{position.title}</strong><span className="text-xs text-content-muted">{position.role} · {position.selectionLabel}</span></span>
              <span className="text-right"><strong className="num block">{position.fixedSeats ?? "—"}</strong><span className="text-xs text-content-muted">{position.seatBasisLabel}</span></span>
            </Link>)}
          </div>
        </details>)}</div></details>)}
      </section>
      <aside className="glass card xl:sticky xl:top-20" aria-label="Selected position">
        <p className="kicker">{selected ? "Selected position" : "Read the structure"}</p>
        <h2 className="mt-2 font-display text-2xl">{selected?.title ?? "Select a position"}</h2>
        {selected ? <>
          <dl className="mt-5 space-y-4 text-sm">
            <div><dt className="text-content-muted">How the seat is filled</dt><dd className="mt-1 font-semibold">{selected.selectionLabel}</dd></div>
            <div><dt className="text-content-muted">Seat rule</dt><dd>{selected.seatBasisLabel}{selected.fixedSeats !== null ? ` · ${selected.fixedSeats}` : ""}</dd></div>
            <div><dt className="text-content-muted">Recorded seats</dt><dd>{selected.offices.length} returned in this document; missing records do not prove vacancies.</dd></div>
            <div><dt className="text-content-muted">Term</dt><dd>{selected.termYears === null ? "Not recorded" : `${selected.termYears} years`}{selected.termLimit ? ` · maximum ${selected.termLimit} terms` : ""}</dd></div>
          </dl>
          <h3 className="mt-6 font-semibold">Formal powers</h3>
          <ul className="mt-2 space-y-2 text-sm">{selected.powers.map((power) => <li key={power.id} className="rounded-xl bg-surface-sunken p-3"><strong>{power.kind}</strong>{power.step !== null ? ` · procedure step ${power.step}` : ""}<p className="mt-1 text-xs text-content-muted">{power.binding ? "Binding duty" : "Discretionary power"} · {power.citationId ? "Citation recorded" : "Evidence not recorded"}</p></li>)}</ul>
          {selected.powers.length === 0 ? <p className="mt-2 text-sm text-content-muted">No formal powers have been recorded for this position.</p> : null}
        </> : <p className="mt-4 text-sm text-content-muted">Positions describe a seat rule. Individual seats and their holders are separate records. Appointment, approval, oversight and removal must not be collapsed into “reports to”.</p>}
      </aside>
    </div>
    {state.mode === "matrix" ? <section className="glass card mt-8"><h2 className="font-display text-2xl">How positions are filled</h2><div className="mt-4 overflow-x-auto"><table className="table-clean"><thead><tr><th>Institution grouping</th><th>Position</th><th>Selection method</th><th>Seat rule</th></tr></thead><tbody>{[...groups].flatMap(([group, bodies]) => bodies.flatMap((body) => body.positions.map((position) => <tr key={position.id}><td>{group}</td><th>{position.title}</th><td>{position.selectionLabel}</td><td>{position.seatBasisLabel}{position.fixedSeats !== null ? ` · ${position.fixedSeats}` : ""}</td></tr>)))}</tbody></table></div></section> : null}
    {!compact ? <section className="glass card mt-8"><h2 className="font-display text-2xl">Who handles what?</h2><p className="mt-2 text-sm text-content-muted">Responsibilities are recorded separately from institutional hierarchy.</p><div className="mt-4 overflow-x-auto"><table className="table-clean"><thead><tr><th>Function</th><th>Responsibility</th><th>Evidence</th></tr></thead><tbody>{data.functions.map((fn) => <tr key={fn.id}><td>{fn.code}</td><td>{fn.assignments.map((a) => a.share).join(" · ") || "Not recorded"}</td><td>{fn.citationId ? "Citation recorded" : "Not recorded"}</td></tr>)}</tbody></table></div>{data.functions.length === 0 ? <p className="mt-3 text-sm text-content-muted">Function assignments have not been recorded.</p> : null}</section> : null}
  </>;
  return compact ? contents : <PageFrame wide>{contents}</PageFrame>;
}
