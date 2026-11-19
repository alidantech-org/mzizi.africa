/** Route `/procurement/tenders`: tenders and contracts — open, closed, awarded and complete — with suppliers and how much each discloses. */
import Link from "next/link";
import { T } from "#/lib/site/i18n.tsx";

import { Loaded } from "#/components/site/loaded.tsx";
import { Breadcrumbs, Gaps, PageFrame, Pill, Stat } from "#/components/site/ui/primitives.tsx";
import { statusTone } from "#/components/site/ui/status.ts";
import { date, n, words } from "#/lib/site/format.ts";
import { Money } from "#/lib/site/country.tsx";
import { tenders } from "#/lib/site/insights.ts";

const STATUSES = ["", "open", "closed", "evaluation", "awarded", "complete"];

export const dynamic = "force-dynamic";

export default async function TendersRoute({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status = "" } = await searchParams;
  return (
    <PageFrame wide>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tenders" }]} />
      <p className="kicker">Public procurement</p>
      <h1 className="hero-title text-4xl sm:text-5xl"><T>{"Tenders & contracts"}</T></h1>
      <p className="mt-2 max-w-2xl text-content-muted"><T>{"What public bodies are buying, who is bidding, who won and for how much. Each row shows how much of the basic information was published, so gaps in transparency are visible."}</T></p>
      <Loaded read={() => tenders(status || undefined)}>
        {(d) => (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Tenders on record" value={n(d.summary.total)} />
              {d.summary.byStatus.slice(0, 3).map((s) => <Stat key={s.status} label={words(s.status)} value={n(s.count)} hint={s.valueKes ? <><Money value={s.valueKes} /> in contracts</> : undefined} />)}
            </div>
            <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Status">
              {STATUSES.map((s) => <Link key={s || "all"} role="tab" aria-selected={status === s} href={s ? `/procurement/tenders?status=${s}` : "/procurement/tenders"} className="tab" data-active={status === s}>{s ? words(s) : "All"}</Link>)}
            </div>
            <div className="glass card mt-4 overflow-x-auto">
              <table className="table-clean">
                <thead><tr><th>Tender</th><th>Buyer</th><th>Status</th><th>Closes</th><th>Supplier</th><th>Value</th><th>Disclosed</th></tr></thead>
                <tbody>{d.tenders.map((t) => (
                  <tr key={t.code}>
                    <td className="max-w-xs"><span className="block truncate font-semibold">{t.title}</span><span className="text-xs text-content-muted">{t.reference ?? "no reference"}{t.place ? ` · ${t.place}` : ""} · {words(t.procedure)}</span></td>
                    <td>{t.buyer ?? "—"}</td><td><Pill tone={statusTone(t.status)}>{words(t.status ?? "unknown")}</Pill></td><td>{date(t.closes_on)}</td>
                    <td>{t.supplier ?? <span className="text-content-muted">not published</span>}</td><td className="num"><Money value={t.amount} /></td>
                    <td><span title={`${t.disclosed} of ${t.disclosedOf} basic details published`} className="inline-flex gap-0.5">{Array.from({ length: t.disclosedOf }, (_, i) => <i key={i} className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: i < t.disclosed ? "var(--raffia)" : "var(--border-default)" }} />)}</span></td>
                  </tr>))}</tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-content-muted">Showing {d.tenders.length}. The dots count published: advertised date, closing date, reference and a signed contract.</p>
            <Gaps items={d.gaps} topic="tenders and contracts" />
          </>
        )}
      </Loaded>
    </PageFrame>
  );
}
