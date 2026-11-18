"use client";

/** An indicator mapped across the units under a place, with a ranked list beside it. Used by statistics and the rankings pages. */
import Link from "next/link";
import { useMemo } from "react";

import { ChoroplethLazy } from "#/components/site/map/choropleth-lazy.tsx";
import { n1, short } from "#/lib/site/format.ts";
import type { IndicatorMap } from "#/lib/site/insights.ts";
import { rampFill } from "#/lib/site/ramp.ts";

export function StatMap({ data, onSelect, height = 440, drill }: { data: IndicatorMap; onSelect?: (id: string) => void; height?: number; drill?: (id: string) => string }) {
  const unit = data.indicator.unit ?? "";
  const values = data.units.map((u) => u.value).filter((v): v is number => v !== null);
  const regions = useMemo(() => {
    const sorted = [...values].sort((a, b) => a - b);
    const pos = (v: number) => (sorted.length < 2 ? 0.5 : sorted.findIndex((x) => x >= v) / (sorted.length - 1));
    return data.units.map((u) => ({
      featureId: u.featureId, name: u.name, geometry: u.geometry,
      fill: u.value === null ? "oklch(0.85 0.01 60)" : rampFill(pos(u.value)),
      tooltip: u.value === null ? "No figure" : `${short(u.value)} ${unit}${u.rank ? ` · #${u.rank}` : ""}`,
    }));
  }, [data, unit, values]);
  const lo = values.length ? Math.min(...values) : null;
  const hi = values.length ? Math.max(...values) : null;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
      <div>
        <ChoroplethLazy regions={regions} onSelect={onSelect} height={height} />
        <div className="mt-3 flex items-center gap-3 text-xs text-content-muted" aria-label="Colour scale">
          <span className="num">{short(lo)}</span>
          <div className="h-2.5 flex-1 rounded-full" style={{ background: `linear-gradient(90deg, ${rampFill(0)}, ${rampFill(0.5)}, ${rampFill(1)})` }} />
          <span className="num">{short(hi)} {unit}</span>
        </div>
      </div>
      <ol className="glass card max-h-[34rem] space-y-1 overflow-auto p-2" aria-label="Ranking">
        {data.units.filter((u) => u.value !== null).map((u) => (
          <li key={u.featureId}>
            <Link href={drill ? drill(u.featureId) : `/statistics/${u.featureId}`} className="grid grid-cols-[2rem_1fr_auto] items-center gap-2 rounded-xl px-2 py-1.5 text-sm hover:bg-surface-sunken">
              <span className="num text-xs text-content-muted">{u.rank}</span>
              <span className="truncate">{u.name}</span>
              <span className="num font-semibold">{u.value !== null && u.value > 1000 ? short(u.value) : n1(u.value)}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
