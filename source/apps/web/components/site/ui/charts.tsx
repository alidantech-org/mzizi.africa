"use client";

/** Small SVG charts drawn from the theme's colours: no chart library, every one readable with a text alternative. */
import { ksh, n, n1, pct, short } from "#/lib/site/format.ts";

const FORMATS = { n, short, ksh: (v: number) => ksh(v), pct: (v: number) => pct(v) } as const;
/** The number styles a bar list can show: named so a server page can ask for one without passing a function. */
export type BarFormat = keyof typeof FORMATS;

export function Sparkline({ points, height = 56, width = 220, label }: { points: readonly number[]; height?: number; width?: number; label: string }) {
  if (points.length < 2) return null;
  const min = Math.min(...points);
  const max = Math.max(...points);
  const span = max - min || 1;
  const step = width / (points.length - 1);
  const xy = points.map((v, i) => [i * step, height - 6 - ((v - min) / span) * (height - 12)] as const);
  const line = xy.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${width},${height} L0,${height} Z`;
  const last = xy[xy.length - 1]!;
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${width} ${height}`} className="h-14 w-full overflow-visible">
      <defs>
        <linearGradient id="spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="var(--clay)" stopOpacity="0.35" />
          <stop offset="1" stopColor="var(--clay)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={line} fill="none" stroke="var(--clay)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="4" fill="var(--clay)" stroke="var(--cream)" strokeWidth="2" />
    </svg>
  );
}

/** A line chart with labelled axes for a time series. */
export function LineChart({ points, unit, label, height = 220 }: { points: readonly { period: string; value: number; estimated?: boolean | null }[]; unit?: string | null; label: string; height?: number }) {
  if (points.length < 2) return <p className="text-sm text-content-muted">Not enough history to draw a chart.</p>;
  const w = 640;
  const pad = { l: 56, r: 16, t: 14, b: 30 };
  const values = points.map((p) => p.value);
  const min = Math.min(...values) * 0.97;
  const max = Math.max(...values) * 1.03;
  const x = (i: number) => pad.l + (i / (points.length - 1)) * (w - pad.l - pad.r);
  const y = (v: number) => pad.t + (1 - (v - min) / (max - min || 1)) * (height - pad.t - pad.b);
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(" ");
  const ticks = [0, 0.5, 1].map((t) => min + t * (max - min));
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${w} ${height}`} className="w-full">
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={w - pad.r} y1={y(t)} y2={y(t)} stroke="var(--border-default)" strokeDasharray="3 5" />
          <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--content-muted)">{short(t)}</text>
        </g>
      ))}
      <path d={path} fill="none" stroke="var(--clay)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={p.period}>
          <circle className="dot" cx={x(i)} cy={y(p.value)} r={p.estimated ? 3.4 : 4.6} fill={p.estimated ? "var(--cream)" : "var(--clay)"} stroke="var(--clay)" strokeWidth="2">
            <title>{`${p.period.slice(0, 4)}: ${n1(p.value)}${unit ? ` ${unit}` : ""}${p.estimated ? " (estimate)" : ""}`}</title>
          </circle>
          {i % Math.ceil(points.length / 7) === 0 || i === points.length - 1 ? (
            <text x={x(i)} y={height - 8} textAnchor="middle" fontSize="11" fill="var(--content-muted)">{p.period.slice(0, 4)}</text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}

export function BarList({ items, unit = "n", max }: { items: readonly { label: string; value: number; note?: string }[]; unit?: BarFormat; max?: number }) {
  const format = FORMATS[unit];
  const top = max ?? Math.max(...items.map((i) => i.value), 1);
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex justify-between gap-3 text-sm">
            <span>{item.label}</span>
            <span className="num text-content-muted">{format(item.value)}{item.note ? ` · ${item.note}` : ""}</span>
          </div>
          <div className="bar-track h-2.5"><div className="bar-fill h-full" style={{ width: `${Math.max(2, (item.value / top) * 100)}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

const PALETTE = ["var(--clay)", "var(--calabash)", "var(--raffia)", "var(--indigo)", "var(--lagoon)", "var(--plum)", "color-mix(in oklch, var(--clay) 50%, var(--cream))", "color-mix(in oklch, var(--indigo) 50%, var(--cream))"];
export const paletteAt = (i: number): string => PALETTE[i % PALETTE.length]!;

export function Donut({ slices, label, center }: { slices: readonly { label: string; value: number }[]; label: string; center?: string }) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-wrap items-center gap-5">
      <svg role="img" aria-label={label} viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        {slices.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle key={s.label} cx="70" cy="70" r={r} fill="none" stroke={paletteAt(i)} strokeWidth="20" strokeDasharray={`${Math.max(0, len - 1.5)} ${c}`} strokeDashoffset={-offset}>
              <title>{`${s.label}: ${pct(s.value / total)}`}</title>
            </circle>
          );
          offset += len;
          return el;
        })}
        {center ? <text x="70" y="70" textAnchor="middle" dominantBaseline="central" fontSize="16" fontWeight="700" fill="var(--content-primary)" transform="rotate(90 70 70)">{center}</text> : null}
      </svg>
      <ul className="min-w-40 flex-1 space-y-1.5 text-sm">
        {slices.map((s, i) => (
          <li key={s.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2"><i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: paletteAt(i) }} />{s.label}</span>
            <span className="num text-content-muted">{pct(s.value / total)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** One stacked horizontal bar made of shares (for example votes by candidate). */
export function Stacked({ parts, label }: { parts: readonly { label: string; value: number }[]; label: string }) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  return (
    <div role="img" aria-label={label} className="flex h-4 overflow-hidden rounded-full">
      {parts.map((p, i) => (
        <div key={p.label} title={`${p.label}: ${pct(p.value / total)}`} style={{ width: `${(p.value / total) * 100}%`, background: paletteAt(i) }} />
      ))}
    </div>
  );
}

/** Population by age group as horizontal bars, youngest at the top. */
export function AgeBars({ groups }: { groups: readonly { label: string; value: number; share: number }[] }) {
  const top = Math.max(...groups.map((g) => g.share), 0.01);
  return (
    <ul className="space-y-1" aria-label="Population by age group">
      {groups.map((g) => (
        <li key={g.label} className="grid grid-cols-[5.5rem_1fr_3.5rem] items-center gap-2 text-xs">
          <span className="text-content-muted">{g.label.replace(" years", "")}</span>
          <div className="bar-track h-3"><div className="bar-fill h-full" style={{ width: `${(g.share / top) * 100}%` }} /></div>
          <span className="num text-right">{pct(g.share)}</span>
        </li>
      ))}
    </ul>
  );
}
