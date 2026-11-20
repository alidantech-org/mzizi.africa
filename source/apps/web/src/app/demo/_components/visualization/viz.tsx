/** Server-rendered, theme-aware visual parts: tile map, bullet bars, scale legend, countdown. */
import Link from "#demo/_components/navigation/demo-link";
import { tilePositions } from "#demo/_data/demo";
import { countyShapes } from "#demo/_data/places";
import { steps, stepFor } from "#demo/_lib/charts/scale";

export function ScaleLegend({ low = "Fewer", high = "More" }: { low?: string; high?: string }) {
  return (
    <div className="mt-3 flex items-center gap-1.5 font-mono text-[11px] text-muted">
      <span>{low}</span>
      {steps.map((s) => (
        <span key={s} className="h-2.5 w-8 first:rounded-l-full last:rounded-r-full" style={{ background: s }} />
      ))}
      <span>{high}</span>
    </div>
  );
}

/** One tile per county. Geographic order, equal size, so small counties stay visible. */
export function TileMap({ values, format = String }: { values: Record<string, number>; format?: (n: number) => string }) {
  const pos = tilePositions();
  const nums = Object.values(values);
  const [min, max] = [Math.min(...nums), Math.max(...nums)];
  return (
    <div className="grid grid-cols-8 gap-1.5">
      {countyShapes.shapes.map((s) => {
        const p = pos.get(s.code)!;
        const v = values[s.code];
        const dark = (v - min) / (max - min || 1) > 0.55;
        return (
          <Link
            key={s.code}
            href={`/ke/${s.code.replace(/^ke\./, "")}`}
            title={`${s.name}: ${format(v)}`}
            style={{ gridColumn: p.col + 1, gridRow: p.row + 1, background: stepFor(v, min, max) }}
            className={`flex aspect-square flex-col justify-end rounded-lg p-1.5 text-[10px] leading-tight transition  sm:text-[11px] ${dark ? "text-paper" : "text-ink"}`}
          >
            <span className="truncate font-medium">{s.name}</span>
            <span className="font-mono opacity-80">{format(v)}</span>
          </Link>
        );
      })}
    </div>
  );
}

/** Bar with a national-figure tick. Orange-toned when below the tick (better === high). */
export function MarkerBar({
  label,
  value,
  national,
  better = "high",
  suffix = "%",
}: {
  label: string;
  value: number;
  national: number;
  better?: "high" | "low";
  suffix?: string;
}) {
  const good = better === "high" ? value >= national : value <= national;
  const diff = Math.abs(Math.round(value - national));
  return (
    <div className="grid grid-cols-[110px_1fr_auto] items-center gap-3 sm:grid-cols-[150px_1fr_auto]">
      <span className="truncate text-sm">{label}</span>
      <div className="relative h-3 rounded-full bg-line">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: good ? "var(--c2)" : "var(--c1)" }} />
        <div className="absolute -top-1 h-5 w-0.5 bg-ink" style={{ left: `${national}%` }} />
      </div>
      <span className="text-right font-mono text-sm">
        {value}
        {suffix}
        <span className="ml-2 hidden text-xs text-muted sm:inline">
          {diff} pts {good ? "above" : "below"}
        </span>
      </span>
    </div>
  );
}

export function BarRow({
  label,
  value,
  max,
  text,
  tone = "var(--c2)",
}: {
  label: string;
  value: number;
  max: number;
  text: string;
  tone?: string;
}) {
  return (
    <div className="grid grid-cols-[96px_1fr_auto] items-center gap-3">
      <span className="truncate text-sm">{label}</span>
      <div className="h-2.5 rounded-full bg-line">
        <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: tone }} />
      </div>
      <span className="w-14 text-right font-mono text-sm">{text}</span>
    </div>
  );
}
