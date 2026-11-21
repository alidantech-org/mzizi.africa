/**
 * Money views of a place: the finance view (fund allocations, spending by kind and year, the projects paid for) and the
 * tenders view (public tenders and who won them). Civic delivery is read for the place in the address; tenders are
 * country-wide and say so.
 */
import { Suspense } from "react";
import { Coins, FolderKanban, Gavel } from "lucide-react";
import { copy } from "@mzizi/copy";
import Link from "#/components/navigation/demo-link";
import { ShareBars } from "#/components/place/share-bars";
import { PageHeader } from "#/components/ui/page-header";
import { Kpi, Panel } from "#/components/ui/panel";
import { SkeletonPanel } from "#/components/ui/skeleton";
import { compact, pct } from "#/lib/formatting/format";
import { getCopy } from "#/lib/server/copy";
import { loadCivic, loadTenders } from "#/lib/server/views/money";
import type { PlaceAddress } from "#/lib/server/views/place-home";

type T = Awaited<ReturnType<typeof getCopy>>;
const note = "rounded-lg border border-dashed border-muted p-3 text-sm text-muted sm:p-6";
const ksh = (v: number, language: string) => `KSh ${compact(v, language)}`;
const date = (iso: string, language: string) => new Intl.DateTimeFormat(language, { dateStyle: "medium", timeZone: "UTC" }).format(new Date(iso));

const statusKeys = {
  open: copy.place.money.statusOpen,
  awarded: copy.place.money.statusAwarded,
  complete: copy.place.money.statusComplete,
  completed: copy.place.money.statusCompleted,
  planned: copy.place.money.statusPlanned,
  ongoing: copy.place.money.statusOngoing,
} as const;
const statusLabel = (t: T, s: string) => (s in statusKeys ? t(statusKeys[s as keyof typeof statusKeys]) : t(copy.place.money.statusUnknown, { status: s }));

export default async function PlaceMoney({
  view,
  address,
  language,
  status,
}: {
  view: "finance" | "suppliers";
  address: PlaceAddress;
  language: string;
  status?: string;
}) {
  const t = await getCopy(language);
  const base = `/${[address.country, ...address.trail].join("/")}`;
  return (
    <>
      <PageHeader eyebrow={t(copy.place.money.eyebrow)} title={view === "finance" ? t(copy.place.money.finance) : t(copy.place.money.tenders)}>
        {view === "finance" ? t(copy.place.money.financeIntro) : t(copy.place.money.tendersIntro)}
      </PageHeader>
      <Suspense fallback={<SkeletonPanel height={420} />}>
        {view === "finance" ? <Finance address={address} t={t} language={language} /> : <Tenders base={base} status={status} t={t} language={language} />}
      </Suspense>
    </>
  );
}

async function Finance({ address, t, language }: { address: PlaceAddress; t: T; language: string }) {
  const { data, failed } = await loadCivic(address, language);
  if (failed || !data) return <p className={note}>{t(copy.place.gov.failed)}</p>;
  const total = data.years.reduce((a, y) => a + y.total, 0);
  const kinds = [...data.classes].sort((a, b) => b.amount - a.amount);
  const kindTotal = kinds.reduce((a, c) => a + c.amount, 0) || 1;
  const rows = kinds.slice(0, 10).map((c) => ({ label: c.label, share: c.amount / kindTotal }));
  const projects = data.projects.slice(0, 25);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-4">
        <Kpi label={t(copy.place.money.total)} value={ksh(total, language)} delta={data.fund ? t(copy.place.money.managedBy, { name: data.fund.managedBy ?? "" }) : ""} tone="c1" icon={Coins} />
        <Kpi label={t(copy.place.money.projects)} value={String(data.projects.length)} delta="" tone="c2" icon={FolderKanban} />
        <Kpi label={t(copy.place.money.byYear)} value={String(data.years.length)} delta={data.years.length ? `${Math.min(...data.years.map((y) => y.year))}–${Math.max(...data.years.map((y) => y.year))}` : ""} tone="c3" icon={Gavel} />
      </div>
      {!data.fund && data.years.length === 0 && <p className={note}>{t(copy.place.money.noFunds)}</p>}
      <div className="grid grid-cols-1 items-start gap-2 sm:gap-4 lg:grid-cols-2">
        {rows.length > 0 && (
          <Panel id="kinds" title={t(copy.place.money.spendingByKind)}>
            <ShareBars rows={rows} format={(s) => pct(s * 100, language)} label={t(copy.place.money.spendingByKind)} />
          </Panel>
        )}
        {data.years.length > 0 && (
          <Panel id="years" title={t(copy.place.money.byYear)}>
            <table className="w-full text-sm">
              <tbody>
                {[...data.years].sort((a, b) => b.year - a.year).map((y) => (
                  <tr key={y.year} className="border-t border-line first:border-t-0">
                    <td className="py-2">{y.year}</td>
                    <td className="py-2 text-right tabular-nums">{ksh(y.total, language)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
        )}
      </div>
      {projects.length > 0 && (
        <Panel id="projects" title={t(copy.place.money.projectsTitle)} note={t(copy.place.money.shownOf, { shown: projects.length, total: data.projects.length })} icon={FolderKanban}>
          <ul className="divide-y divide-line">
            {projects.map((p) => (
              <li key={p.code} className="py-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-muted">
                  {statusLabel(t, p.status)} · {p.unit}
                  {p.startedOn ? ` · ${t(copy.place.money.started, { date: date(p.startedOn, language) })}` : ""}
                  {p.amount ? ` · ${ksh(p.amount, language)}` : ""}
                </div>
                <div className="text-xs text-muted">{p.contractor ? `${t(copy.place.money.contractor)}: ${p.contractor}` : t(copy.place.money.noContractor)}</div>
              </li>
            ))}
          </ul>
        </Panel>
      )}
      {data.gaps.map((g) => (
        <p key={g} className="text-xs text-muted">
          {g}
        </p>
      ))}
    </div>
  );
}

async function Tenders({ base, status, t, language }: { base: string; status?: string; t: T; language: string }) {
  const { data, failed } = await loadTenders(status);
  if (failed || !data) return <p className={note}>{t(copy.place.gov.failed)}</p>;
  const tabs = [{ code: "", label: t(copy.place.money.tendersAll), count: data.summary.total }, ...data.summary.byStatus.map((s) => ({ code: s.status, label: statusLabel(t, s.status), count: s.count }))];
  return (
    <>
      <nav className="mb-4 flex flex-wrap gap-1 sm:gap-2">
        {tabs.map((x) => (
          <Link
            key={x.code || "all"}
            href={x.code ? `${base}?view=suppliers&status=${x.code}` : `${base}?view=suppliers`}
            aria-current={(status ?? "") === x.code ? "true" : undefined}
            className={`rounded-md border px-2 py-1 text-sm ${(status ?? "") === x.code ? "border-accent bg-accent-soft font-medium text-ink" : "border-line text-muted hover:bg-accent-soft"}`}
          >
            {x.label} · {x.count}
          </Link>
        ))}
      </nav>
      <Panel id="tenders" title={t(copy.place.money.tenders)} note={t(copy.place.money.tendersCount, { count: data.tenders.length })} icon={Gavel}>
        <ul className="divide-y divide-line">
          {data.tenders.map((x) => (
            <li key={x.code} className="py-3">
              <div className="font-medium">{x.title.startsWith("civ.prc.") ? t(copy.place.money.unnamed) : x.title}</div>
              <div className="text-sm text-muted">
                {statusLabel(t, x.status)} · {x.buyer}
                {x.place ? ` · ${x.place}` : ""}
                {x.closesOn ? ` · ${t(copy.place.money.closes, { date: date(x.closesOn, language) })}` : ""}
              </div>
              <div className="text-xs text-muted">
                {x.supplier ? t(copy.place.money.supplier, { name: x.supplier }) : t(copy.place.money.notAwarded)}
                {x.amount ? ` · ${t(copy.place.money.amount, { amount: ksh(x.amount, language) })}` : ""}
                {x.bids ? ` · ${t(copy.place.money.bids, { count: x.bids })}` : ""}
                {` · ${t(copy.place.money.disclosure, { shown: x.disclosed, of: x.disclosedOf })}`}
              </div>
            </li>
          ))}
        </ul>
      </Panel>
      {data.gaps.map((g) => (
        <p key={g} className="mt-2 text-xs text-muted">
          {g}
        </p>
      ))}
    </>
  );
}
