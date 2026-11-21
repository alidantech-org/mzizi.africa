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
import { loadInstitution, loadInstitutions, loadLaw } from "#/lib/server/views/government";
import { getCopy } from "#/lib/server/copy";

type T = Awaited<ReturnType<typeof getCopy>>;
const note = (cls = "") => `rounded-lg border border-dashed border-muted p-3 text-sm text-muted sm:p-6 ${cls}`;
const date = (iso: string, language: string) => new Intl.DateTimeFormat(language, { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso));

export type GovernanceView = "institutions" | "law";

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
  const title = view === "law" ? t(copy.place.gov.law) : code ? "" : t(copy.place.gov.institutions);
  const intro = view === "law" ? t(copy.place.gov.lawIntro) : t(copy.place.gov.institutionsIntro);
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
          {view === "law" ? <Law t={t} language={language} /> : code ? <Institution code={code} base={base} t={t} language={language} /> : <Institutions base={base} t={t} language={language} />}
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
