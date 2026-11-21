/**
 * Government views of a place: the public institutions by arm of government (with one institution's page), and the
 * legal instruments held. The records are country-wide and held for Kenya, so other countries say so plainly.
 */
import { Suspense } from "react";
import { copy } from "@mzizi/copy";
import { Landmark, Scale, Users } from "lucide-react";
import Link from "#/components/navigation/demo-link";
import { PageHeader } from "#/components/ui/page-header";
import { Panel } from "#/components/ui/panel";
import { SkeletonPanel } from "#/components/ui/skeleton";
import { loadElections, loadInstitution, loadInstitutions, loadLaw, loadMotion, loadMotions } from "#/lib/server/views/government";
import { getCopy } from "#/lib/server/copy";

type T = Awaited<ReturnType<typeof getCopy>>;
/** The API sends these two fields in snake case although its contract names them in camel case; both are read until that is corrected. */
const held = (m: object): string => (m as { heldOn?: string; held_on?: string }).heldOn ?? (m as { held_on?: string }).held_on ?? "";
const mover = (m: object): string | null => (m as { movedBy?: string | null }).movedBy ?? (m as { moved_by?: string | null }).moved_by ?? null;
const note = (cls = "") => `rounded-lg border border-dashed border-muted p-3 text-sm text-muted sm:p-6 ${cls}`;
const date = (iso: string, language: string) => new Intl.DateTimeFormat(language, { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso));

export type GovernanceView = "institutions" | "law" | "parliament" | "elections";

export default async function PlaceGovernment({
  view,
  country,
  base,
  language,
  code,
}: {
  view: GovernanceView;
  country: string;
  base: string;
  language: string;
  code?: string;
}) {
  const t = await getCopy(language);
  const heads = {
    law: [t(copy.place.gov.law), t(copy.place.gov.lawIntro)],
    institutions: [t(copy.place.gov.institutions), t(copy.place.gov.institutionsIntro)],
    parliament: [t(copy.place.gov.parliament), t(copy.place.gov.parliamentIntro)],
    elections: [t(copy.place.gov.elections), t(copy.place.gov.electionsIntro)],
  } as const;
  const [title, intro] = heads[view];
  return (
    <>
      {!code && (
        <PageHeader eyebrow={t(copy.place.gov.eyebrow)} title={title}>
          {intro}
        </PageHeader>
      )}
      {country !== "ke" ? (
        <p className={note()}>{t(copy.place.gov.countryGap)}</p>
      ) : (
        <Suspense fallback={<SkeletonPanel height={420} />}>
          {view === "law" ? <Law t={t} language={language} /> : view === "elections" ? <Elections t={t} language={language} /> : view === "parliament" ? (code ? <Motion code={code} base={base} t={t} language={language} /> : <Motions base={base} t={t} language={language} />) : code ? <Institution code={code} base={base} t={t} language={language} /> : <Institutions base={base} t={t} language={language} />}
        </Suspense>
      )}
    </>
  );
}

async function Institutions({ base, t, language }: { base: string; t: T; language: string }) {
  const { data, failed } = await loadInstitutions();
  if (failed || !data) return <p className={note()}>{t(copy.place.gov.failed)}</p>;
  return (
    <div className="space-y-4">
      {language !== "en" && <p className="text-xs text-muted">{t(copy.place.gov.englishOnly)}</p>}
      {data.arms.map((arm) => (
        <Panel key={arm.code} id={arm.code} title={arm.label} note={t(copy.place.gov.bodies, { count: arm.count })} icon={Landmark}>
          <p className="mb-4 text-sm text-muted">{arm.about}</p>
          <div className="space-y-5">
            {arm.groups.map((g) => (
              <div key={g.kind.code}>
                <h3 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted">{g.kind.label}</h3>
                <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  {g.institutions.map((i) => (
                    <li key={i.code} className="min-w-0 rounded-md border border-line p-3">
                      <Link href={`${base}?view=institutions&view.id=${encodeURIComponent(i.code)}`} className="block font-medium text-accent hover:underline">
                        {i.name}
                      </Link>
                      {i.purpose && <p className="mt-1 text-sm text-muted">{i.purpose}</p>}
                      <p className="mt-2 text-xs text-muted">{i.leaders === 1 ? t(copy.place.gov.leadersOne) : t(copy.place.gov.leaders, { count: i.leaders })}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Panel>
      ))}
    </div>
  );
}

async function Institution({ code, base, t, language }: { code: string; base: string; t: T; language: string }) {
  const { data, failed } = await loadInstitution(code);
  if (failed || !data) return <p className={note()}>{t(copy.place.gov.failed)}</p>;
  const i = data.institution;
  return (
    <>
      <PageHeader eyebrow={`${i.arm.label} · ${i.kind.label}`} title={i.name}>
        {i.purpose}
      </PageHeader>
      <Link href={`${base}?view=institutions`} className="mb-4 inline-block text-sm font-medium text-accent">
        {t(copy.place.gov.back)}
      </Link>
      {language !== "en" && <p className="mb-3 text-xs text-muted">{t(copy.place.gov.englishOnly)}</p>}
      <div className="grid grid-cols-1 items-start gap-2 sm:gap-4 lg:grid-cols-2">
        <Panel id="leaders" title={t(copy.place.gov.leadersTitle)} icon={Users}>
          {data.leaders.length ? (
            <ul className="divide-y divide-line">
              {data.leaders.map((l) => (
                <li key={l.officeCode} className="py-2">
                  <div className="font-medium">{l.name}</div>
                  <div className="text-sm text-muted">
                    {l.tier.label}
                    {l.since ? ` · ${t(copy.place.gov.since, { date: date(l.since, language) })}` : ""}
                    {l.party ? ` · ${l.party}` : ""}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">{t(copy.place.gov.noBody)}</p>
          )}
        </Panel>
        <div className="grid min-w-0 gap-2 sm:gap-4">
          {i.functions.length > 0 && (
            <Panel id="functions" title={t(copy.place.gov.functions)}>
              <ul className="list-disc space-y-1 pl-5 text-sm">
                {i.functions.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Panel>
          )}
          {data.legalBasis.length > 0 && (
            <Panel id="basis" title={t(copy.place.gov.basis)} icon={Scale}>
              <ul className="space-y-3 text-sm">
                {data.legalBasis.map((b) => (
                  <li key={b.effectCode}>
                    <div className="font-medium">
                      {[b.effect, [b.designation, b.instrument].filter(Boolean).join(", ")].filter(Boolean).join(": ")}
                    </div>
                    <div className="text-muted">{b.heading}</div>
                  </li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>
    </>
  );
}

async function Law({ t, language }: { t: T; language: string }) {
  const { data, failed } = await loadLaw();
  if (failed || !data) return <p className={note()}>{t(copy.place.gov.failed)}</p>;
  return (
    <Panel id="instruments" title={t(copy.place.gov.law)} icon={Scale}>
      <ul className="divide-y divide-line">
        {data.instruments.map((x) => (
          <li key={x.code} className="py-3">
            <div className="font-medium">{x.name}</div>
            <div className="text-sm text-muted">
              {x.kindLabel}
              {x.enactedOn ? ` · ${t(copy.place.gov.enacted, { date: date(x.enactedOn, language) })}` : ""} · {t(copy.place.gov.provisions, { count: x.provisions })}
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">{t(copy.place.gov.lawGap)}</p>
    </Panel>
  );
}

async function Motions({ base, t, language }: { base: string; t: T; language: string }) {
  const { data, failed } = await loadMotions();
  if (failed || !data) return <p className={note()}>{t(copy.place.gov.failed)}</p>;
  return (
    <Panel id="motions" title={t(copy.place.gov.parliament)} note={t(copy.place.gov.bodies, { count: data.motions.length })} icon={Landmark}>
      <ul className="divide-y divide-line">
        {data.motions.map((m) => (
          <li key={m.code} className="py-3">
            <Link href={`${base}?view=parliament&view.id=${encodeURIComponent(m.code)}`} className="font-medium text-accent hover:underline">
              {m.title}
            </Link>
            <p className="mt-1 text-sm text-muted">{m.summary}</p>
            <p className="mt-1 text-xs text-muted">
              {m.institution} · {date(held(m), language)} · {m.outcome === "passed" ? t(copy.place.gov.passed) : t(copy.place.gov.failed2)} · {t(copy.place.gov.yes)} {m.yes} · {t(copy.place.gov.no)} {m.no}
            </p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

async function Motion({ code, base, t, language }: { code: string; base: string; t: T; language: string }) {
  const { data, failed } = await loadMotion(code);
  if (failed || !data) return <p className={note()}>{t(copy.place.gov.failed)}</p>;
  const m = data.motion;
  const tl = data.tally;
  return (
    <>
      <Link href={`${base}?view=parliament`} className="mb-4 inline-block text-sm font-medium text-accent">
        {t(copy.place.gov.allMotions)}
      </Link>
      <h2 className="font-display text-2xl">{m.title}</h2>
      <p className="mt-2 text-sm text-muted">
        {m.institution} · {date(held(m), language)}
        {mover(m) ? ` · ${t(copy.place.gov.movedBy, { name: mover(m) as string })}` : ""}
      </p>
      <p className="mt-2 max-w-2xl">{m.summary}</p>
      <div className="mt-4 grid grid-cols-1 items-start gap-2 sm:gap-4 lg:grid-cols-2">
        <Panel id="tally" title={t(copy.place.gov.tally)} note={tl.passed ? t(copy.place.gov.passed) : t(copy.place.gov.failed2)}>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            {([["yes", tl.yes], ["no", tl.no], ["abstain", tl.abstain], ["absent", tl.absent]] as const).map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{t(copy.place.gov[k])}</dt>
                <dd className="font-display text-2xl">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
        {data.parties.length > 0 && (
          <Panel id="parties" title={t(copy.place.gov.byParty)}>
            <ul className="divide-y divide-line text-sm">
              {data.parties.map((p) => (
                <li key={p.party} className="py-2">
                  <div className="font-medium">{p.party}</div>
                  <div className="text-muted">
                    {t(copy.place.gov.yes)} {p.yes} · {t(copy.place.gov.no)} {p.no} · {t(copy.place.gov.abstain)} {p.abstain} · {t(copy.place.gov.absent)} {p.absent}
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        )}
      </div>
    </>
  );
}

async function Elections({ t, language }: { t: T; language: string }) {
  const { data, failed } = await loadElections();
  if (failed || !data) return <p className={note()}>{t(copy.place.gov.failed)}</p>;
  return (
    <Panel id="elections" title={t(copy.place.gov.elections)} icon={Users}>
      <ul className="divide-y divide-line">
        {data.elections.map((e) => (
          <li key={e.code} className="py-3">
            <div className="font-medium">
              {e.year} · {t(copy.place.gov.electionLine, { kind: e.kind, date: date(e.heldOn, language) })}
            </div>
            <div className="text-sm text-muted">
              {e.winner ? t(copy.place.gov.electionWinner, { name: `${(e.winner as { name: string }).name} (${(e.winner as { party: string }).party})` }) : t(copy.place.gov.electionNone)}
              {e.registeredVoters ? ` · ${t(copy.place.gov.registered, { count: new Intl.NumberFormat(language).format(e.registeredVoters) })}` : ""}
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
