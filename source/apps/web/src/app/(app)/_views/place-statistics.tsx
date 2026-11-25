/** Statistics of a place: every figure to show, and (at country level) a ranking of its first-level places. */
import { ChartColumn, Trophy } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Panel } from "#/components/ui/panel";
import { PageHeader } from "#/components/ui/page-header";
import { SkeletonPanel } from "#/components/ui/skeleton";
import { hrefOf, type PlaceAddress } from "#/lib/server/codes";
import { loadPlace, loadRanking } from "#/lib/server/views/place-home";
import { formatValue, Text } from "#/app/(app)/_views/text";

async function Ranking({ country, indicator, language }: { country: string; indicator: string; language: string }) {
  const { data } = await loadRanking(country, indicator, language);
  if (!data || data.rows.length === 0) return <p className="text-sm text-muted">No comparable figures for this indicator.</p>;
  return (
    <ol className="grid gap-1 text-sm">
      {data.rows.map((r) => (
        <li key={r.place} className="flex justify-between gap-4 border-b border-line py-1">
          <span>
            <span className="mr-2 font-mono text-muted">{r.rank ?? "–"}</span>
            <Link href={hrefOf(r.place)} className="hover:underline">
              <Text value={r.name} />
            </Link>
          </span>
          <span>{formatValue(r.value, 0, language)}</span>
        </li>
      ))}
    </ol>
  );
}

export default async function PlaceStatistics({
  address,
  language,
  topic,
  indicator,
}: {
  address: PlaceAddress;
  language: string;
  topic?: string;
  indicator?: string;
}) {
  const { data } = await loadPlace(address, language);
  if (!data) return <PageHeader eyebrow="Statistics" title="This place could not be loaded" />;
  const figures = topic ? data.figures.filter((f) => f.indicator.includes(topic)) : data.figures;
  const chosen = data.figures.find((f) => f.indicator === indicator) ?? data.figures[0];
  return (
    <div className="grid gap-6">
      <PageHeader eyebrow="Statistics" title={data.place.name.text}>
        The latest published figure for each indicator; status shows when a figure is not final.
      </PageHeader>
      <Panel id="figures" title="All figures" icon={ChartColumn} note={`${figures.length} indicators`}>
        <table className="w-full text-sm">
          <thead className="text-left font-mono text-[11px] uppercase tracking-widest text-muted">
            <tr>
              <th className="py-2">Indicator</th>
              <th>Year</th>
              <th className="text-right">Value</th>
              <th className="text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {figures.map((f) => (
              <tr key={f.indicator} className="border-t border-line">
                <td className="py-1.5">
                  {address.trail.length === 0 ? (
                    <Link href={`?view=statistics&view.indicator=${encodeURIComponent(f.indicator)}#ranking`} scroll={false} className="hover:underline">
                      <Text value={f.label} />
                    </Link>
                  ) : (
                    <Text value={f.label} />
                  )}
                </td>
                <td>{f.fromYear === f.toYear || !f.toYear ? f.fromYear : `${f.fromYear}–${f.toYear}`}</td>
                <td className="text-right">
                  {formatValue(f.value, f.decimals, language)} {f.unit}
                </td>
                <td className="text-right text-muted">{f.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
      {address.trail.length === 0 && chosen && (
        <Panel id="ranking" title="Ranking" icon={Trophy} note={chosen.label.text}>
          <Suspense key={chosen.indicator} fallback={<SkeletonPanel height={600} />}>
            <Ranking country={address.country} indicator={chosen.indicator} language={language} />
          </Suspense>
        </Panel>
      )}
    </div>
  );
}
